# Automations golden set

A fixed, versioned set of scenarios for the scheduled-task / automations feature.
Run it against every build of the scaled implementation. Compare against
`baseline.json` (what T3 Code does today, measured from real usage) and against
the previous build. Ship only on GO.

Companion design doc: [../automations.md](../automations.md).

## Files

| file | what |
|------|------|
| `golden-set.jsonl` | 95 cases, one JSON object per line |
| `baseline.json` | metrics extracted from a real T3 Code SQLite db (3 tasks, 5 runs, Nov 2026) |
| `README.md` | this: case format, runner contract, GO/NO-GO rubric |

## Where the cases come from

| tier | count | origin | what it proves |
|------|-------|--------|----------------|
| `prod` | 9 | the user's real db: 3 fixed-time tasks, 5 completed runs, a DST transition, measured dispatch delays, agent replies | the new system must not regress what already works for a real user |
| `spec` | 69 | T3 Code's own test suite (62 test names across `Schedule`, `ScheduledTaskService`, webhook, template, scheduler, contract tests) rewritten as black-box scenarios | the full feature surface, including everything the prod corpus never touched |
| `scale` | 17 | the GKE / multi-tenant design (§7 of the design doc) | properties that have no single-process analogue: leases, redelivery, tenancy, rollouts |

Honest note on the prod corpus: it is small and one-shaped. All three tasks are
fixed-time, Claude, bound to one thread, created by an agent through MCP, and
every run succeeded. It is a **floor**, not a spec. The `spec` tier is the spec.
`baseline.json` lists the gaps explicitly.

## Case format

```json
{
  "id":     "SPEC-052",
  "tier":   "prod | spec | scale",
  "sev":    "P0 | P1 | P2",
  "area":   "schedule | dispatch | recovery | webhook | prompt-safety | exposure | quality | scale",
  "title":  "one line",
  "given":  { ...fixture state: rows, clock, tenants, tunnel, queue... },
  "when":   "the action or time advance",
  "then":   [ "assertion", "assertion" ],
  "metric": { "<name>_p95_max": 5000 },      // optional, numeric gate
  "source": "where the expected behaviour was taken from"
}
```

Some cases carry `and_given` / `then2` for a second arm. Treat them as two
sub-cases that must both pass.

Severity:

- **P0**: correctness or safety. Duplicate fire, lost fire, data crossing
  tenants, secret leak, prompt injection, unrecoverable stuck row.
- **P1**: behaviour a user would notice and file a bug about.
- **P2**: observability, prompt-plumbing details, polish.

## Runner contract

The set is implementation-agnostic. A runner needs four adapters:

1. **Fixture loader**: turn `given` into state. Rows in the task table, fake
   clock, tenant ids, a fake tunnel, a fake queue. For `spec` cases the T3
   test files named in `source` show exactly how T3 builds the same fixture.
2. **Clock**: all time-based cases must run on a controllable clock. No sleeps.
   "Advance 8 days" is one call.
3. **Dispatch sink**: capture every "send message / launch thread" call with
   its idempotency key instead of calling an LLM. Most cases assert on the
   sink: count, text, ids, thread. Only the two `quality` cases need a real
   model.
4. **Observer**: read back task rows, delivery log, lease columns, emitted
   events, and metrics.

Each case produces `{ id, pass: bool, observed: {...}, metric_values: {...} }`.
Write results as JSONL beside the build id so runs are diffable.

## Metrics to collect every run

| metric | prod baseline | gate for scaled build |
|--------|---------------|-----------------------|
| dispatch_delay_ms p95 (due → message created) | 4 985 ms | ≤ 15 000 ms single-tenant idle, ≤ 15 000 ms cross-tenant under load (SCALE-006) |
| dispatch_success_rate | 1.00 | ≥ 0.999 |
| duplicate_fires | 0 | 0 |
| missed_fires (due, not dispatched, not deliberately skipped) | 0 | 0 |
| stuck_running_rows after chaos (crash, SIGTERM, rollout) | n/a | 0 |
| webhook_ack_ms p95 | n/a | ≤ 500 ms |
| due_query_ms p95 at 1M rows | n/a | ≤ 200 ms |
| prompt_compliance_rate (quality cases, LLM-judged or regex) | 1.00 (5/5) | ≥ 0.95 |
| run_duration_ms p95 for the prod prompt | 69 573 ms | ≤ 120 000 ms |

## GO / NO-GO rubric

A build is **GO** only if all of the following hold:

1. **Every P0 passes.** No exceptions, no waivers.
2. **P1 pass rate ≥ 95%**, and every P1 failure has a linked issue.
3. **Every `prod` case passes.** A regression on real usage is an automatic NO-GO
   regardless of tier math.
4. **No metric worse than the previous GO build by more than 10%**, and no
   metric outside its gate in the table above.
5. **Chaos arm clean**: SCALE-003, SCALE-010, SCALE-015 run with real pod kills
   on a staging cluster, not only with a fake clock.

Otherwise **NO-GO**. Record the failing ids and the metric deltas in the
release notes.

## Keeping the set alive

- When production (yours, at scale) produces a new task shape, incident, or a
  run that surprised someone, add a `prod` case with the real `given` and the
  observed `then`. That is how the corpus grows past 9.
- When T3 Code adds a test to `apps/server/src/scheduledTasks/*.test.ts`, port
  it as a `spec` case. Their suite is the upstream spec; the file index in the
  design doc says where to look.
- Never delete a case. If behaviour changes on purpose, rewrite `then`, bump
  the id suffix, and note the decision in `source`.

## Quick views

Count by tier and severity:

```sh
python3 -c "import json,collections as c;t=c.Counter();s=c.Counter()
for l in open('golden-set.jsonl'):
  d=json.loads(l);t[d['tier']]+=1;s[d['sev']]+=1
print(dict(t),dict(s))"
```

P0 cases only:

```sh
grep '"sev":"P0"' golden-set.jsonl | python3 -c "import sys,json;[print(json.loads(l)['id'],json.loads(l)['title']) for l in sys.stdin]"
```
