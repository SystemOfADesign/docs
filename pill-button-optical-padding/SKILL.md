---
name: pill-button-optical-padding
description: Audit and fix padding on pill and rounded buttons so icons sit concentric with the round end (edge margin py - px) and labels get back the space the curve removes (edge strip r * (1 - pi/4) * r / pill), applied per child with :first-child / :last-child so icon-first, icon-last, text-only and icon-only all hold. Use whenever a request involves pill buttons, rounded-full / 9999px buttons, chips, tags, badges, icon+text buttons, icon alignment inside buttons, "text looks too close to the edge", "icon looks off-center", or an audit of button padding across an app, even if nobody says "optical" or "concentric".
---

# Pill button optical padding

A rounded button with `padding: py px` has two geometric defects that this skill measures and corrects:

1. **Edge icon off-center.** An icon at the straight edge sits `px` from that edge but `py` from top and bottom, so it is not concentric with the round end.
2. **Edge label optically too close.** The curve removes area from the two corners next to the label, so the average horizontal space between the label and the curve is less than `px`.

Both fixes are closed-form, so they hold when padding, radius, font size or child order changes. Attribution and archival evidence for the method are in `references/provenance.md`; it is optional reading and not needed to apply the skill.

## The math (normative)

### Definitions

| Symbol | CSS | Meaning |
|---|---|---|
| `py` | `--py` | vertical padding |
| `px` | `--px` | horizontal padding |
| `lh` | `1lh` | line-height of the button text; icon box is `1lh × 1lh` |
| `cap` | `1cap` | cap height of the button font; used only in `gap` |
| `pill` | `--pill: calc(var(--py) + 0.5lh)` | half the button height when content is one line box (`r` of a full pill) |
| `r` | `--r` | the **rendered** corner radius. For a full pill set `--r: var(--pill)`. A `999px` / `9999px` token must never enter the formulas |
| `k` | `(1 - pi / 4)` | 0.2146, the share of a corner square a quarter circle leaves uncovered |
| `--edge` | per child | extra room a child needs at the button edge: negative for an icon, positive for a label |

Valid scope: single-line content (`1lh` tall), no border, `px >= py`, `0 <= r <= pill`. Outside that, see `references/supplemental.md` and report instead of guessing.

### Formulas

```
edge_icon  = py - px                      # icon margin at the edge (negative)
edge_label = r * (1 - pi/4) * r / pill    # label margin at the edge
gap        = max(py, px - (lh - cap) / 2) # icon-to-label gap; shown with the method, never derived
```

Derivation of `edge_label`: each rounded corner leaves `r² (1 − π/4)` of its square uncovered; the label's end meets two corners; spreading `2 r² k` over the button height `2·pill` gives a strip of width `r·k·r / pill`. For a full pill (`r = pill`) the strip is `r (1 − π/4)`. Using a declared `999px` instead of the rendered radius inflates the strip to thousands of px.

### Target CSS

```css
button {
  --py: 0.5em;
  --px: 1em;
  --pill: calc(var(--py) + 0.5lh);
  --r: var(--pill);                /* full pill; otherwise the design's real radius token */
  padding: var(--py) var(--px);
  gap: max(var(--py), var(--px) - (1lh - 1cap) / 2);
  border-radius: var(--r);
}
.icon  { width: 1lh; height: 1lh; --edge: calc(var(--py) - var(--px)); }
.label { --edge: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill)); }
button > :first-child { margin-inline-start: var(--edge); }
button > :last-child  { margin-inline-end:   var(--edge); }
```

Each child declares its own `--edge`; the two child rules hand it to whichever child touches an edge, so order does not matter: icon first, icon last, label only (strip both ends), icon only (`py` all around).

### Reference values (16px font, 24px line-height, cap 12)

| Case | py | px | r | pill | edge_icon | edge_label | optical space before → after |
|---|---|---|---|---|---|---|---|
| default pill | 8 | 16 | 20 | 20 | −8 | 4.292 | 11.71 → 16 |
| `--r: 999px` fed to the formula | 8 | 16 | 999 | 20 | −8 | 10,708.6 | broken |
| `--py: 0.7em` | 11.2 | 16 | 23.2 | 23.2 | −4.8 | 4.979 | 11.02 → 16 |
| `--r: 19px` | 8 | 16 | 19 | 20 | −8 | 3.874 | 12.13 → 16 |
| `--r: 4px` | 8 | 16 | 4 | 20 | −8 | 0.172 | 15.83 → 16 |
| square, `r = 0` | 8 | 16 | 0 | 20 | −8 | 0 | 16 → 16 |

`scripts/pill_math.py` prints these for any inputs; `tests/test_pill_math.py` pins them. More rows and the Chromium measurements are in `references/math.md`.

