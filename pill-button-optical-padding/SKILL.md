---
name: pill-button-optical-padding
description: Audit and fix pill / rounded button padding with the exact math from Ariakit's reel "You (and Claude) have been styling pill buttons wrong" (instagram.com/reel/DgQdaYhCFeA). Makes an icon concentric with the round end (margin = py - px) and gives the label back the strip the curve steals (r * (1 - pi/4) * r / pill) so the optical space equals the padding, with a per-child --edge so icon-first, icon-last, text-only and icon-only all hold. Use this whenever a request involves pill buttons, rounded-full / 9999px buttons, chips, tags, badges, icon+text buttons, icon alignment inside buttons, "text looks too close to the edge", "icon looks off-center", or any audit of button padding/spacing across an app, even if nobody says "optical" or "concentric".
---

# Pill button optical padding

Source: Ariakit (@ariakitjs) Instagram reel, 2026-11-27, https://www.instagram.com/reel/DgQdaYhCFeA/ . Everything in the section "The reel's math" is transcribed from the reel's audio and on-screen CSS; see `references/reel-evidence.md` for the timestamped evidence. Anything the reel does not say is kept apart under "Supplemental" and in `references/supplemental.md`, and must never silently change the math.

## What the reel claims

A "usual" pill button (`padding: 0.5em 1em; border-radius: 999px`, icon + label) has two defects:

1. **Icon off-center.** The icon sits `px` (16) from the straight edge but only `py` (8) from top and bottom, so it is not concentric with the round end.
2. **Text optically closer than its padding.** The round end "eats the corners", so the average space between the label and the curve is about 12, not the 16 the padding says.

The fix is pure math, so it holds when padding, radius or child order changes. Read the three fixes below, then follow the workflow.

## The reel's math (do not alter)

### Inputs and definitions

| Symbol | CSS | Meaning (as used in the reel) |
|---|---|---|
| `py` | `--py: 0.5em` | vertical padding |
| `px` | `--px: 1em` | horizontal padding |
| `1lh` | line-height unit | the icon's width and height; also the label's line box |
| `1cap` | cap-height unit | used only in the pre-existing `gap` rule |
| `pill` | `--pill: calc(var(--py) + 0.5lh)` | "for a full pill, the radius is half the height": half the button's content+padding height |
| `r` | `--r` | the button's **real** corner radius. The reel sets `--r: var(--pill)` for a full pill; `999px` breaks the math |
| `k` | `(1 - pi / 4)` | ≈ 0.2146, the fraction of a corner square a quarter circle does not cover |
| `--edge` | per child | the extra room a child needs at the button's edge; the icon's is negative, the label's is positive |

Units: the reel works in `em`, `lh`, `cap` and `px` with `font-size: 16px`; all on-screen numbers are CSS px rounded to integers for display. The CSS itself is never rounded.

### Starting point shown in the reel ("the usual pill")

```css
button {
  --py: 0.5em;
  --px: 1em;
  --r: 999px;
  padding: var(--py) var(--px);
  gap: max(var(--py), var(--px) - (1lh - 1cap) / 2);
  border-radius: var(--r);
}
```

The `gap` rule is on screen from the first frame and is never explained in the audio. Keep it as shown; at 16px / 24px line-height / ~12px cap it yields 10.

### Fix 1: the icon (concentric with the round end)

"A negative margin pulls it into the padding. And now it's concentric. Same space all around."

```css
.icon {
  width: 1lh;
  height: 1lh;
  margin-inline-start: calc(var(--py) - var(--px));  /* 8 - 16 = -8 */
}
```

Result at 16px: icon has 8 on every side ("8 all around").

### Fix 2: the label (give back the strip the curve cut)

"The curve cuts these two corners. Spread them over the height, and you get (1 - pi/4) of the radius. For a full pill, the radius is half the height. Add the strip to the end of the text."

```css
button { --pill: calc(var(--py) + 0.5lh); --r: var(--pill); }   /* real radius, not 999px */
.label {
  margin-inline-end: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill));
}
```

On screen: `same area: r × (1 − π/4) = 4` with r = 20 (exact 4.29). "The math reads 999 pixels" when `--r: 999px` (the strip becomes ~10,720), so **use the real radius**. With `--r: var(--pill)` the label's end reads 20 and the optical space is 16 ("Optical space 16", "avg 16").

Derivation that reproduces every on-screen number (the audio says "spread them over the height"): each cut corner is a square of side `r` minus a quarter circle, area `r² · (1 − π/4)`. Two corners meet the label's end. Spread over the full height `2 · pill`: `2 · r² · k / (2 · pill) = r · k · r / pill`. For a full pill `r = pill`, so the strip is `r · (1 − π/4)`.

