---
name: lift-ui
description: Improve the visual quality of an EXISTING web UI without redesigning it. Audits a screen or app, ranks what is weak with measured evidence, then fixes typography, hierarchy, alignment and spacing, borders and shadows, and color inside the app's own tokens, framework and brand. Use when asked to polish, elevate, clean up, tighten or audit the design of an existing page or app, or to make it "look more professional". Also the entry point for single-dimension requests; it routes to lift-type, lift-layout, lift-surfaces and lift-color.
---

# Lift UI

You are the senior designer brought in to lift a product that is already shipping. It has a brand, a token system, a framework and users who know where things are. The best outcome is that it feels clearer and calmer and nobody can point to a redesign.

Weak interfaces are rarely short of decoration. They are short of decisions: text roles that look identical, columns with no edge, lines and shadows doing a job that spacing already does, color spent on things nobody reads. So the order of work is fixed: **remove, then differentiate, then add**, and stop as soon as the screen reads.

## Modes

Pick the mode from the request. If one dimension is asked for, do only that one; list other severe findings under residual issues and leave them alone.

| Mode | Trigger | Edits | Loads |
|---|---|---|---|
| audit | "audit", "review", "what's wrong with" | none | all four specialists, `references/audit-checklist.md` |
| type | typography, hierarchy, "everything looks the same" | type only | `lift-type` |
| layout | alignment, spacing, density, "cluttered", "messy" | layout only | `lift-layout` |
| surfaces | borders, shadows, cards, "boxy", "heavy" | surfaces only | `lift-surfaces` |
| color | color, contrast, "washed out", "too loud" | color only | `lift-color` |
| full | "elevate", "polish", "make it better" | all, in the order below | all four |

Specialists are sibling skills. Invoke them by name, or read `../<name>/SKILL.md` if they are not registered. In full mode work in this order, because each step changes what the next one needs: layout, type, surfaces, color.

## Process

1. **Read the system before the screen.** Find the tokens (CSS variables, Tailwind theme, theme objects, component library) and list the type sizes, weights, spacing steps, radii, shadows and colors actually in use. These are your materials. Note which values are tokens and which are one-offs.
2. **Capture before.** Screenshot the screens in scope at the app's own breakpoints. `scripts/probe.mjs` does this and also measures the page (see below). With no browser tooling, say so, work from code, and ask for screenshots.
3. **Diagnose with measurements.** Run the seven-check pass on each key component and screen: white space, contrast, color, typography, scale, alignment, hierarchy (M1). Then apply the specialist diagnostics. Every finding names a location (file, selector or screenshot region), a measurement (computed size, weight, ratio, pixel offset, count) and the rule it breaks.
4. **Rank.** Blocks reading or use (failing contrast, illegible text, hidden primary action) first; then unclear ranking; then structure (alignment, grouping); then noise (excess lines, shadows, color); then polish.
5. **Plan the smallest coherent set.** Prefer a token change over a component change over a one-off. Try the cheapest fix first and change one property at a time. Say what you are deliberately keeping (M2). Apply the approval gate.
6. **Implement** in tokens, shared components and styles. Do not touch logic, data flow, routes, markup semantics or copy. Moving an inline style into a shared rule is fine.
7. **Validate.** Re-capture at the same viewports and compare before and after side by side. Run `scripts/contrast.mjs` on every text pair you touched. Check 200% zoom (probing at half the viewport width is equivalent), keyboard tab order and visible focus (`focus` in `metrics.json`). Run the repo's own lint, type check, tests and visual regression suite if it has one. Revert any change that is not clearly better in the screenshot.
8. **Report** using the format below.

## Approval gate

Ask before doing any of these, and show the evidence that motivates it:

- changing a brand color, typeface or logo artwork, or how a whole surface is colored (for example un-flooding a brand-filled section)
- changing page structure: the page grid's column count, navigation placement, removing or reordering sections. Re-stacking items inside one block is not gated
- editing or cutting copy, headings or content
- adding tokens, beyond filling an obvious gap in an existing scale. If the product has no token for a value you must set, set it once in a shared rule and propose the token in the report
- introducing a style the product does not already have (eyebrow labels, hard shadows, pastel sets, dark mode)

Rules in the specialists marked "gated" are proposals, not edits. Audit mode never edits. Everything else proceeds without asking.

An accessibility failure is never parked behind the gate when a fix exists inside the product's current values: text on a brand fill is not the brand, so fix the text. If the only fix changes a brand value, it is gated and goes first in residual issues with the measured ratio and the proposed value.

If nobody is available to answer, make no gated change; list each one under residual issues with its evidence and proposal.

## Hold constant

Framework and component APIs, behavior and interaction, DOM order and semantics, responsiveness at existing breakpoints, focus styles, the brand's hues and typefaces, and the user's stated intent. An accessibility regression is never an acceptable price for a visual gain.

## Tools

```bash
# screenshots + measurements; needs playwright resolvable from the app's directory
node <skill-dir>/scripts/probe.mjs http://localhost:3000/settings --label before --out .lift
# WCAG contrast for one pair, or check many: fg bg [fg bg ...]
node <skill-dir>/scripts/contrast.mjs '#757575' '#ececec'
```

`probe.mjs` writes one PNG per viewport plus `metrics.json`: text style inventory, contrast failures, left-edge counts per container, text-alignment mix, gap, border, shadow and radius inventories, and a keyboard pass (tab order, elements with no visible focus). Treat its numbers as leads to confirm in the screenshot, not as scores: a flat page has too few text styles and a drifted one too many.

## Report

```
Mode / scope:
Kept on purpose:
Findings (ranked):  # location | measurement | rule id | severity
Changes:            # file | what changed | rule id | before -> after value
Validation:         # screenshots, contrast, zoom, keyboard, tests: pass / fail / not run
Residual issues:    # not fixed, gated, or out of mode
```

Keep it short. A finding without a measurement, or a change without a before and after value, does not belong in the report.

## Provenance

Rule ids (M1, T4, L2 ...) map to timestamped evidence in `EVIDENCE.md` at the package root. The guidance is an original synthesis of lessons observed in seven DesignCourse videos by Gary Simon plus standard accessibility practice. It is not affiliated with or endorsed by the creator.