## Workflow

### 1. Read the system first

- Find the shared button component(s), tokens (CSS custom properties, Tailwind theme, theme objects) and size variants. Fix the shared component, not call sites.
- List in-scope variants: text-only, icon-first, icon-last, icon-only, each size. Rounded chips, tags and badges count.
- Record per variant: font-size, line-height px, padding-block, padding-inline, declared and rendered radius, gap, icon box, child margins, border width. Note which values are tokens.

### 2. Measure

Run `node scripts/audit_buttons.mjs <url-or-file> [--selector <css>]` (Playwright; set `PILL_PW_DIR` if it is installed elsewhere) or paste `scripts/measure-buttons.js` into the browser console and call `measurePillButtons()`. Per button it reports `py`, `px`, `lh`, rendered `r`, `pill`, the expected edges and two checks, 0.5 px tolerance:

| Check | Passes when |
|---|---|
| `icon-concentric` | an edge icon's distance to the straight edge equals `py` |
| `label-strip` | an edge label's margin equals `r·k·r / pill` |

It also prints the optical space `px + margin − r·k·r/pill` (equals `px` when `label-strip` passes) and warns when the declared radius is larger than the rendered one or the content is taller than `1lh`. `r = 0` passes trivially. Keep the before table for the report.

### 3. Plan the smallest change

- Alias `--py` / `--px` to the existing spacing tokens and `--r` to the existing radius token. If the token is `rounded-full` / `9999px`, keep it for the picture and set `--r: var(--pill)` for the math; the rendering is identical.
- Children must be addressable as icon or label (class, `data-slot`, `svg`). A bare text node needs a `span.label` wrapper; say so.
- Keep the system's own icon-to-label gap if it defines one; otherwise use the `gap` rule above.
- Ask before changing brand radius, token values or markup beyond wrapping a label. Do not override a deliberately asymmetric design silently.

### 4. Implement

Apply the target CSS through the shared component, translated per `references/adapting.md` (plain CSS, Tailwind, CSS-in-JS, component libraries, SwiftUI / Compose / React Native / Flutter). Remove hand-written icon margins (`mr-2`, `startIcon` offsets) that the per-child `--edge` replaces. Add both child rules.

### 5. Verify

Re-run the audit on the same pages: every in-scope button passes both checks. Cover one button per variant and size, plus RTL if supported. Run the project's own lint, tests and visual regression. `python3 scripts/pill_math.py --py 8 --px 16 --lh 24 --cap 12` gives reviewers the expected numbers by hand.

### 6. Report

```
# Pill button padding: <app/component>
## Scope: components, variants, pages measured
## Before: measured table and failing checks
## Change: files touched, tokens aliased, markup changes
## After: same table, all checks passing
## Kept deliberately: system values left alone and why
## Supplemental: anything applied from references/supplemental.md, with both numbers where it changes one
## Open questions
```

## Supplemental (not part of the method; never changes the formulas silently)

Engineering and accessibility notes outside the formulas' scope. If one would change a number the formulas produce, list both numbers under "Supplemental" and let the user decide. Details and conflict rules in `references/supplemental.md`.

- `lh`, `cap` and `pi` in `calc()` need current browsers; fallbacks: `0.2146` for `(1 - pi/4)`, an explicit line-height token for `1lh`.
- Over-large radius tokens render clamped to `pill`; `--r: var(--pill)` is the faithful fix, `min(var(--r), var(--pill))` a convenience with the same result for pills.
- Borders: the label meets the padding box's inner corner (`r − border-width`); flag, do not assume.
- Multi-line labels or taller icons: `pill = py + contentHeight / 2`; the audit measures content height and flags a mismatch with `0.5lh`.
- Minimum target size (WCAG 2.5.8 24 px; platforms 44 px): grow `py`, the math follows. Focus rings and hit areas are unaffected by the negative icon margin.
- Fixed-size square icon buttons are a different component; leave them unless asked.

## Files

- `references/math.md`: derivation, units, rounding, extended examples, Chromium measurements.
- `references/adapting.md`: translations to tokens, Tailwind, CSS-in-JS, component libraries, native UI.
- `references/supplemental.md`: out-of-scope cases with conflict rules.
- `references/provenance.md`: attribution, archival transcript and frame evidence, ambiguity log (optional).
- `scripts/pill_math.py` (calculator), `scripts/measure-buttons.js` (in-page), `scripts/audit_buttons.mjs` (Playwright runner).
- `tests/`: `test_pill_math.py`, `browser.test.mjs`, `fixtures/before.html`, `fixtures/after.html`.
- `evals/`: two cases in the `claude plugin eval` layout.
