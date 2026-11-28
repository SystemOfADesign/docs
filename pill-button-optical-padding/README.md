# pill-button-optical-padding

An agent skill that audits and fixes pill / rounded button padding using the exact math from Ariakit's reel "You (and Claude) have been styling pill buttons wrong" (https://www.instagram.com/reel/DgQdaYhCFeA/, 2026-11-27):

- icon concentric with the round end: `margin-inline-start: calc(var(--py) - var(--px))`
- label gets back the strip the curve steals: `margin-inline-end: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill))` with `--pill: calc(var(--py) + 0.5lh)` and the **real** radius (`999px` breaks it)
- per-child `--edge` plus `:first-child` / `:last-child` rules so icon-first, icon-last, text-only and icon-only all hold

The reel's formulas are preserved verbatim (`SKILL.md`, `references/math.md`); evidence is in `references/reel-evidence.md` and `evidence/`. Anything the reel does not say is isolated in `references/supplemental.md` and flagged in reports.

## Install

```bash
cp -r pill-button-optical-padding ~/.claude/skills/        # personal
# or: cp -r pill-button-optical-padding <repo>/.claude/skills/   # project
```

## Use

```
/pill-button-optical-padding audit the buttons in src/components/Button.tsx and the dashboard page, then fix them
```

or just ask: "our pill buttons' icons look off-center and the text sits too close to the edge; fix it across the app".

The agent will read the button component and tokens, run `scripts/audit_buttons.mjs` (Playwright) or `scripts/measure-buttons.js` (any browser console) to measure before, apply the reel's CSS through the shared component, re-measure, and report before/after numbers per variant.

## Verify by hand

```bash
python3 scripts/pill_math.py --py 8 --px 16 --lh 24 --cap 12          # reel numbers: strip 4.29, optical 11.7 -> 16
node scripts/audit_buttons.mjs tests/fixtures/after.html             # needs playwright (or PILL_PW_DIR)
python3 -m unittest discover -s tests                                 # deterministic reel numbers
node --test tests/                                                    # browser before/after (skips without playwright)
```
