---
name: lift-type
description: Fix typography and typographic visual hierarchy in an existing web UI. Use when text roles look alike, headings do not lead, the eye has no entry point, secondary text competes with primary, or the type scale has drifted into one-off sizes. Works inside the app's existing type tokens and typeface; does not pick new fonts.
---

# Lift Type

Hierarchy fails when different kinds of text are dressed the same. The reader cannot tell where to start, so the page reads as amateur even when everything else is right. The fix is almost never a new font. It is deciding what each piece of text is, then making each kind look like itself with the fewest property changes that work.

Use the typeface and type tokens the product already has. If the scale lacks a step you need, propose a token; do not scatter one-off sizes. If there are no type tokens at all, set each value once in a shared rule and propose tokens in the report.

A role is what a piece of text is (heading, label, metadata). A tier is a size step. Roles outnumber tiers, so roles that share a size are told apart by weight or color.

## Diagnose

- **Role inventory (T1).** For each cluster of text, list the roles sitting together: eyebrow, heading, item title, body, metadata, link, label. Any two roles with the same computed size, weight and color is a defect.
- **Entry point (T3).** Name the single most important text on the screen and in each block. If it is not the strongest treatment, that is the first fix.
- **Scale drift.** Count distinct size, weight and color combinations in use and compare with the token scale. One-offs are suspects.
- **Tier gaps (T5).** Compare adjacent tiers. A secondary heading close in size to the primary competes with it.

## Rules

Separation
- Space alone does not separate a label from its content; give the label its own treatment (T2).
- Cheapest fix first: change weight only. Escalate one lever at a time, in this order: weight, size, color, case and tracking, container. Each lever adds separation; stop when the roles read (T4).
- Keep adjacent tiers visibly apart. A step under about 1.25x needs a weight or color change riding with it; 16 to 20 works with bold, 25 beside 31 does not (T5).
- Enlarging one tier shrinks its distance from its neighbour. Re-check the pair and move them together (T6).
- Three size tiers per block is the ceiling; separate further roles by weight or color. A different but similar-looking font does not create a tier (T7).
- When a heading gets large, reconsider its weight. Size is already leading, so regular or light can be the better choice if the brand allows (T8).
- A heading over repeated items needs three tiers: section heading largest, item titles bold and a little larger than body, descriptions quietest (T9).

Demotion
- Demote with color before size. Secondary text recedes by getting quieter, not smaller (T10).
- On a tinted surface, quiet text is a shade of that surface's hue, not neutral grey (T11).
- Never demote below 4.5:1. Bold or large text can sit at lower contrast than small regular text, so lighten in step with weight and size, down to 3:1 for large text (T12).
- Metadata such as dates and counts is visibly secondary but still readable (T13).

Small text
- A label above a headline should be a different kind of text, not a slightly smaller headline. Use the product's existing label or eyebrow style. If none exists, or the existing class looks like body text, weight and color are enough; introducing uppercase, tracking or a badge is gated (T14).
- Do not shrink labels past legibility. Treat 12px as the floor (T15).
- One label, one voice: no mixed weight, case, style or tracking inside a single label or heading (T16).

Links and wayfinding
- Clickable text looks clickable: underline, or a container. Color alone is not enough (T17).
- Breadcrumbs carry an explicit separator (T18).
- An existing brand color on links is a legitimate extra differentiator on an otherwise monochrome page (T19).

Density
- On overview pages a heavy block usually has too much text. Propose shorter excerpts before restyling; cutting copy is gated (T20).
- When tiers feel cramped, raise line height slightly on the small body text first (T21).

Baseline craft (standard practice, not from the source videos)
- Body line length 45 to 75 characters. Body line height about 1.4 to 1.6, headings about 1.1 to 1.3 (T22).
- Sizes in `rem`, never fixed pixel heights on text containers, so text survives 200% zoom and user font settings (T23).

## Implement

Change the token or the shared text component, not each instance. In Tailwind that means the theme or the component's class list; in CSS variables, the variable; in a component library, its typography variants. Keep heading levels and other semantics as they are: restyle an `h2`, do not swap it for a `div`.

## Verify

Squint at the after screenshot: the tiers should still be countable. Then confirm contrast on every color you changed, and check the longest real strings at the narrowest breakpoint for wrapping.

Evidence for each rule id: `EVIDENCE.md` at the package root.
