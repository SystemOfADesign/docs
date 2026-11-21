# Lift report: settings.html

## Mode / scope
- Mode: full ("elevate"). Order: layout, type, surfaces, color.
- Scope: `settings.html` (single file, CSS in `<style>`, tokens in `:root`). Viewports 375 / 768 / 1280.
- Evidence: `.lift/before/`, `.lift/after/` (PNG + `metrics.json`). Original file kept at `.lift/before/settings.before.html`.

## Kept on purpose
- Brand hue `--brand #5b3df5`, system typeface, `--text`, `--surface`, `--page`, `--radius`, spacing scale (no tokens added).
- Two-column grid, 720px breakpoint, card order, DOM order, all copy and heading levels.
- Brand-filled header and brand-filled Billing card (changing them is gated, see residual).
- Logo wordmark untouched (colour, size, weight).
- Browser default focus rings (no outline rules added or removed).

## Findings (ranked)
location | measurement | rule id | severity

1. `header .logo` | #ff2424 on #5b3df5 = 1.61:1, needs 4.5; saturated on saturated; red as decoration | C1, C9, C19 | 1 (gated)
2. `footer.meta` | #757575 on #ececec = 3.90:1, needs 4.5 | C2 | 1
3. `.plan .meta` | #b9aef9 on #5b3df5 = 3.06:1, needs 4.5 | C1, T11 | 1
4. `.primary` vs `.secondary` | identical fill, colour and 3px border; 4 filled buttons, no identifiable primary | L16 | 1
5. All text | 1 size (16px), 1 weight (400); eyebrow, h2, body, label share size + weight + colour | T1, T3 | 2
6. `a` | colour = body text, no underline | T17 | 2
7. Support card, two consecutive `h2` | same style; second restates first | T1, L15 | 2 (removal gated)
8. `.card.centered` | 5 distinct left edges (666/778/797/867/871 at 1280); centred block beside left-aligned cards; centred multi-line paragraph | L1, L2, L3 | 3
9. `header` vs `main` | logo left edge 20px, card column edge 138px at 1280 | L2 | 3
10. Gaps | 18, 14, 13, 6, 7, 11, 40px: none on the 4/8/12/16/24/32 scale; within-group 6px vs between-group 7px | L8, L9 | 3
11. `button` | padding 18px 44px + 3px border: 60px tall beside 30px inputs | L12, L17 | 3
12. `.contact` | two side-by-side mini columns of list-like items, gap 40px | L5 | 3
13. `.row input` | fixed `height: 30px` on a text container | T23 | 3
14. Borders | 21 bordered elements, 5 distinct width/style/colour sets, all #000 or #fff at 17.8 to 21:1; 3px rule under every h2; dashed row dividers; 4px rule under header | S1, S2, S6 | 4
15. `.card` | border + shadow + fill stacked; shadow alpha 0.45 | S6, S10 | 4
16. `.avatar` | 3px black border + 3px #f5c542 ring (one-off colour, second shadow value) | S19, S16 | 4
17. Radii | 8px token plus one-offs 6px (button), 4px (input) | S20 | 5

## Changes
file | what changed | rule id | before -> after. All in `settings.html`.

Tokens
- `--muted` | C2 | #757575 -> #5f5f5f (5.41:1 on page, 6.39:1 on surface)
- `--border` | S6, S21 | #000000 -> #8a8a8a (3.45:1 on surface); now used only on controls
- `--shadow` | S10 | 0 4px 4px rgba(0,0,0,0.45) -> 0 4px 4px rgba(0,0,0,0.1)

Layout
- `main` padding / gap | L9 | 18px / 14px -> `--space-6` / `--space-6`
- `.card` padding | L12 | 13px -> `--space-6`
- `header` padding | L2, L9 | 14px 20px -> `--space-3` block, inline padding matched to the 1040px column (logo edge 20px -> 144px at 1280, same as card content edge)
- `footer` | L9 | inline `style` (padding 0 18px 18px) -> `footer` rule with `--space-6`
- `.centered` | L1, L2, L3 | `text-align: center` -> rule removed (left-aligned)
- `.row` | L8, S2 | padding 7px 0 + 1px dashed divider -> `margin-top: --space-4`, no divider
- `.row label` | L8 | margin 0 -> `margin-bottom: --space-1`
- `.actions` | L8, L9 | margin-top 11px, inline whitespace gap -> flex, gap `--space-2`, margin-top `--space-6`
- `button` | L12, L17 | padding 18px 44px -> `--space-2` `--space-4` (60px -> 42px tall)
- `.row input` | T23, L12 | height 30px, padding 0 6px -> no fixed height, padding `--space-2` `--space-3`
- `.contact` | L5, L9 | flex row, gap 40px -> one-column grid, gap `--space-2`
- `.card h2`, `.card p`, `.eyebrow` margins | L9 | 6px / 0 -> `--space-2` / `--space-1`

