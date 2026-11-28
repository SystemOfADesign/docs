# Adapting the reel's CSS to an existing app

The math never changes. What changes is where the four variables (`--py`, `--px`, `--pill`, `--r`) come from and how the two child roles (icon, label) are addressed. Work on the shared button, not on call sites.

## 1. Plain CSS / CSS Modules / Sass

Alias existing tokens instead of inventing values:

```css
.button {
  --py: var(--space-2, 0.5em);          /* whatever the system already uses for block padding */
  --px: var(--space-4, 1em);
  --pill: calc(var(--py) + 0.5lh);
  --r: var(--pill);                     /* full pill. For a non-pill variant: --r: var(--radius-md); */
  padding: var(--py) var(--px);
  gap: max(var(--py), var(--px) - (1lh - 1cap) / 2);   /* keep the system's own gap if it has one */
  border-radius: var(--r);
}
.button > .icon  { width: 1lh; height: 1lh; --edge: calc(var(--py) - var(--px)); }
.button > .label { --edge: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill)); }
.button > :first-child { margin-inline-start: var(--edge); }
.button > :last-child  { margin-inline-end:   var(--edge); }
```

Sass: the same, with `calc()` kept as CSS (do not let Sass pre-evaluate `pi`; write `(1 - pi / 4)` inside `calc()` and Sass passes it through, or use `#{"pi"}` if the compiler complains).

Size variants only change `--py` / `--px` (and font-size); the rest follows:

```css
.button--sm { font-size: 14px; --py: var(--space-1-5); --px: var(--space-3); }
.button--lg { font-size: 18px; --py: var(--space-2-5); --px: var(--space-5); }
```

## 2. Tailwind (v3 or v4)

Keep `rounded-full` for the picture; give the math the real radius with arbitrary properties, or move the rules into a component layer so utilities stay readable.

```css
/* app.css */
@layer components {
  .btn-pill {
    --py: theme(spacing.2); --px: theme(spacing.4);           /* v3; v4: var(--spacing-2) etc. */
    --pill: calc(var(--py) + 0.5lh);
    --r: var(--pill);
    @apply inline-flex items-center;
    padding: var(--py) var(--px);
    gap: max(var(--py), var(--px) - (1lh - 1cap) / 2);
    border-radius: var(--r);
  }
  .btn-pill > .icon  { width: 1lh; height: 1lh; --edge: calc(var(--py) - var(--px)); }
  .btn-pill > .label { --edge: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill)); }
  .btn-pill > :first-child { margin-inline-start: var(--edge); }
  .btn-pill > :last-child  { margin-inline-end:   var(--edge); }
}
```

Utility-only is possible but noisy: `[--py:theme(spacing.2)] [--px:theme(spacing.4)] [--pill:calc(var(--py)+0.5lh)] [--r:var(--pill)] py-[var(--py)] px-[var(--px)] rounded-[var(--r)] [&>:first-child]:ms-[var(--edge)] [&>:last-child]:me-[var(--edge)]` plus `[--edge:calc(var(--py)-var(--px))]` on the icon and the label formula on the label. Prefer the component layer.

Detect the usual starting state with grep: `rounded-full`, `rounded-[9999px]`, `px-4 py-2` on buttons, and icons given `me-2` / `ml-2` style margins (those margins are what the per-child `--edge` replaces).

## 3. CSS-in-JS (styled-components, Emotion, vanilla-extract, Panda, Stitches)

Same declarations as strings or objects. Example (styled-components):

```ts
export const PillButton = styled.button`
  --py: ${({ theme }) => theme.space[2]};
  --px: ${({ theme }) => theme.space[4]};
  --pill: calc(var(--py) + 0.5lh);
  --r: var(--pill);
  padding: var(--py) var(--px);
  gap: max(var(--py), var(--px) - (1lh - 1cap) / 2);
  border-radius: var(--r);
  > [data-slot="icon"]  { width: 1lh; height: 1lh; --edge: calc(var(--py) - var(--px)); }
  > [data-slot="label"] { --edge: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill)); }
  > :first-child { margin-inline-start: var(--edge); }
  > :last-child  { margin-inline-end: var(--edge); }
`;
```

Object-syntax libraries need the custom properties quoted (`'--py': ...`). If the library's theme exposes radii as numbers, pass the real one into `--r`; never pass `9999`.

## 4. Component libraries (Radix, Ariakit, shadcn/ui, MUI, Chakra)

- Style the rendered root and its direct children; do not fight the library's slots. shadcn `Button` renders children inline: wrap text in `<span className="label">` and give icons a `data-slot="icon"` or rely on `svg` as the icon selector.
- MUI `startIcon` / `endIcon` wrappers already have margins (`margin-right: 8px; margin-left: -4px`). Replace those margins with the per-child `--edge` rather than stacking on top of them; report the override.
- If the library renders an extra wrapper between button and children (a loading spinner slot), the first/last-child rules must target the visible children; use `:not([hidden])` or `:nth-child` selectors that skip hidden slots.

## 5. Native UI (no `lh` / `cap` / `pi`)

The same four numbers in points or dp, computed in code:

```
pill   = py + lineHeight / 2
k      = 1 - pi / 4
edgeIcon  = py - px
edgeLabel = r * k * r / pill
```

- **SwiftUI**: `.padding(.vertical, py).padding(.horizontal, px)`; icon `.padding(.leading, edgeIcon)` when first (negative padding is allowed) or `.offset`/`.padding(.leading, -(px - py))`; label `.padding(.trailing, edgeLabel)` when last; `.clipShape(Capsule())` means `r = pill`, so `edgeLabel = pill * k`. Read `lineHeight` from `UIFont.lineHeight` of the label font.
- **Jetpack Compose**: `Modifier.padding(horizontal = px, vertical = py)`; icon `Modifier.offset(x = (py - px))` with `Modifier.size(lineHeight)`; label `Modifier.padding(end = edgeLabel)`; `RoundedCornerShape(50)` ⇒ `r = pill`.
- **React Native**: `paddingVertical: py, paddingHorizontal: px, borderRadius: r`; icon `marginStart: py - px`; label `marginEnd: edgeLabel`; `lineHeight` from the Text style (set it explicitly; RN has no `lh` unit).
- **Flutter**: `EdgeInsets.symmetric(vertical: py, horizontal: px)`, `StadiumBorder()` ⇒ `r = pill`; icon `Transform.translate(Offset(py - px, 0))` or negative `Padding` via `SizedBox` spacing; label `Padding(end: edgeLabel)`.

Because native platforms cannot read `1lh`, compute `pill` from the actual text line height and the actual content height, and keep a unit test with `scripts/pill_math.py` numbers.

## 6. Finding every button in scope

- Grep selectors: `button`, `[role="button"]`, `.btn`, `.chip`, `.tag`, `.badge`, `Button(`, `IconButton(`, `rounded-full`, `border-radius: 999`, `9999px`.
- Run `scripts/audit_buttons.mjs` on the real pages, not only the component playground; wrapper styles and inherited line-heights change `pill`.
- A design-system button that is intentionally square (`r = 0`) still passes; apply the rules uniformly and let the formula produce 0.
