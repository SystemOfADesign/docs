# T3 Code Automations: Implementation, Exposure, and a Scale-Out Plan

Source studied: `pingdotgg/t3code` at commit `810e8f62f` (Nov 2026).
Paths below are relative to that repo.

---

## 1. One-paragraph summary

T3 Code "automations" (internally **scheduled tasks**) are owned entirely by the
T3 server. A task is a database row with a prompt, a schedule, and a
`next_run_at` timestamp. A 5-second heartbeat inside the server polls for due
rows and, for each one, behaves exactly like a user pressing Send: it either
launches a new thread or queues a message into an existing one. The provider
CLI (Claude Code, Codex, Cursor, etc.) receives an ordinary user turn and has no
idea a scheduler was involved. There are two front doors to create a task, the
Settings UI and a `schedule_task` MCP tool, and both call the same service.

---

## 2. Data model

Contract: `packages/contracts/src/scheduledTask.ts`
Storage: SQLite table `scheduled_tasks` (+ `scheduled_task_webhook_pending`)

```ts
ScheduledTask = {
  id, title, prompt, enabled,
  schedule:            Interval | FixedTime | Webhook,
  projectId,
  threadId:            ThreadId | null,   // null => launch a new thread per run
  workspaceStrategy,                      // root | worktree | existing_worktree
  modelSelection, runtimeMode, interactionMode,
  createdBy, creationSource,
  createdAt, updatedAt,
  nextRunAt:           ISO | null,        // precomputed; null for webhook tasks
  lastRunAt, lastRunStatus: never|running|succeeded|failed, lastRunError,
  runCount,
  webhook?: { path, url | null, hasSecret },
}
```

### Schedule types

| type         | fields                                  | notes |
|--------------|-----------------------------------------|-------|
| `interval`   | `everyMs`                               | floor 60 000 ms, enforced on read so old rows cannot keep a faster rate |
| `fixed_time` | `timeOfDay: "HH:MM"`, `weekdays?: 0..6` | **server-local** time zone; DST handled by `effect/DateTime` |
| `webhook`    | `signature?`, `maxDeliveryAgeMinutes?`, `dedupe?`, `filters?` | fires only on HTTP request; `nextRunAt` stays null |

`nextScheduledRunAt()` in `apps/server/src/scheduledTasks/Schedule.ts` computes the
next slot. For fixed time it walks up to 7 days forward to find the next
matching weekday.

---

## 3. Execution loop

### 3.1 Heartbeat

`apps/server/src/scheduling/Scheduler.ts`

- A generic `Scheduler.register(name, effect)` service.
- Every **5 seconds** it runs every registered source.
- Each source holds a 1-permit semaphore: if the previous tick of that source is
  still running, the new tick is skipped (`withPermitsIfAvailable`).
- Sources are "parked" until server activation completes so the first tick
  cannot race startup recovery.

Two sources register: `scheduled-tasks` (timers) and `webhook-coalescing`
(pending webhook deliveries).

### 3.2 Due query

`ScheduledTaskService.listDueTasks`:

```sql
SELECT * FROM scheduled_tasks
WHERE enabled = 1
  AND next_run_at IS NOT NULL
  AND next_run_at <= :now
  AND last_run_status <> 'running'
ORDER BY next_run_at ASC, task_id ASC
```

Undecodable or corrupt rows are logged and skipped, never crash the poll.

### 3.3 Per-task run (`runTask`)

Sequence, with the invariants that matter:

1. **Reserve** the task id in an in-memory `Set` (`activeRuns`). If already
   present, a scheduled trigger returns silently; a manual trigger errors with
   "already running".
2. **Re-read the row.** The polled snapshot may be stale. If the task was
   deleted, paused, or its `next_run_at` moved into the future since the poll,
   do nothing.
3. **Mark `running`** and write `last_run_at`.
4. **Dispatch** with a deterministic idempotency key
   `scheduled-task:${taskId}:${startedAtMs}:${trigger}` used as both the
   orchestration `commandId` and the `messageId`:
   - `threadId === null`: `ThreadLaunchService.launch({... initialMessage: { text: prompt, scheduledTaskId } })`
   - `threadId !== null`: `ThreadManagementService.sendToThread({ mode: "queue", text: prompt, scheduledTaskId })`
     A bound run follows the thread's **current** provider/model; the stored
     selection only seeds fresh threads.
