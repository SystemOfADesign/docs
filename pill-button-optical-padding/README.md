# pill-button-optical-padding

Agent skill that audits and fixes padding on pill / rounded buttons: concentric edge icons and an optical edge strip for labels, applied per child so every variant holds. Formulas, scope and worked examples are in `SKILL.md` and `references/`; `references/provenance.md` holds attribution and archival evidence (optional).

## Install

```bash
cp -r pill-button-optical-padding ~/.claude/skills/        # personal
# or: cp -r pill-button-optical-padding <repo>/.claude/skills/   # project
```

## Use

```
/pill-button-optical-padding audit the buttons in src/components/Button.tsx and the dashboard page, then fix them
```

or: "our pill buttons' icons look off-center and the text sits too close to the edge; fix it across the app".

## Verify

```bash
python3 scripts/pill_math.py --py 8 --px 16 --lh 24 --cap 12          # strip 4.29, optical 11.71 -> 16
node scripts/audit_buttons.mjs tests/fixtures/after.html             # needs playwright (or PILL_PW_DIR)
python3 -m unittest discover -s tests                                 # deterministic numbers
node --test tests/                                                    # Chromium before/after (skips without playwright)
```