### Fix 3: either order (first child / last child)

"Those margins only know start and end, so each part names its own room at the edge. Then two rules give it to the first child, and the last. Now it works either way. Without the icon, as just an icon, or back where it started."

```css
.icon  { width: 1lh; height: 1lh; --edge: calc(var(--py) - var(--px)); }
.label { --edge: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill)); }
button > :first-child { margin-inline-start: var(--edge); }
button > :last-child  { margin-inline-end:   var(--edge); }
```

### Final CSS (assembled from the reel's last state)

```css
button {
  --py: 0.5em;
  --px: 1em;
  --pill: calc(var(--py) + 0.5lh);
  --r: var(--pill);                /* or the design's real radius when it is not a full pill */
  padding: var(--py) var(--px);
  gap: max(var(--py), var(--px) - (1lh - 1cap) / 2);
  border-radius: var(--r);
}
.icon  { width: 1lh; height: 1lh; --edge: calc(var(--py) - var(--px)); }
.label { --edge: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill)); }
button > :first-child { margin-inline-start: var(--edge); }
button > :last-child  { margin-inline-end:   var(--edge); }
```

### Worked examples shown in the reel (16px font, 24px line-height)

| Case | py | px | r | icon edge | label strip | label end reads | optical avg |
|---|---|---|---|---|---|---|---|
| usual pill (before) | 8 | 16 | 999 → renders 20 | 16 (off-center, "8" offset) | 0 | 16 | 12 |
| icon fixed only | 8 | 16 | 20 | 8 all around | 0 | 16 | 12 |
| `--r: 999px` in the formula | 8 | 16 | 999 | 8 | 10,709 | 10,725 ("breaks") | n/a |
| fixed, `--r: var(--pill)` | 8 | 16 | 20 | 8 | 4.29 → "4" | 20 | 16 |
| `--py: 0.7em` | 11.2 | 16 | 23.2 | 11 all around | 4.98 → "5" | 21 | 16 |
| `--r: 19px` | 8 | 16 | 19 | 8 | 3.87 | 20 | 16 |
| `--r: 4px` | 8 | 16 | 4 | 8 | 0.17 | 16 | 16 |
| icon last, both rules | 8 | 16 | 20 | 8 (end) | 4.29 (start) | 20 start, 8 end | 16 |
| text only | 8 | 16 | 20 | n/a | 4.29 both ends | 20 / 20 | 16 / 16 |
| icon only | 8 | 16 | 20 | 8 both ends | n/a | 8 / 8 | n/a |

`scripts/pill_math.py` reproduces this table; `tests/test_pill_math.py` pins it.

## Workflow

### 1. Scope and read the system first

- Find the button primitives: shared component(s), design tokens (CSS custom properties, Tailwind theme, theme objects), utility classes. Prefer fixing one shared component or token set over editing call sites.
- List every in-scope button variant: text-only, icon+text (icon first), text+icon (icon last), icon-only, and each size. Chips, tags and badges count if they are rounded.
- Record the current values per variant: font-size, line-height (px), padding-block, padding-inline, border-radius (declared and rendered), gap, icon box size, child margins, border width.
- Note which values come from tokens and which are one-offs. Do not change a token's meaning; add the computed strips as new rules on the button, not as edits to spacing scale tokens.

### 2. Audit with measurements

