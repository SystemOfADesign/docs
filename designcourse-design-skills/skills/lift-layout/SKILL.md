---
name: lift-layout
description: Fix alignment, spacing, grouping, density and visual order in an existing web UI. Use when a screen feels cluttered, messy, cramped or scattered, columns have no clear edge, left-aligned and centered blocks are mixed, gaps are inconsistent, controls are clumped or oversized, or the primary action does not stand out. Works inside the app's existing spacing scale, grid and breakpoints.
---

# Lift Layout

A layout reads as designed when a few straight edges and a few consistent gaps explain where everything sits. Most messy screens have neither: each element starts on its own line and each gap was chosen on its own. Give every column an edge, make related things close and unrelated things far, and let scale follow importance.

Use the spacing scale and grid the product already has. Snap one-off values to the nearest step.

## Diagnose

- **Guide test (L2).** For each column or card, collect the left offsets of its direct content (logo, heading, text, controls). More than one distinct offset is a defect; icon-plus-label lists may have two.
- **Alignment mix (L1).** List `text-align` per block. Left-aligned and centered blocks next to each other is the firm defect; a lone centered block beside an image is minor.
- **Gap audit (L9).** Measure equivalent gaps (above each section, between each card). Unequal values, or values off the spacing scale, are defects.
- **Proximity (L8).** Compare the gap inside a group with the gap between groups. If they are close, groups run together.
- **Ranking (L11).** Rank the content. Check that size and footprint fall in the same order.

## Rules

Edges
- One alignment per neighbourhood. Do not put centered blocks beside left-aligned ones; convert the centered block (L1).
- Every column has one straight edge that its logo, heading, body and controls all start on (L2).
- Centered multi-line text forms no edge, because both sides are ragged. Center only short, isolated blocks (L3).
- Re-align groups as a unit, then re-check the gutter: a column that was centered starts further left once aligned (L4).
- No columns inside a column without need. Short list-like items stack vertically; scanning down beats scanning across (L5).
- Repeated rows and cards share both edges of their column (L6).
- Center by measurement, not by eye. A 1 to 2 pixel offset of text in a button, input or badge is a real defect (L7).

Spacing
- The gap between groups is clearly larger than the gap within them. Spend white space between groups, keep it tight inside (L8).
- Equivalent gaps are equal. Small mismatches cost more than they look (L9).
- Budget white space by content load. A dense page gets smaller gaps, applied consistently; when space cannot separate zones, use a tone shift (see `lift-surfaces`) (L10).
- Size a container and its content together. Padding is visible but not dominant, with sides at least as generous as top and bottom. After adding an element, rebalance; do not just append (L12).
- Headlines get clear space. Nothing high-contrast sits beside, behind or over them (L13).

Order and scale
- Rank content before arranging it. The top item is largest but its footprint is capped; the rest still has to fit (L11).
- Density rises as importance falls: more columns, less decoration, text only for the lowest tier (L14).
- Remove headings that restate what a nearby heading already says. Cutting copy is gated (L15).

Controls and actions
- One primary action per view: filled, no border, sized by priority. Secondary actions are quieter: a thin low-contrast outline or plain text (L16).
- Controls are not clumped or oversized. Distribute them across the container with labels left-aligned above (L17).
- Icon beside label: the label leads. Match icon stroke to text weight, keep it near cap height, give it a deliberate gap, and center the pair as one group (L18).
- Repeated cards get one small consistent action (L19).

Baseline craft (standard practice, not from the source videos)
- Check every change at each existing breakpoint, with the longest realistic strings. Do not add breakpoints (L20).
- Visual order matches DOM order, so keyboard and screen-reader order still make sense. Pointer targets stay at least 24 by 24 CSS pixels (L21).

## Implement

Fix the layout primitive: the grid, stack or container component, or the spacing token. Prefer `gap` on the parent over margins on children. Do not reorder DOM nodes to achieve a visual order.

## Verify

Overlay or imagine one vertical guide per column in the after screenshot; everything should touch it. Tab through the screen. Resize through each breakpoint.

Evidence for each rule id: `EVIDENCE.md` at the package root.
