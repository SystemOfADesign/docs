---
name: lift-color
description: Fix color usage and contrast in an existing web UI without changing the brand. Use when text is hard to read, greys look washed out, the screen feels too loud or too flat, accent color is everywhere, colors clash, or a dark or tinted theme looks off. Covers WCAG contrast, neutrals, accent discipline, tinted surfaces and dark mode checks. Works inside the app's existing color tokens.
---

# Lift Color

Most of color is taste, and the taste here belongs to the brand, not to you. One part is not taste: whether text and controls can be read. Fix that part by measurement first. After that the work is mostly redistribution: put contrast where people read and act, take it away from everything else, and keep saturated color small.

Keep the brand's hues. Change where color is used, how much of it there is, and its lightness within the existing ramp.

## Diagnose

- **Measure (C1).** Compute the contrast ratio for every text style on every surface it appears on. `node <lift-ui>/scripts/contrast.mjs fg bg` or the `contrastFailures` list from `probe.mjs`. Do not judge by eye.
- **Contrast budget (C3).** List the highest-contrast things on the screen. If borders, decorations or containers are on that list ahead of text and primary controls, the budget is misspent.
- **Saturation area.** Estimate how much of the viewport is filled with saturated color, and look for saturated color sitting directly on saturated color.
- **Token drift.** Count distinct greys and near-duplicate brand shades. One-offs fold back into the ramp.

## Rules

Contrast
- Normal text is at least 4.5:1. Large text (24px, or about 18.7px bold) and UI component boundaries are at least 3:1 (C1).
- Mid-grey text on a light grey surface is the usual failure: `#757575` on `#ececec` is 3.9:1. Darken the text or lighten the surface (C2).
- Spend contrast on what is read or operated. Card fills, borders and dividers can be low contrast (C3).
- Do not quiet text on controls by lowering opacity or picking a color near the fill. Disabled states are the exception and should be unmistakably disabled (C4).
- Decoration sits at watermark strength. Lower its opacity until it stops competing with text, and lower it further on saturated backgrounds (C5).
- Text over an image needs a scrim, a solid surface, or a different placement (C6).

Accent
- One accent, applied to small things first: links, icons, indicators, the primary button (C7).
- Do not flood large surfaces with a fully saturated color. Pull it back to small accents or use a tint from the ramp (C8).
- Never place a saturated color directly on another saturated color (C9).
- An existing brand color on links or secondary elements is a cheap differentiator on a monochrome screen (C10).

Neutrals and surfaces
- Body text can be a very dark grey instead of pure black, as long as the ratio passes (C11).
- On a tinted surface, neutrals take a shade of that surface's hue. Plain grey looks dirty on color (C12).
- A barely warm or cool off-white page under white cards is a low-risk lift from flat white; it uses a fill step where a border would otherwise be needed (C13).
- On a vivid background, put text inside opaque light surfaces, or set it white and quiet everything else. Borders there are a darker shade of the same hue (C14).

Sets and themes
- When categorical colors are needed and the product has none, lock saturation and lightness and rotate hue only, in a pastel range with dark glyphs on top. Adding such a set is gated (C15).
- Dark mode inverts roles, it does not invert colors: page darkest, cards one step lighter, text near white, decoration re-lifted. If the product has two themes, validate both (C16).
- One color approach per product, held on every screen. The brand decides which; mixing approaches across screens is the failure (C17).

Accessibility overrides (standard practice; the source videos do not cover these)
- Color is never the only signal for state, errors or links inside text (C18).
- Semantic colors keep their meaning. Do not repurpose error red or success green as decoration (C19).

## When the brand color itself fails

If the brand's own color fails contrast as text or as a button fill with its label, do not quietly change it. Report the measured ratio, propose the nearest passing step in the same hue, and ask. Text that merely sits on a brand fill is different: change the text to a passing value the product already uses, without asking.

On a saturated brand surface the room between passing and pure white is narrow, so quiet text there will be only slightly quieter than body text. Accept that rather than failing contrast.

## Implement

Change the color tokens or their semantic aliases (`--text-muted`, `text-muted-foreground`, theme palette entries), not per-element hex values. If a token is used on several surfaces, check the ratio on each before changing it.

## Verify

Re-measure every pair you touched, in every theme. Look at the after screenshot in greyscale: ranking should survive without hue.

Evidence for each rule id: `EVIDENCE.md` at the package root.
