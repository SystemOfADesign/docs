# Supplemental guidance (not from the reel)

Everything here was added by this skill for engineering and accessibility completeness. None of it comes from the Ariakit reel. Each item states its **conflict rule**: what to do when it would change a number the reel's formulas produce. The default is always: keep the reel's number, report the difference, let the user decide.

## S1. Browser support and fallbacks

- `lh` unit: Chrome 109+, Safari 16.4+, Firefox 120+.
- `cap` unit: Chrome 112+, Safari 17.2+ (17.0 partial), Firefox 97+.
- `pi` in `calc()`: Chrome 120+, Safari 15.4+, Firefox 118+.
- Fallbacks: `(1 - pi / 4)` → `0.2146`; `1lh` → an explicit line-height token (`--lh: 1.5rem`) used as `0.5 * var(--lh)` and `width: var(--lh)`; `1cap` → `0.7em` is a common approximation but changes the `gap` number, so prefer keeping the system's existing gap when `cap` is unavailable.
- Conflict rule: fallbacks must produce the same values within 0.5 px; otherwise report the delta.

## S2. Radius tokens larger than the pill (`9999px`, `rounded-full`)

- The reel's remedy: declare the real radius, `--r: var(--pill)`.
- Browsers clamp over-large radii (CSS Backgrounds 3, "corner curve overlap"), so `rounded-full` on a 40 px button renders a 20 px radius. Keeping `border-radius: 9999px` for the picture while feeding `--r: var(--pill)` to the math is visually identical and faithful to the reel. `min(var(--r), var(--pill))` is an engineering convenience, not reel content; if used, say so.
- Conflict rule: none for full pills (same number). For buttons wider than they are tall with a radius between `pill` and `width/2`, the rendered radius equals the declared one, so use the declared one.

## S3. Borders

- The reel's button has no border. With a border, the label meets the inner curve of the padding box, whose radius is `r − border-width` (CSS computes inner radii that way), and the padding box height is `height − 2·border`.
- Suggested handling (supplemental): `--r-inner: calc(var(--r) - var(--bw))` and `--pill` measured on the padding box; or ignore borders of 1 px, whose effect at r = 20 is 0.4 px on the strip.
- Conflict rule: do not change the formula silently. Report both the outer-radius strip and the inner-radius strip and pick one with the user.

## S4. Content taller than one line box

- `--pill: calc(var(--py) + 0.5lh)` assumes the content height is `1lh` (single-line label, `1lh` icon). For wrapped labels, icons taller than `1lh`, or buttons with a fixed `height`, `pill = py + contentHeight / 2`.
- `scripts/measure-buttons.js` computes `pill` from the measured content height and flags when it differs from `py + 0.5lh`.
- Conflict rule: report the measured `pill` next to the `0.5lh` one; apply the measured one only if the user agrees.

## S5. `px < py`

- The icon formula gives a positive margin, pushing the icon away from the edge. The reel never shows this. It is geometrically consistent (the icon is still concentric with a circle of radius `pill`), but check that the design intends horizontal padding smaller than vertical.
- Conflict rule: none in the math; flag it in the report as unusual.

## S6. Minimum target size and accessibility

- WCAG 2.2 SC 2.5.8 requires a 24×24 CSS px target (AA); Apple HIG and Material recommend 44 pt / 48 dp.
- The reel's example is 40 px tall. Small variants (`py` 4 px, `lh` 20 px ⇒ 28 px) meet 2.5.8 but not platform guidance.
- If a target must grow, grow `--py` (and optionally `--px`); the concentric and strip math follow. Adding an invisible pseudo-element hit area is also fine and does not affect the formulas.
- Keep `:focus-visible` styles; the negative icon margin does not move the button's box, so rings and hit areas are unchanged.
- Conflict rule: changing `--py` changes `pill` and the strip; report the new numbers.

## S7. Icon-only buttons with a dedicated size token

- Reel result: an icon-only pill has `py` on all sides because the icon is both first and last child.
- Many systems define icon buttons as fixed squares (`size-10`). That is a different component; leave it unless asked, and say which rule applies to which component.

## S8. Icons that are not square or not `1lh`

- The icon margin is about padding, not icon size, so any icon box works for concentricity as long as the icon is vertically centered and its box height equals the content height. A 20 px icon in a 24 px line box sits 2 px lower/higher than the reel's assumption; prefer `width: 1lh; height: 1lh` with the glyph centered inside (what the reel does).

## S9. Asymmetric or deliberately offset designs

- Some systems offset icons on purpose (for example a leading chevron set 2 px off-center). Apply the reel's rules only after confirming; list such components under "Kept deliberately".

## S10. Line-height `normal`

- `1lh` resolves even when `line-height: normal`, but the value is font-dependent and differs between fonts and platforms. For reproducible numbers set an explicit line-height on the button.
