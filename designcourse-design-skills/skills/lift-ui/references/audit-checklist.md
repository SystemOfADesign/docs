# Audit checklist

Use in audit and full modes. Each line is a yes/no question with the measurement that answers it and the rule it tests. Record only failures, each with a location and a number. `probe` means a field in `metrics.json` from `scripts/probe.mjs`.

## 0. System

- [ ] Tokens located (type, spacing, color, radius, shadow) and listed with the values in use
- [ ] One-off values that bypass tokens listed
- [ ] Breakpoints and themes in scope listed; before screenshots captured at each

## 1. Reading and use (fix first)

- [ ] Every text style passes 4.5:1, or 3:1 if large. `probe.contrastFailures`, `contrast.mjs` (C1, C2)
- [ ] No text on controls dimmed by opacity or near-fill color (C4)
- [ ] Text over images has a solid or scrimmed backdrop (C6)
- [ ] The primary action is identifiable in under a second; exactly one filled primary per view (L16)
- [ ] Controls keep a 3:1 boundary or fill; focus indicator visible on every interactive element (S21, S22)
- [ ] Page works at 200% zoom with no clipped or overlapping text (T23)

## 2. Hierarchy

- [ ] Each text cluster: roles listed, no two roles share size, weight and color. `probe.text.styles` (T1)
- [ ] The most important element on the screen has the strongest treatment (T3)
- [ ] Adjacent tiers are clearly apart; no secondary heading within about 1.25x of the primary without a weight or color change (T5)
- [ ] No block has more than three text tiers (T7)
- [ ] Secondary text and metadata are quieter than primary, by color (T10, T13)
- [ ] Links look clickable without relying on color alone (T17)
- [ ] Distinct sizes, weights and colors in use match the token scale. `probe.text.distinctSizes` (scale drift)

## 3. Structure

- [ ] No centered block adjacent to a left-aligned block. `probe.text.alignment` (L1)
- [ ] Each column has one left edge. `probe.raggedColumns` (L2)
- [ ] No side-by-side mini columns of list-like items inside a column (L5)
- [ ] Gap between groups is clearly larger than gap within groups (L8)
- [ ] Equivalent gaps are equal and on the spacing scale (L9)
- [ ] Size and footprint follow the content ranking (L11)
- [ ] Padding inside buttons, inputs, badges and cards is visible, not dominant, and text is measurably centered (L7, L12)
- [ ] Controls are neither clumped nor oversized (L17)
- [ ] No horizontal overflow at any breakpoint. `probe.horizontalOverflow` (L20)
- [ ] Tab order follows visual order (L21)

## 4. Noise

- [ ] Every border has a job no other cue is doing. `probe.borders.borderedElements` (S1)
- [ ] No heavy rules under headings; no dividers between items that space already separates (S2)
- [ ] Surviving borders are 1px and low contrast. `probe.borders.distinct[].contrastVsSurface` (S6)
- [ ] No element stacks border, shadow and fill change together; no nested bordered boxes (S6, S17)
- [ ] Thick or brand-colored lines appear only on active, current or selected states (S7)
- [ ] Every shadow is needed, and is noticed after the content. `probe.shadows.distinct[].alpha` (S9, S10)
- [ ] Shadows share one direction and a small set of values (S16)
- [ ] Saturated color is confined to small elements; no saturated-on-saturated pairs (C8, C9)
- [ ] Decorative elements sit at watermark strength (C5)
- [ ] One color approach across the screens in scope (C17)

## 5. Polish

- [ ] Icons match text weight and sit centered with their labels as one group (L18)
- [ ] Labels and headings hold one voice: no mixed case, weight or tracking (T16)
- [ ] Body line length within 45 to 75 characters; line height comfortable (T22)
- [ ] Radii and shadows come from tokens (S16, S20)

## Severity

| Level | Meaning |
|---|---|
| 1 | Blocks reading or use (section 1) |
| 2 | Ranking unclear (section 2) |
| 3 | Structure (section 3) |
| 4 | Noise (section 4) |
| 5 | Polish (section 5) |

## Finding format

```
[severity] location | measurement | rule id | proposed fix (token / component / one-off) | gated: yes/no
```

Example: `[1] .meta on body (styles.css:24) | #757575 on #ececec = 3.90:1, needs 4.5 | C2 | darken --muted to next ramp step | gated: no`