5. **Record completion** immediately after dispatch: status `succeeded` or
   `failed`, `runCount + 1`, and a new `next_run_at` computed from the
   completion time. `succeeded` means **the message was handed off**, not that
   the agent finished its work.
6. On any error, `releaseStuckRun` resets the row; `ensuring` always removes the
   id from `activeRuns`.

The only trace left on the resulting conversation message is the
`scheduledTaskId` field. No system-prompt text is added for a scheduled run.

### 3.4 Missed runs

`isMissedFixedTimeRun`: a fixed-time run that is more than **10 minutes**
overdue (server was asleep or down) is **skipped**, logged, and rescheduled to
the next slot. Interval tasks just fire on the next tick; there is no catch-up
burst.

### 3.5 Crash recovery

On boot, every row with `last_run_status = 'running'` is set to `failed` with
error "Run was interrupted by a server restart." and `next_run_at` is
recomputed. Without this the due filter would ignore those rows forever.

### 3.6 Concurrency summary

| guard                      | where            | protects against |
|----------------------------|------------------|------------------|
| `activeRuns` Set           | memory           | same task firing twice inside one process |
| `last_run_status <> running` | SQL filter     | same, across polls |
| `concurrency: 1` in `forEach` | poll loop      | tasks of one tick running in parallel |
| semaphore per source       | Scheduler        | ticks overlapping |
| deterministic `commandId`  | orchestrator     | replay of the same fire creating two threads |

---

## 4. Webhook variant

Same `runTask`, different trigger. Endpoint `POST /…/{taskPath}`:

1. Optional HMAC-SHA256 signature check (`header`, `encoding`, `prefix`,
   secret stored via `request_secret`).
2. `maxDeliveryAgeMinutes`: drop requests the T3 Connect relay held too long
   while the environment was offline (max 24h).
3. **Filters** (up to 16): `path op value` over `body.*`, `headers.*`,
   `query.*`; ops `equals | notEquals | in | startsWith | exists`. All must
   match or the request is logged as *Filtered* and nothing runs.
4. **Dedupe**: `replayKey` template (7-day memory) and `coalesceKey` template
   with a window (10–3600 s, default 120) that keeps the latest payload.
5. Per-task rate window and queue cap; overflow returns `rate_limited` /
   `queue_full`.
6. Prompt is rendered from placeholders `{{body.path}}`, `{{headers.name}}`,
   `{{query.name}}`, `{{body}}`, `{{request}}`. Each value is wrapped in
   `<webhook-data-…>` tags and marked untrusted; `$`, `@`, and leading `/`
   get an invisible character so `$skill`, `@file`, `/command` mentions do
   not act (`apps/server/src/scheduledTasks/webhookTemplate.ts`).
7. Delivery is written to `scheduled_task_webhook_pending`; the
   `webhook-coalescing` source dispatches it on the next tick.

A public URL requires a T3 Connect managed tunnel; otherwise only the path is
shown.

---

## 5. How automations are exposed

Automations are a **data + scheduler** feature. The LLM-facing surface is
deliberately thin.

### 5.1 Front door A: Settings UI (no LLM involved)

Settings → Scheduled tasks →
`apps/web/src/components/settings/ScheduledTasksSettings.tsx` →
WebSocket RPC (`packages/contracts/src/rpc.ts`, `scheduledTask.*` methods) →
`ScheduledTaskService.upsert | list | delete | runNow | rotateWebhookToken`.

Mobile has the same screen; fixed-time schedules use the **environment's**
time zone, not the phone's.

### 5.2 Front door B: MCP tools (agent-driven)

The `t3-code` MCP server (`apps/server/src/mcp/toolkits/orchestrator/tools.ts`)
exposes:

| tool                      | maps to                      |
|---------------------------|------------------------------|
| `schedule_task`           | `ScheduledTaskService.upsert` |
| `list_scheduled_tasks`    | `.list`                       |
| `run_scheduled_task_now`  | `.runNow`                     |
| `delete_scheduled_task`   | `.delete`                     |
| `request_secret`          | private secret entry; returns a one-shot `secretRef` for webhook signatures |

