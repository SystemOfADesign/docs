# The math, in full

All formulas are from the reel (see `reel-evidence.md`). Extra worked rows are computed with `scripts/pill_math.py`, which implements nothing beyond these formulas.

## Definitions

```
py    = padding-block (top and bottom), px
px    = padding-inline (start and end), px
lh    = line-height of the button text, px  (icon box = lh × lh)
cap   = cap height of the button font, px   (only in the gap rule)
pill  = py + lh / 2                          "half the height" for a full pill
r     = real corner radius, px               (full pill: r = pill)
k     = 1 - pi / 4 = 0.21460183660255172
```

## Formulas

```
gap            = max(py, px - (lh - cap) / 2)              shown in the reel, unexplained
edge_icon      = py - px                                    (negative) margin at the edge for an icon
edge_label     = r * k * r / pill                           margin at the edge for the label
height         = lh + 2 * py = 2 * pill
label_end      = px + edge_label                            what the dimension readout shows
avg_cut        = 2 * r^2 * k / height = r * k * r / pill   average horizontal loss per unit height
optical_before = px - avg_cut
optical_after  = px + edge_label - avg_cut = px             (by construction)
```

Derivation of `edge_label` (matches the audio "the curve cuts these two corners, spread them over the height"):

1. A rounded corner of radius `r` removes, from the corner square of side `r`, the area not covered by the quarter circle: `r² − π r² / 4 = r² (1 − π/4) = r² k`.
2. The label's end meets two such corners (top and bottom): `2 r² k`.
3. Spread evenly over the button height `2 · pill`: strip width `= 2 r² k / (2 pill) = r · k · r / pill`.
4. For a full pill `r = pill`, so the strip is `r (1 − π/4)`; at `r = 20` that is `4.292`.

Why `--r: 999px` breaks it: step 3 uses the declared `r`, but the browser renders a 999px radius on a 40px tall button as 20px. `999 · k · 999 / 20 = 10,708.6`, which is the "10720 / 10725" the reel shows. The reel's fix is to declare the real radius (`--r: var(--pill)`).

## Units and rounding

- The reel works in `em`, `lh`, `cap` at `font-size: 16px`; `px` readouts are display-rounded to integers. The CSS keeps fractional values. Do not round in CSS.
- `pi` is the CSS `calc()` constant. Numeric fallback for `(1 − pi/4)`: `0.2146` (error 1.8e-6 relative; at r = 20 the strip differs by 0.00004 px).
- Verification tolerance used by the scripts: 0.5 px, because browsers snap layout to device pixels and readouts are rounded.

## Worked examples

Rows marked "reel" have a matching on-screen readout. Others are computed.

| Case | py | px | lh | cap | r | pill | gap | edge_icon | edge_label | label_end | optical before → after |
|---|---|---|---|---|---|---|---|---|---|---|---|
| reel: usual pill | 8 | 16 | 24 | 12 | 20 (999 declared) | 20 | 10 | −8 | 4.292 | 20.29 → "20" | 11.71 → 16 |
| reel: 999 in the formula | 8 | 16 | 24 | 12 | 999 | 20 | 10 | −8 | 10,708.6 | 10,724.6 → "10725" | breaks |
| reel: `--py: 0.7em` | 11.2 | 16 | 24 | 12 | 23.2 | 23.2 | 11.2 | −4.8 | 4.979 | 20.98 → "21" | 11.02 → 16 |
| reel: `--r: 19px` | 8 | 16 | 24 | 12 | 19 | 20 | 10 | −8 | 3.874 | 19.87 → "20" | 12.13 → 16 |
| reel: `--r: 4px` | 8 | 16 | 24 | 12 | 4 | 20 | 10 | −8 | 0.172 | 16.17 → "16" | 15.83 → 16 |
| computed: 14px font | 7 | 14 | 20 | 10 | 17 | 17 | 9 | −7 | 3.648 | 17.65 | 10.35 → 14 |
| computed: 18px font, lh 28 | 9 | 18 | 28 | 13 | 23 | 23 | 10.5 | −9 | 4.936 | 22.94 | 13.06 → 18 |
| computed: square, r = 0 | 8 | 16 | 24 | 12 | 0 | 20 | 10 | −8 | 0 | 16 | 16 → 16 |
| computed: tight px = py | 8 | 8 | 24 | 12 | 20 | 20 | 8 | 0 | 4.292 | 12.29 | 3.71 → 8 |

Reproduce any row:

```bash
python3 scripts/pill_math.py --py 8 --px 16 --lh 24 --cap 12            # r defaults to pill
python3 scripts/pill_math.py --py 8 --px 16 --lh 24 --cap 12 --r 999    # shows the break
python3 scripts/pill_math.py --py 11.2 --px 16 --lh 24 --cap 12 --json
```

## Edge cases the formulas already handle

- `r = 0`: strip 0, icon margin unchanged. A square button keeps its padding.
- `r` between 0 and `pill`: strip shrinks quadratically with `r`.
- Icon at either end, text only, icon only: handled by `--edge` on each child plus the `:first-child` / `:last-child` rules. Icon only gives `py` all around.
- RTL: `margin-inline-*` flips automatically.
- `px = py`: the icon margin is 0; the icon is already concentric.

## Cases the formulas do not cover (see `supplemental.md`)

- `px < py` (icon margin becomes positive and pushes the icon outward; the reel never shows it).
- Borders, multi-line labels, icons taller than `1lh`, radius tokens larger than the pill (other than "use the real radius"), minimum touch targets.

## Measured in Chromium (2026-11-27, `tests/fixtures`, `scripts/audit_buttons.mjs`)

system-ui font, 16px / 24px unless noted. `gap` reads 9.64 instead of the reel's 10 because the fixture font's cap height differs from the reel's font; the gap rule is unchanged.

| Button | icon start | label end margin | label end reads | optical | verdict |
|---|---|---|---|---|---|
| before: icon first | 16.00 | 0 | 16.00 | 11.71 | FAIL (icon-concentric, label-strip, real-radius: declared 999) |
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