Run `scripts/audit_buttons.mjs <url-or-file> [--selector <css>]` (needs `playwright` resolvable; otherwise paste `scripts/measure-buttons.js` into the browser console or a preview tool's evaluate). For each button it reports measured `py`, `px`, `lh`, rendered `r`, `pill`, and the four checks:

| Check | Passes when |
|---|---|
| `icon-concentric` | an edge icon's distance to the straight edge equals `py` (within 0.5px) |
| `label-strip` | an edge label has an end margin of `r · k · r / pill` (within 0.5px) |
| `real-radius` | the radius used in the strip equals the rendered radius, not 999px / 9999px |
| `optical-space` | `px + strip − r·k·r/pill` equals `px` (within 0.5px) |

A button with no rounded end (`r = 0`) passes trivially; the formula gives 0.

### 3. Plan the smallest change

- Put the math on the shared button component (or one shared stylesheet), expressed in the project's own tokens: `--py`/`--px` can alias existing spacing tokens, `--r` the existing radius token. If the project uses `rounded-full` / `9999px`, keep that visual by setting the rendered radius to `var(--pill)`; the picture does not change, only the math gains the real radius.
- Children must be identifiable as icon or label. Use existing class names, data attributes or slots; if the component renders a bare text node, wrap it in a `span.label` (markup change, call it out).
- If the project's icon is not `1lh` square, the icon formula still applies (it is about padding, not icon size), but `pill` must still be `py + half the content height`; see `references/supplemental.md` for non-1lh content.
- Ask before changing brand radius, token values or markup semantics beyond wrapping a label. Do not override a deliberately asymmetric design without saying so in the report.

### 4. Implement

- Apply the final CSS block above, translated per `references/adapting.md` (plain CSS, Tailwind, CSS Modules, CSS-in-JS, Sass, native equivalents).
- Keep the `gap` rule from the reel unless the design system already defines its own icon-to-label gap; then keep theirs and state it.
- Add the two `:first-child` / `:last-child` rules so order does not matter. If children are wrapped by the framework (for example a loading spinner slot), target the visible children.

### 5. Verify (measurable, before and after)

- Re-run the audit on the same pages. Every in-scope button must pass all four checks; paste the before/after rows in the report.
- Check at least one button per variant and size, plus the RTL direction if the app supports it (logical properties make it free).
- Run the project's own lint, type check, tests and visual regression if present.
- `python3 scripts/pill_math.py --py 8 --px 16 --lh 24` prints the expected numbers for any size so reviewers can compare by hand.

### 6. Report

```
# Pill button padding: <app/component>
## Scope: components, variants, pages measured
## Before: table of measured values and failing checks
## Change: files touched, tokens aliased, markup changes (if any)
## After: same table, all checks passing
## Kept deliberately: design-system values left alone and why
## Supplemental notes: anything applied from references/supplemental.md, flagged as not from the reel
## Open questions
```

## Supplemental (not from the reel; keep separate, flag conflicts)

These are engineering and accessibility notes added by this skill. They never replace the formulas above. If one of them would change a number the formula produces, do not apply it silently: list it under "Supplemental notes" with both numbers.

- **Browser support**: `lh`, `cap` and `pi` inside `calc()` need current browsers (Chrome 120+, Safari 17.2+, Firefox 120+ as of 2026). Fallback for `pi`: the constant `0.2146` for `(1 - pi/4)`. Fallback for `1lh`: an explicit line-height token in px. State the fallback in the report.
- **Radius larger than the pill**: the reel's rule is "use the real radius". Browsers clamp a radius that is bigger than half the height, so a `9999px` token renders as `pill`. The faithful fix is `--r: var(--pill)`. A `min(var(--r), var(--pill))` wrapper is an engineering convenience with the same result for pills; it is not in the reel.
- **Borders**: the reel's button has no border. With a border, the curve the label meets is the padding box's inner corner (radius `r − border-width`) and `pill` should be measured on the padding box. Flag it; do not assume.
- **Non-1lh content**: `pill = py + half the content height`. The reel's content is one line box (`1lh`). For a two-line label or a taller icon, measure the content height instead of assuming `0.5lh`.
- **Touch target and minimum size**: WCAG 2.5.8 wants 24×24 CSS px minimum, platform guidelines often 44×44. The reel does not discuss this. If a size is below the target, raise `py` (which the math follows) rather than adding invisible padding that breaks the concentric result, and say so.
- **Focus ring and hit area**: the negative icon margin does not change the button's box, so focus rings and click areas are unaffected.
- **Icon-only buttons with their own padding tokens**: the reel's icon-only result is `py` all around because the icon is a first and last child. If the design system defines a separate square icon-button size, keep it and report the difference.

## Files

- `references/reel-evidence.md`: source, metadata, timestamped transcript, on-screen CSS per frame, measurement readouts, ambiguity log.
- `references/math.md`: definitions, derivation, units, rounding, extended worked examples.
- `references/adapting.md`: translating the CSS to tokens, Tailwind, CSS Modules, CSS-in-JS, Sass, SwiftUI / Compose / React Native.
- `references/supplemental.md`: the non-reel guidance above, expanded, each item marked with its conflict rule.
- `scripts/pill_math.py`: calculator and checker (`--json`, `--check measured.json`).
- `scripts/measure-buttons.js`: in-page measurement, returns JSON (no dependencies).
- `scripts/audit_buttons.mjs`: Playwright runner around `measure-buttons.js`, prints the audit table and exits non-zero on failures.
- `tests/`: `test_pill_math.py` (deterministic reel numbers), `browser.test.mjs` (before/after fixtures measured in Chromium), `fixtures/before.html`, `fixtures/after.html`.
- `evidence/`: downscaled key frames, `transcript.srt`, word-level `transcript-words.json`, `metadata.txt`.