Type
- `body` | T22, T23 | 16px, line-height normal -> 1rem, 1.5
- `.card h2` | T3, T4, T5 | 16px / 400 -> 1.25rem / 600, line-height 1.25
- `.card h2 + h2` | T1, T9 | same as h2 -> 1rem / 600 (item-title tier)
- `.card .eyebrow` | T14 | 400 / --text -> 600 / --muted (weight + colour only)
- `.row label` | T2 | 400 -> 600
- `a` | T17, T19 | --text, no underline -> --brand (6.12:1), underlined
- all `font-size` | T23 | px -> rem

Surfaces
- `.card` border | S1, S4 | 2px solid #000 -> none (white on #ececec fill step)
- `.card h2` rule | S2 | 3px solid #000 / #fff -> none
- `header` rule | S1 | 4px solid #000 -> none
- `.avatar` | S19, S16 | 3px #000 border + 0 0 0 3px #f5c542 ring -> none
- `.row input` border | S6, S21 | 2px #000 -> 1px `--border`
- `button`, `.row input` radius | S20 | 6px / 4px -> `--radius`

Color
- `.primary` | L16 | 3px #000 border -> no border, brand fill kept
- `.secondary` | L16 | brand fill, #fff text, 3px #000 border -> transparent, --text, 1px `--border`
- `.plan .secondary` | L16, C14 | brand on brand, 3px #000 -> transparent, #fff text, 1px #fff outline (6.12:1)
- `.plan .meta`, `.plan .eyebrow` | T11, C12 | #b9aef9 (3.06:1) -> #e6e1fe (4.83:1), same hue

## Validation
- Screenshots: pass. Re-captured at 375 / 768 / 1280, compared by eye; nothing reverted.
- probe metrics (identical at all three viewports):

| Metric | Before | After |
|---|---|---|
| Contrast failures | 3 | 1 (logo, gated) |
| Bordered elements | 21 | 6 (3 inputs, 3 secondary buttons) |
| Distinct border sets | 5 | 2 |
| Distinct text sizes | 1 (16) | 2 (16, 20) |
| Distinct weights | 1 | 2 |
| Distinct text styles | 5 | 11 |
| Distinct shadows | 2 | 1 |
| Ragged columns | 1 | 0 |
| text-align mix | left 20 / center 7 | left 23 / center 4 (button labels) |
| Horizontal overflow | no | no |

- Contrast (`contrast.mjs`): pass. #5f5f5f/#ececec 5.41, #5f5f5f/#fff 6.39, #e6e1fe/#5b3df5 4.83, #5b3df5/#fff 6.12, #fff/#5b3df5 6.12; non-text #8a8a8a/#fff 3.45. Fail: logo 1.61 (gated).
- 200% zoom: not run as a true zoom. Proxy only: 375px viewport has no overflow or clipping; sizes in rem; fixed input height removed.
- Keyboard / focus: not run interactively. DOM order unchanged; no `outline` rules added or removed, browser default focus rings remain.
- Lint / tests / visual regression: not run (none exist).

## Residual issues
Gated (not changed, needs approval)
- Logo `header .logo` #ff2424 on #5b3df5 = 1.61:1 (C1, C9, C19). Logo treatment. Proposal: #ffffff (6.12:1). Its 16px / 400 also equals body (T1); left alone for the same reason.
- Billing card floods about 12% of the 1280 viewport with saturated brand colour and outranks the primary action (C8, L11). Converting to a white card changes the colour approach. Proposal: `--surface` card, brand on a small accent only.
- Support card: second h2 restates the first (L15). Cutting or merging a heading is content. Restyled the second as an item title instead.
- No type tokens exist. 1.25rem and weight 600 are set once in shared rules, not as tokens. Proposal: `--text-md: 1rem; --text-lg: 1.25rem; --weight-strong: 600`.
- No separate structural-border token. `--border` was repurposed to the 3:1 control value since no structural borders remain. Proposal if dividers return: `--border-subtle`.

Not fixed
- "Phone" / "Email" share a `<p>` with their values via `<br>`, so the label cannot get its own treatment (T2) without changing markup.
- Owner card has about 240px of empty space at 1280 because grid rows stretch to the taller General card (L11, L12). Fixing it means re-spanning or reordering cards (structure, gated).
- `.plan .meta`: only 4.5 to 6.12:1 is available between "passes" and "white", so it is only slightly quieter than body on the brand surface (T10 vs T12).
