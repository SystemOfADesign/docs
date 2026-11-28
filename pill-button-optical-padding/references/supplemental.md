# Supplemental guidance (outside the formulas' scope)

Engineering and accessibility notes that the normative math in `SKILL.md` does not cover. Each item states its **conflict rule**: what to do when it would change a number the formulas produce. Default: keep the formula's number, report the difference, let the user decide.

## S1. Browser support and fallbacks

- `lh` unit: Chrome 109+, Safari 16.4+, Firefox 120+. `cap`: Chrome 112+, Safari 17.2+, Firefox 97+. `pi` in `calc()`: Chrome 120+, Safari 15.4+, Firefox 118+.
- Fallbacks: `(1 - pi / 4)` → `0.2146`; `1lh` → an explicit line-height token (`--lh: 1.5rem`) used as `0.5 * var(--lh)` and `width: var(--lh)`; `1cap` has no exact fallback, so without it keep the system's existing gap.
- Conflict rule: fallbacks must reproduce the values within 0.5 px; otherwise report the delta.

## S2. Radius tokens larger than the pill (`9999px`, `rounded-full`)

- Browsers clamp over-large radii (CSS Backgrounds 3), so `rounded-full` on a 40 px button renders a 20 px radius. Keep `border-radius: 9999px` for the picture and feed `--r: var(--pill)` to the math; visually identical. `min(var(--r), var(--pill))` gives the same result for pills and is a convenience, not part of the method.
- Conflict rule: none for full pills. For wide buttons with a radius between `pill` and `width/2`, the rendered radius equals the declared one, so use the declared one.

## S3. Borders

- The formulas assume no border. With one, the label meets the padding box's inner corner, radius `r − border-width`, and the padding box height is `height − 2·border`.
- Suggested handling: `--r-inner: calc(var(--r) - var(--bw))` with `pill` measured on the padding box; a 1 px border at r = 20 moves the strip by 0.4 px.
- Conflict rule: report both the outer-radius and inner-radius strips and pick one with the user.

## S4. Content taller than one line box

- `--pill: calc(var(--py) + 0.5lh)` assumes content height `1lh`. For wrapped labels, icons taller than `1lh`, or a fixed `height`, `pill = py + contentHeight / 2`.
- `scripts/measure-buttons.js` computes `pill` from the measured content height and flags a mismatch with `py + 0.5lh`.
- Conflict rule: report the measured `pill` next to the `0.5lh` one; apply the measured one only if the user agrees.

## S5. `px < py`

- The icon formula gives a positive margin, pushing the icon away from the edge. Geometrically consistent (the icon stays concentric with a circle of radius `pill`), but confirm the design intends horizontal padding smaller than vertical.
- Conflict rule: none in the math; flag as unusual.

## S6. Minimum target size and accessibility

- WCAG 2.2 SC 2.5.8 requires 24×24 CSS px (AA); Apple HIG and Material recommend 44 pt / 48 dp. A 16px / 24px pill is 40 px tall; a small variant (`py` 4, `lh` 20) is 28 px.
- To grow a target, grow `--py` (and optionally `--px`); the concentric and strip math follow. An invisible pseudo-element hit area is also fine and does not affect the formulas.
- Keep `:focus-visible` styles; the negative icon margin does not move the button's box.
- Conflict rule: changing `--py` changes `pill` and the strip; report the new numbers.

## S7. Icon-only buttons with a dedicated size token

- The formulas give an icon-only pill `py` on all sides. Systems that define icon buttons as fixed squares (`size-10`) have a different component; leave it unless asked and say which rule applies where.

## S8. Icons that are not square or not `1lh`

- The icon margin is about padding, not icon size; concentricity holds for any icon box whose height equals the content height and is vertically centered. Prefer `width: 1lh; height: 1lh` with the glyph centered inside.

## S9. Deliberately offset designs

- Some systems offset icons on purpose. Apply the rules only after confirming; list such components under "Kept deliberately".

## S10. Line-height `normal`

- `1lh` resolves with `line-height: normal`, but the value is font- and platform-dependent. Set an explicit line-height on the button for reproducible numbers.
