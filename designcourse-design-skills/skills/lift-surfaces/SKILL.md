---
name: lift-surfaces
description: Fix borders, dividers, shadows, cards and container treatments in an existing web UI. Use when a screen looks boxy, heavy, dated or noisy, when everything is outlined or sits in a card, when shadows are dark or inconsistent, or when lines are doing the job of spacing. Works inside the app's existing border, radius and elevation tokens.
---

# Lift Surfaces

Lines and shadows are the cheapest way to separate things, which is why they pile up. Each one is a small high-contrast object competing with the content. The question for every border and every shadow is the same: what job is this doing, and is something else already doing it? If heading weight, spacing or a fill already makes the grouping clear, the line is clutter.

What survives should be nearly invisible. The loud treatments are reserved for state.

## Diagnose

- **Border census (S1).** Count bordered elements per screen and list distinct width and color pairs. For each, name its job: separate, contain, or mark state.
- **Stacking.** Flag elements that have a border and a shadow and a fill change all at once, nested bordered boxes, and anything with more than one border color.
- **Shadow census (S9).** List distinct `box-shadow` values with their alpha. Flag anything you notice before you notice the content, and any framework default left untouched.
- **Contrast of structure.** Flag structural lines at or near full contrast against their surface.

## Rules

Borders
- Delete a border when hierarchy, spacing or fill already communicates the grouping (S1).
- No heavy rule under headings. Separate repeated items with space rather than dividers. After removing lines, widen the gaps between groups or sections will run together (S2).
- Never add lines to a layout that is already tight (S3).
- Define a container by a small fill step instead of an outline: off-white page with white cards, or white page with a faintly tinted card (S4).
- A container may be low contrast against its page; the contrast budget belongs to what is read or operated (S5).
- A border that stays is 1px and low contrast. On a colored surface, use a darker shade of that surface's hue. Never full-contrast structural lines, never stacked borders, never several border colors on one element (S6).
- Thicker, brighter, brand-colored lines mean state: active tab, current nav item, selected row. A menu is one faint rail with a highlight, not a box per item (S7).
- Row separators in tables and lists are optional and faint. One divider direction per group: horizontal for stacked rows, vertical for parallel columns (S8).
- Decorative lines sit at watermark strength, and a short accent bar beside a heading or paragraph is used sparingly (S15).

Shadows
- First ask whether the shadow is needed. If the fill already separates the card from its surface, removing the shadow is a valid fix (S9).
- A shadow only outlines the element against its surface. If it is noticed before the content, lower it. Black at about 10% is a better resting value than a 25% default (S10).
- On a tinted or colored surface, the shadow is a darker shade of the surface, not black or grey (S11).
- Two geometries cover almost everything: small and tight (about 4px offset, 4px blur) for a resting card, or large and soft (about 10px offset, 50px blur, very light) when the card shares its surface color. Never darken the large soft one (S12).
- Hard or high-contrast shadows belong to a whole-product style with matching strokes. Never as a one-off; introducing one is gated (S13).
- Colored shadows are pale, low-saturation tints only (S14).
- One light direction across the product, and few elevation levels. Consolidate one-off shadows onto the existing tokens (S16).

Containers
- Remove containers that white space already replaces: icon backgrounds, boxes around single items, cards inside cards (S17).
- When white space cannot separate zones, use small tone shifts of the same neutral: a band or a panel (S18).
- Strip dated effects such as gloss and heavy rings along with the borders, then re-check contrast, since simplified controls can end up washed out (S19).
- Keep radii on the existing tokens and restrained on text-dense screens (S20).

Accessibility overrides (standard practice; the source videos do not cover these)
- Inputs and other controls keep a boundary or fill with at least 3:1 contrast against what is around them. Do not make form fields borderless on a near-identical surface. This is a different role from a structural line and needs its own, stronger value; on a saturated surface it is usually a light outline, since a darker shade of the hue cannot reach 3:1 (S21).
- Focus indicators are not decoration. Never remove or weaken them (S22).

## Implement

Change the border, shadow and surface tokens or the shared card, input and table components. Replacing a divider with space means changing the parent's `gap` or padding, not adding margins to each child.

## Verify

In the after screenshot, groups must still be distinguishable with the lines gone. Check hover, focus, active and selected states still read, and re-run contrast on any control you simplified.

Evidence for each rule id: `EVIDENCE.md` at the package root.
