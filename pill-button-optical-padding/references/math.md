# The math, in full

Normative formulas for `pill-button-optical-padding`. `scripts/pill_math.py` implements exactly these and nothing more.

## Definitions

```
py    = padding-block (top and bottom), px
px    = padding-inline (start and end), px
lh    = line-height of the button text, px  (icon box = lh × lh)
cap   = cap height of the button font, px   (only in the gap rule)
pill  = py + lh / 2                          half the height for single-line content
r     = rendered corner radius, px          (full pill: r = pill)
k     = 1 - pi / 4 = 0.21460183660255172
```

## Formulas

```
gap            = max(py, px - (lh - cap) / 2)              shown with the method, never derived
edge_icon      = py - px                                    (negative) edge margin for an icon
edge_label     = r * k * r / pill                           edge margin for the label
height         = lh + 2 * py = 2 * pill
label_end      = px + edge_label                            distance from label box to the button edge
avg_cut        = 2 * r^2 * k / height = r * k * r / pill   average horizontal loss per unit height
optical_before = px - avg_cut
optical_after  = px + edge_label - avg_cut = px             (by construction)
```

Derivation of `edge_label`:

1. A rounded corner of radius `r` removes, from the corner square of side `r`, the area outside the quarter circle: `r² − π r² / 4 = r² k`.
2. The label's end meets two such corners (top and bottom): `2 r² k`.
3. Spread evenly over the button height `2 · pill`: `2 r² k / (2 pill) = r · k · r / pill`.
4. For a full pill `r = pill`, so the strip is `r (1 − π/4)`; at `r = 20` that is `4.292`.

Why a `999px` token breaks it: step 3 must use the rendered radius. Browsers clamp a 999px radius on a 40px tall button to 20px, but `calc()` sees 999: `999 · k · 999 / 20 = 10,708.6`. Declare the real radius (`--r: var(--pill)` for a full pill).

## Valid scope

- Content is one line box: `pill = py + lh/2`. Otherwise `pill = py + contentHeight/2` (supplemental S4).
- No border (supplemental S3).
- `0 ≤ r ≤ pill`. Larger declared radii render as `pill` (supplemental S2).
- `px ≥ py`; with `px < py` the icon margin turns positive (supplemental S5).

## Units and rounding

- Works in `em`, `lh`, `cap`; the formulas are unit-agnostic as long as all inputs are in the same px space. Do not round in CSS.
- `pi` is the CSS `calc()` constant. Numeric fallback for `(1 − pi/4)`: `0.2146` (relative error 1.8e-6; at r = 20 the strip differs by 0.00004 px).
- Verification tolerance in the scripts: 0.5 px, because layout snaps to device pixels.

## Worked examples (beyond the reference table in `SKILL.md`)

| Case | py | px | lh | cap | r | pill | gap | edge_icon | edge_label | label_end | optical before → after |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 14px font | 7 | 14 | 20 | 10 | 17 | 17 | 9 | −7 | 3.648 | 17.65 | 10.35 → 14 |
| 18px font, lh 28 | 9 | 18 | 28 | 13 | 23 | 23 | 10.5 | −9 | 4.936 | 22.94 | 13.06 → 18 |
| tight, px = py | 8 | 8 | 24 | 12 | 20 | 20 | 8 | 0 | 4.292 | 12.29 | 3.71 → 8 |

```bash
python3 scripts/pill_math.py --py 8 --px 16 --lh 24 --cap 12            # r defaults to pill
python3 scripts/pill_math.py --py 8 --px 16 --lh 24 --cap 12 --r 999    # shows the break
python3 scripts/pill_math.py --py 11.2 --px 16 --lh 24 --cap 12 --json
```

## Cases the formulas already handle

- `r = 0`: strip 0, icon margin unchanged.
- `0 < r < pill`: strip shrinks quadratically with `r`.
- Icon at either end, text only, icon only: `--edge` per child plus the `:first-child` / `:last-child` rules. Icon only gives `py` all around.
- RTL: `margin-inline-*` flips automatically.
- `px = py`: icon margin 0; the icon is already concentric.

## Measured in Chromium (2026-11-27, `tests/fixtures`, `scripts/audit_buttons.mjs`)

system-ui font, 16px / 24px unless noted. `gap` reads 9.64 instead of 10 because this font's cap height differs; the gap rule is unchanged.

| Button | icon start | label end margin | label_end | optical | verdict |
|---|---|---|---|---|---|
| before: icon first | 16.00 | 0 | 16.00 | 11.71 | FAIL (icon-concentric, label-strip; declared 999 renders 20) |
| before: text only | – | 0 / 0 | 16.00 / 16.00 | 11.71 / 11.71 | FAIL |
| before: icon only | 16.00 / 16.00 | – | – | – | FAIL |
| after: icon first | 8.00 | 4.29 | 20.28 | 16.00 | PASS |
| after: icon last | 8.00 (end) | 4.29 (start) | 20.28 start / 8.00 end | 16.00 | PASS |
| after: text only | – | 4.29 / 4.29 | 20.28 / 20.28 | 16.00 / 16.00 | PASS |
| after: icon only | 8.00 / 8.00 | – | – | – | PASS |
| after: `--py: 0.7em` | 11.20 | 4.98 | 20.97 | 16.00 | PASS |
| after: `--r: 19px` | 8.00 | 3.87 | 19.86 | 16.00 | PASS |
| after: `--r: 4px` | 8.00 | 0.17 | 16.16 | 16.00 | PASS |
| after: 14px / 20px | 7.00 | 3.65 | 17.64 | 14.00 | PASS |
| after: `rounded-full` 9999px kept, `--r: var(--pill)` | 8.00 | 4.29 | 20.28 | 16.00 | PASS (declared 9999, rendered 20) |
| after: RTL | 8.00 | 4.29 | 20.28 | 16.00 | PASS |