Both doors call the **same service methods**. The MCP handler decodes input,
calls one method, maps errors. This is the repo rule "server features are
services; transports stay thin."

Defaults when an agent schedules from inside a thread: project inherited,
`bindToCurrentThread = true` (runs post back into the calling thread so the
orchestrating agent sees every trigger), provider/model/runtime inherited.

### 5.3 What the model is told

T3 does **not** replace any provider's system prompt. It appends a shared block
from `packages/provider-core/src/server/orchestrationInstructions.ts`, and only
when the `t3-code` MCP server is attached to the turn.

| provider | injection slot |
|----------|----------------|
| Claude Code | SDK `systemPrompt: { preset: "claude_code", append }` |
| Codex | `developer_instructions` (mode) + `additionalContext` entries, chunked <4 KB because Codex silently truncates long entries |
| ACP agents (Cursor, OpenCode, Grok, Antigravity) | no system slot; wrapped into the **first user message** as `<t3_code_instructions>…</t3_code_instructions><user_request>…</user_request>` |

Automation-specific prompt text is one short section: how to shape the
`schedule` object, prefer binding to the current thread, use `request_secret`
for signing secrets, report `nextRunAt` / `webhookUrl`. The mechanics
(placeholders, filters, dedupe, signature shape) live in the `schedule_task`
tool **description**, not the prompt.

A **firing** task adds no instruction text at all.

---

## 6. Why the single-process design works for T3

- One server process owns one SQLite file; in-memory `Set` + SQL status column
  are sufficient mutual exclusion.
- Users run their own server, so "one tenant per process" is the model.
- 5-second polling is cheap against a local SQLite with a tiny table.
- The orchestrator's deterministic command ids make redelivery harmless.

---

## 7. Scale-out plan: multi-tenant on GKE (ArgoCD)

Keep the shape (row with `next_run_at`, poller, "dispatch = send a message").
Replace the in-process loop with leased pollers, a queue, and a worker pool.

### 7.1 What changes

| concern        | T3 single user                  | distributed |
|----------------|---------------------------------|-------------|
| timer          | in-process 5 s loop             | 2+ poller replicas with row leases |
| due query      | `next_run_at <= now`            | same + `FOR UPDATE SKIP LOCKED`, batched |
| overlap guard  | memory Set + status column      | `lease_until` column |
| execution      | same process                    | enqueue job; workers execute |
| time zone      | server local                    | IANA tz per task |
| crash recovery | mark `running` rows failed on boot | lease expiry + reaper |
| deploys        | n/a                             | rollout must not orphan leased runs |

### 7.2 Components

**Scheduler** (Deployment, 2 replicas, small)

```sql
SELECT * FROM scheduled_tasks
WHERE enabled
  AND next_run_at <= now()
  AND (lease_until IS NULL OR lease_until < now())
ORDER BY next_run_at
LIMIT 500
FOR UPDATE SKIP LOCKED;
```

For each row, in the same transaction: set `lease_until = now() + N`,
**write the new `next_run_at` before dispatch**, enqueue
`{ taskId, tenantId, fireAt }` with idempotency key `taskId:fireAt`.
`SKIP LOCKED` makes two concurrent pollers safe without leader election.

**Queue**: Pub/Sub, Cloud Tasks, Redis Streams, or a Postgres-backed queue
(`graphile-worker`, `pg-boss`). Cloud Tasks can also schedule fixed-time runs
at save time and skip the poller for them.

**Workers** (Deployment, HPA / KEDA on queue depth)

1. Re-read the task row; skip if paused, deleted, or replaced (T3 does this
   check too; it matters more with a queue in between).
2. Create thread or append to bound thread; start the LLM turn with
   idempotency key `taskId:fireAt` on the send.
3. Record `last_run_at`, status, error; clear lease.

### 7.3 Tenancy and scale knobs

- `tenant_id` on every row and job; index `(enabled, next_run_at)`.
- Per-tenant rate limit at the worker (token bucket in Redis) so one tenant
  with thousands of 1-minute tasks cannot starve others.
