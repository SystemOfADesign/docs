# Evaluating the skills

Two layers: automated structural tests, and behavioural evals that need an agent and a grader.

## Automated

```bash
node --test tests/
# include the browser test by pointing at a directory where playwright is installed
LIFT_PW_DIR=/path/with/playwright node --test tests/
```

Covers: skill frontmatter and size budgets, rule id traceability in both directions, evidence rows pointing at real extraction files, router coverage of every specialist, the contrast script against known WCAG values, and `probe.mjs` against the fixture. Without playwright the probe test is reported as skipped, not passed.

## Behavioural

`evals.json` holds six prompts with `must` and `must_not` criteria: one per mode, one for the brand-color approval gate, and one that should not trigger the skills. Run each in a fresh agent against a scratch copy of `fixtures/weak-settings.html`, then grade the transcript and the resulting file.

A recorded, graded run of the `comprehensive` eval is in `sample-run/` (see `sample-run/GRADE.md`: 8 of 9 criteria met). The other five cases have not been run.

## Fixture: seeded defects

`fixtures/weak-settings.html` is a small settings screen with tokens in `:root`. It is a test input, not an application. A good run finds most of these.

| # | Defect | Measurement | Rule |
|---|---|---|---|
| 1 | Header text red on brand purple | `#ff2424` on `#5b3df5` = 1.61:1 | C1, C9 |
| 2 | Footer muted text on page | `#757575` on `#ececec` = 3.90:1 | C2 |
| 3 | Plan card metadata | `#b9aef9` on `#5b3df5` = 3.06:1 | C1 |
| 4 | Every text role is 16px regular | 1 size, 1 weight | T1, T3 |
| 5 | Eyebrow, heading and body identical | same computed style | T1, T14 |
| 6 | Heavy rule under every heading | 3px black | S2 |
| 7 | Dashed dividers between form rows | 1px dashed black | S2 |
| 8 | Cards outlined, shadowed and filled | 2px black + 45% shadow | S6, S10 |
| 9 | Avatar with stacked borders in two colors | 3px black + 3px yellow ring | S6 |
| 10 | Owner card centered beside left-aligned cards | 3 centered text blocks, 5 left edges | L1, L2 |
| 11 | Two identical filled buttons; no primary | same fill | L16 |
| 12 | Oversized buttons, cramped cards | 18px 44px button padding vs 13px card padding | L12, L17 |
| 13 | Off-scale spacing | 13, 14, 18, 11, 7px vs 4/8/12/16/24/32 tokens | L9 |
| 14 | Phone and Email side by side in a column | flex row with 40px gap | L5 |
| 15 | Duplicate heading in Support | two `h2` | L15 (gated) |
| 16 | Whole card flooded with saturated brand | plan card fill `#5b3df5` | C8 |
| 17 | Links indistinguishable from text | no underline, same color | T17 |

## Acceptance criteria for the skill system

1. **Routing.** A single-dimension request loads one specialist and edits only that dimension.
2. **Evidence.** Every finding carries a location, a measurement and a rule id.
3. **Preservation.** Framework, markup semantics, behavior, brand hue, typeface and breakpoints are unchanged unless approved.
4. **Gate.** Brand color, structure, copy and new styles are asked about, not done.
5. **Accessibility.** After any change: text AA passes by measurement, focus is visible, 200% zoom works, tab order is intact.
6. **Validation.** Before and after are compared at identical viewports, or the absence of tooling is stated.
7. **Report.** Change log with before and after values, validation results, residual issues.
8. **Restraint.** No new aesthetic is introduced; the result is recognisably the same product.
