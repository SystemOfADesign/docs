# Recorded run: `comprehensive` eval

One real run of the skills, graded against `evals.json`. Only this eval was run; the other five cases have not been executed.

- **Date:** 2026-11-20
- **Agent:** a fresh general-purpose agent given only the skill paths, a scratch copy of the fixture, and the prompt "Elevate settings.html. Keep it recognisably the same product." It was told not to read `evals/` or `tests/`, and that nobody could answer approval questions.
- **Mode chosen:** full. Loaded the router, all four specialists and the audit checklist.
- **Files here:** `before/` and `after/` (screenshots at 375 and 1280, `metrics.json`), `settings.after.html`, `agent-report.md` (the agent's own report, unedited).

The metrics files were regenerated with the final `probe.mjs` after the run, because the probe gained gap, radius and focus measurements afterwards. The screenshots and the edited HTML are the agent's.

## Measured before and after (1280px)

| Metric | Before | After |
|---|---|---|
| Contrast failures | 3 (1.61, 3.06, 3.90) | 1 (1.61, header wordmark) |
| Bordered elements | 21 | 6 (3 inputs, 3 outline buttons) |
| Distinct text sizes | 16 | 16, 20 |
| Distinct shadows | 2 | 1 |
| Columns with ragged left edges | 1 | 0 |
| Text alignment (non-control text) | 20 left, 3 center | 23 left |
| Vertical gaps in use | 3, 6, 11 px | 4, 8, 12, 16, 24 px (all on the token scale) |
| Radii in use | 8, 6, 4 px, 50% | 8 px, 50% |
| Tab stops / without visible focus | 9 / 0 | 9 / 0 |
| Horizontal overflow at 375 and 640 | no | no |

## Grade

| Must | Result |
|---|---|
| Before and after screenshots at the same viewports | pass |
| All text passes WCAG AA after the change | **fail**: header wordmark left at 1.61:1 |
| Brand purple still the accent; typeface unchanged | pass |
| Heavy borders removed or reduced; inputs keep a boundary | pass (inputs 1px `#8a8a8a`, 3.45:1) |
| Shadow removed or reduced | pass (45% to 10%) |
| Saturated plan card flagged or reduced | pass (flagged, gated) |
| Changes in `:root` tokens and shared selectors | pass |
| Focus visible; no overflow at 375px | pass |
| Report with before and after values, validation, residual issues | pass |

| Must not | Result |
|---|---|
| Rewrites markup structure or removes sections | respected |
| Introduces a new visual style | respected |
| Removes focus outlines | respected |

**8 of 9 must, 3 of 3 must-not.**

## What the failure showed, and what changed

The agent read the red header text as "logo treatment", which the approval gate protects, and with nobody to ask it left a severity-1 contrast failure in place. The gate was too broad. After this run the router and specialists were revised:

- An accessibility failure is not parked behind the gate when a fix exists inside current values; text on a brand fill is not the brand.
- The gate now says what counts as structure (page grid, not re-stacking inside a block) and as color approach (how a whole surface is colored).
- What to do when nobody can answer, and when the product has no tokens for a value.
- `lift-type` defines role versus tier; `lift-surfaces` separates structural lines from control boundaries.
- `probe.mjs` no longer counts control labels in the alignment mix, and reports gaps, radii and a keyboard pass.

These revisions have not been re-run against the eval. Treat the header-contrast behaviour as fixed in the text but unverified.

Other things the agent did that were not asked for by the eval but match the skills: aligned the header wordmark to the content column, stacked Phone and Email, underlined links in the brand color, and replaced fixed input heights.