- Minimum interval floor (T3: 60 s); raise for free tiers.
- Jitter fixed-time runs by 0–60 s or shard tenants into minute offsets to avoid
  the 09:00 thundering herd.
- Store `tz` per task; compute next run with a tz-aware library.
- Explicit missed-run policy per task: `skip` (T3 default, 10-min grace) or
  `catch_up`. Never silently fire a backlog after an outage.

### 7.4 Correctness traps

- Aim for **at-least-once + idempotent dispatch**, not exactly-once.
- Write `next_run_at` **before** dispatch; writing after means a worker crash
  re-fires immediately.
- Lease + reaper replaces T3's boot-time cleanup: rows past `lease_until`
  still `running` are marked failed and rescheduled.
- Re-validate the row at execution time (pause/delete race).
- Graceful shutdown: `preStop` hook, `terminationGracePeriodSeconds` long enough
  to finish or release an in-flight run, `maxUnavailable: 0` on workers.

### 7.5 GKE / ArgoCD specifics

- Scheduler and workers as separate Deployments in one ArgoCD Application.
- Postgres (Cloud SQL), not SQLite; `SKIP LOCKED` needs 9.5+.
- Migrations as an ArgoCD `PreSync` hook Job.
- `PodDisruptionBudget` on the scheduler so node drains do not drop both replicas.
- KEDA scaler on Pub/Sub or Redis for workers.

### 7.6 Webhooks at scale

Public ingress `POST /hooks/{taskId}/{token}` → verify HMAC → filters → render
prompt → **enqueue the same job type** keyed by delivery id → return 202.
Dedupe / coalesce windows map to Redis keys with TTL. Workers do the rest.

### 7.7 Simplest viable version

Postgres + 2 scheduler replicas using `SKIP LOCKED` + workers consuming a
Postgres-backed queue. One database, no Pub/Sub, no leader election. Move to
Pub/Sub / Cloud Tasks only when poll latency or queue depth forces it.

---

## 8. Design rules worth copying

1. **Service, not handler code.** One `ScheduledTaskService`; UI RPC and MCP
   tools are thin wrappers. Scheduled runs, manual runs, and webhook runs share
   one `runTask`.
2. **Fire = send a message.** No special execution path; the provider is
   unaware. This is what lets any provider work and keeps the prompt surface
   tiny.
3. **Deterministic ids everywhere.** `commandId` and `messageId` derived from
   `taskId + fireTime` make retries safe.
4. **Re-read before acting.** Polled snapshots are stale by definition.
5. **Skip, do not catch up.** Missed runs are logged and rescheduled.
6. **Mechanics in tool descriptions, policy in the prompt.** Keeps the
   appended system prompt short and provider-agnostic.
7. **Gate instructions on tool availability.** Never describe a tool the model
   cannot call.

---

## 9. File index

| what | path |
|------|------|
| contract / schema | `packages/contracts/src/scheduledTask.ts` |
| heartbeat | `apps/server/src/scheduling/Scheduler.ts` |
| next-run math, missed-run grace | `apps/server/src/scheduledTasks/Schedule.ts` |
| service (due query, runTask, recovery, webhooks) | `apps/server/src/scheduledTasks/ScheduledTaskService.ts` |
| webhook prompt rendering | `apps/server/src/scheduledTasks/webhookTemplate.ts` |
| MCP tools | `apps/server/src/mcp/toolkits/orchestrator/tools.ts` |
| MCP service → scheduled task service | `apps/server/src/mcp/OrchestratorMcpService.ts` |
| web settings UI | `apps/web/src/components/settings/ScheduledTasksSettings.tsx` |
| shared appended instructions | `packages/provider-core/src/server/orchestrationInstructions.ts` |
| Claude injection | `apps/server/src/orchestration-v2/Adapters/ClaudeAdapterV2.ts` (`systemPrompt.append`) |
| Codex injection | `apps/server/src/provider/CodexDeveloperInstructions.ts` |
| user docs | `docs/user/project-settings.md` (Scheduled tasks, Webhook automations) |
