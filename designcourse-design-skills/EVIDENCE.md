# Evidence map

Every rule id used in the skills, traced to where it was observed. Timestamps point into the per-video extraction notes under `research/<video-id>/extraction.md`, which hold the paraphrased findings, the values read from frames, and the limitations of each extraction.

The rules are an original synthesis. They are not quotations, and this package is not affiliated with or endorsed by Gary Simon or DesignCourse.

## Sources

| Key | Video (DesignCourse, presenter Gary Simon) | URL | Published | Extraction |
|---|---|---|---|---|
| V1 | Typographic Visual Hierarchy in UI Design (4 Examples) | https://www.youtube.com/watch?v=u9XSmlZhYq4 | 2021-09-24 | `research/u9XSmlZhYq4/extraction.md` |
| V2 | 5 Types of Shadows for your UI Designs | https://www.youtube.com/watch?v=5qL8Zg6hISU | 2022-07-08 | `research/5qL8Zg6hISU/extraction.md` |
| V3 | STOP Doing THIS to your Designs! (BORDERS) | https://www.youtube.com/watch?v=Mv8Pjtvujno | 2020-08-07 | `research/Mv8Pjtvujno/extraction.md` |
| V4 | Fixing your BAD Alignment! Stop doing this one thing.. | https://www.youtube.com/watch?v=yxPk82xV7bA | 2021-12-30 | `research/yxPk82xV7bA/extraction.md` |
| V5 | Color Crash Course for UI/UX Designers [By Example] | https://www.youtube.com/watch?v=Ewj85eIda74 | 2022-01-18 | `research/Ewj85eIda74/extraction.md` |
| V6 | The most IMPORTANT design lesson, taught by a BUTTON! | https://www.youtube.com/watch?v=KjRPX5EeKFA | 2022-01-25 | `research/KjRPX5EeKFA/extraction.md` |
| V7 | How do you Design a Layout with a TON of Content?! | https://www.youtube.com/watch?v=sfkF8aBT4dw | 2020-05-13 | `research/sfkF8aBT4dw/extraction.md` |

All seven were accessed on 2026-11-20 through YouTube auto-generated English captions plus uniformly sampled video frames. No human-verified transcript was available for any of them. See "Access and limitations" at the end.

## Basis column

- **stated**: the presenter says it.
- **shown**: demonstrated on screen; the wording of the rule is ours.
- **inferred**: our generalisation from what was stated or shown. Thresholds and numbers marked inferred were not given by the presenter.
- **standard**: common accessibility or typographic practice, not from the videos. Cited to WCAG 2.2 where applicable.

## Method (lift-ui)

| ID | Rule | Source | Basis |
|---|---|---|---|
| M1 | Seven-check pass: white space, contrast, color, typography, scale, alignment, hierarchy | V6 00:38-01:08, 01:15-03:23 | stated |
| M2 | Keep what works and change the minimum; remove before adding | V3 08:36-08:50, 09:14-09:30, 03:49-04:09; V1 03:03-03:46 | stated; the remove, differentiate, add ordering is inferred |

## Type (lift-type)

| ID | Rule | Source | Basis |
|---|---|---|---|
| T1 | Role inventory; identical styling of different roles is a defect | V1 01:53-02:23 | stated |
| T2 | Space alone does not separate label from content | V1 02:23-02:46 | stated |
| T3 | Choose the most important element first; strongest treatment | V1 06:07-06:21, 12:44-13:01; V7 05:10-05:50 | stated |
| T4 | Cheapest fix first (weight), then one lever at a time | V1 03:03-03:46, 04:35-04:52 | stated; the lever order is inferred from the demo sequence |
| T5 | Keep adjacent tiers apart | V1 07:09-07:42, 11:47-12:05 | shown (16/21/31 works, 25 beside 31 fails, 16 to 20 works with bold); the 1.25x figure is inferred |
| T6 | Scale adjacent tiers together | V7 22:00-23:00 | stated |
| T7 | Three tiers per block; a similar font is not a tier | V7 08:45-11:15 | stated; "ceiling" is inferred |
| T8 | Reconsider weight when a heading is large | V1 04:15-04:25, 13:08-13:25 | stated |
| T9 | Section heading over repeated items: three tiers | V1 11:39-12:35 | shown (40/20/16) |
| T10 | Demote with color before size | V1 07:45-08:15, 14:25-14:42; V7 10:00-11:15 | shown; the ordering is inferred |
| T11 | Quiet text on tinted surfaces is a shade of the surface hue | V1 07:45-08:15, 09:40-09:47 | stated |
| T12 | Never below 4.5:1; bold or large text tolerates less | V1 14:42-14:56; V5 05:50-06:50; V7 11:20-12:10 | stated; the 3:1 large-text floor is standard (WCAG 1.4.3) |
| T13 | Metadata visibly secondary but readable | V1 14:25-14:42; V7 36:00-36:50 | stated |
| T14 | A label above a headline is a different kind of text | V1 08:19-09:19 | shown; gating a new eyebrow style is our constraint |
| T15 | Do not shrink labels past legibility | V1 09:12-09:19 | stated; the 12px floor is inferred (smallest size shown) |
| T16 | One label, one voice | V6 02:07-02:26 | shown |
| T17 | Clickable text looks clickable | V1 13:47-14:07 | stated; "color alone is not enough" is standard (WCAG 1.4.1) |
| T18 | Breadcrumbs carry a separator | V1 13:27-13:39 | shown |
| T19 | Brand color on links as a differentiator | V1 15:03-15:11 | stated |
| T20 | Shorter excerpts on overview pages | V7 08:10-08:40, 28:50-29:40 | stated |
| T21 | Raise line height slightly on small body text | V7 08:30, 10:00-11:15 | shown |
| T22 | Line length 45 to 75 characters; line-height ranges | none | standard |
| T23 | `rem` sizes; text survives 200% zoom | none | standard (WCAG 1.4.4, 1.4.12) |

## Layout (lift-layout)

| ID | Rule | Source | Basis |
|---|---|---|---|
| L1 | One alignment per neighbourhood | V4 02:48-03:06, 06:05-06:21 | stated |
| L2 | One straight edge per column; guide test | V4 01:36-01:44, 02:20-02:40, 03:38-04:04; V7 06:00-06:30 | stated |
| L3 | Centered multi-line text forms no edge | V4 01:44-01:53 | stated; "center only short, isolated blocks" is inferred from V4 01:05-01:17, 05:51-06:05 |
| L4 | Re-align groups as a unit; re-check the gutter | V4 03:09-03:19 | shown |
| L5 | No columns inside a column; stack list-like items | V4 04:14-04:29, 05:04-05:46 | stated |
| L6 | Repeated rows share both column edges | V4 02:25-02:37 | shown (praised as correct) |
| L7 | Center by measurement; small offsets are defects | V6 02:45-03:01 | stated |
| L8 | Between-group gap larger than within-group gap | V3 04:09-05:11; V7 24:10-24:30, 31:10-31:30 | stated |
| L9 | Equivalent gaps are equal | V7 30:20-31:10 | stated |
| L10 | Budget white space by content load; tone shift when space is short | V7 31:30-32:00, 23:00-24:10 | stated |
| L11 | Rank content first; cap the top item's footprint | V7 05:10-05:50, 16:30-18:00 | stated |
| L12 | Size container and content together; rebalance after adding | V6 01:15-01:30, 02:29-02:44, 03:01-03:23 | stated; "sides at least as generous" is inferred from frames |
| L13 | Headlines get clear space | V3 09:45-10:30 | stated |
| L14 | Density rises as importance falls | V7 16:50-17:20, 32:40-33:10, 35:00-36:50 | inferred from the build |
| L15 | Remove headings that restate context | V4 04:29-05:04 | stated |
| L16 | One filled primary action; quieter secondary | V3 06:41-06:53, 11:16-12:05; V6 02:37-02:44 | stated; "one primary per view" is inferred |
| L17 | Controls not clumped or oversized | V3 07:28-07:50, 08:10-08:22, 10:55-11:16 | shown |
| L18 | Icon beside label: label leads | V6 03:01-03:23 | shown; proportions are estimates from frames |
| L19 | One small consistent action per card | V7 28:50-29:40 | shown |
| L20 | Check every breakpoint with realistic strings | V7 14:50-15:50, 21:30-21:50 for realistic text | breakpoints are standard; the videos do not cover responsive behaviour |
| L21 | Visual order matches DOM order; 24px targets | none | standard (WCAG 1.3.2, 2.4.3, 2.5.8) |

## Surfaces (lift-surfaces)

| ID | Rule | Source | Basis |
|---|---|---|---|
| S1 | Delete borders whose job is already done | V3 03:05-03:27, 03:49-04:09 | stated |
| S2 | No rules under headings; space instead of dividers; then widen group gaps | V3 02:53-05:11 | stated |
| S3 | No lines in tight layouts | V3 02:35-02:46 | stated |
| S4 | Container by fill step instead of outline | V3 06:17-06:40; V5 04:25-05:05, 07:10-07:45 | stated |
| S5 | Containers may be low contrast | V5 04:25-05:05, 09:27-09:50 | stated |
| S6 | Surviving borders 1px and low contrast; no stacking | V3 02:22-02:28, 09:03-09:14, 13:10-13:50, 17:05-17:20; V5 17:30-18:00 | stated |
| S7 | Strong lines mean state; menus use a rail | V3 14:50-15:27, 17:20-17:35, 17:50-18:07 | stated |
| S8 | Faint optional row separators; one divider direction | V3 17:35-17:50; V7 14:30-16:20, 36:50-37:50 | stated; the one-direction rule is inferred |
| S9 | Ask whether the shadow is needed | V2 01:55-02:29 | stated |
| S10 | Shadow only outlines; about 10% black over a 25% default | V2 03:01-04:02, 09:43-10:00 | stated; 11% and 25% read from the tool panel |
| S11 | Tint shadows on colored surfaces | V2 04:15-04:56 | stated |
| S12 | Two geometries: small tight, large soft | V2 02:31-03:22, 06:54-08:15 | shown; values read from the tool panel |
| S13 | Hard high-contrast shadows only as a full style | V2 06:09-06:52, 10:39-10:48 | stated; gating is our constraint |
| S14 | Colored shadows pale and low saturation | V2 09:01-09:43 | stated |
| S15 | Decorative lines at watermark strength; sparse accent bars | V3 13:10-13:50, 14:21-14:50, 15:40-16:00, 16:44-17:00; V5 02:45-03:10 | stated |
| S16 | One light direction; few elevation levels | V2 02:58-09:56 | inferred (every example falls down-right); consolidation onto tokens is standard |
| S17 | Remove containers white space replaces | V5 09:50-10:10; V2 02:07-02:22 | stated; "cards inside cards" is inferred |
| S18 | Tone shifts separate zones | V7 23:00-24:10 | stated |
| S19 | Strip dated effects, then re-check contrast | V3 06:53-07:27 | stated |
| S20 | Restrained radii on dense screens | V7 27:30-28:10 | shown; staying on existing tokens is our constraint |
| S21 | Controls keep a 3:1 boundary | none | standard (WCAG 1.4.11). Diverges from V3 06:17-06:40, which shows borderless inputs without discussing accessibility |
| S22 | Never weaken focus indicators | none | standard (WCAG 2.4.7) |

## Color (lift-color)

| ID | Rule | Source | Basis |
|---|---|---|---|
| C1 | Measure contrast; 4.5:1 normal, 3:1 large | V5 05:05-06:20; V7 11:20-12:10 | stated; large-text sizes and the 3:1 component threshold are standard (WCAG 1.4.3, 1.4.11) |
| C2 | Mid-grey on light grey fails (3.9:1) | V5 06:05-06:20 | shown; reproduced by `contrast.mjs` |
| C3 | Spend contrast on what is read or operated | V5 04:25-05:05, 09:27-09:50 | stated |
| C4 | Do not dim control text by opacity | V6 01:30-01:47 | shown; the disabled exception is standard |
| C5 | Decoration at watermark strength | V5 02:45-03:10, 14:50-15:25, 17:00-17:30; V3 09:56-10:09 | stated |
| C6 | Text over images needs contrast | V3 10:30-10:50 | stated; the scrim technique is standard |
| C7 | One accent, small things first | V5 08:45-10:45 | stated |
| C8 | No saturated floods on large surfaces | V5 10:55-11:50 | stated |
| C9 | No saturated on saturated | V5 16:35-17:00; V6 01:49-02:05 | shown |
| C10 | Brand color on links as a differentiator | V1 15:03-15:11 | stated |
| C11 | Very dark grey instead of pure black | V5 06:45-07:10 | stated |
| C12 | Neutrals take the surface hue | V1 09:40-09:47; V2 04:15-04:56 | stated |
| C13 | Off-white page under white cards | V5 07:10-07:45, 15:25-16:00 | stated |
| C14 | Vivid backgrounds: opaque surfaces or white text; tonal borders | V5 16:00-18:00 | shown |
| C15 | Lock saturation and lightness, rotate hue | V5 12:40-14:15 | stated; gating is our constraint |
| C16 | Dark mode inverts roles; re-check | V5 03:25-04:05, 07:45-08:25, 11:50-12:30 | stated |
| C17 | One color approach per product | V5 18:00-18:50 | stated |
| C18 | Color is never the only signal | none | standard (WCAG 1.4.1) |
| C19 | Semantic colors keep their meaning | none | standard |

## Seen in the sources but deliberately not carried over

| Lesson in the source | Why it is not a rule here |
|---|---|
| Borderless inputs defined only by fill (V3 06:17-06:40) | Risks failing WCAG 1.4.11; replaced by S21 |
| Uppercase tracked eyebrow as the preferred small label (V1 08:33-09:12) | A style addition, not a fix; allowed only where the product already has it (T14) |
| Neubrutalist hard shadow with thick stroke (V2 06:09-06:52) | A whole-product aesthetic; introducing it is aesthetic drift (S13) |
| Font pairing with a generator (V7 01:26-03:00) | These skills keep the product's typefaces |
| Right-aligning text toward an adjacent image (V4 01:22-02:10) | Presented by the presenter as optional taste |
| Specific hex values and pixel sizes from the demos | Demo values, read from compressed video; ratios and direction are used, not the numbers |

## Access and limitations

| Key | Transcript | Frames | Notes |
|---|---|---|---|
| V1 | auto-captions, 421 segments | 80 sampled, 66 inspector crops | Hex values medium confidence; no stated type scale |
| V2 | auto-captions | 80 sampled, 40 panel crops | Most numbers read from small panel text |
| V3 | auto-captions, 566 segments | 80 sampled, 19 stills | Two good-border examples rest on narration only; few stated numbers |
| V4 | auto-captions | 80 sampled | No numeric values taught; narrow scope |
| V5 | auto-captions, 549 segments | 80 sampled, 38 crops | Some colors read mid-drag |
| V6 | auto-captions | 80 sampled, 17 stills | Partial: 4-minute overview, no stated values; all numbers are estimates |
| V7 | auto-captions | 80 sampled, 11 stills | One desktop dark text-only page; no responsive behaviour |

Common to all seven: the `watch` skill's scene-change sampling failed on the installed ffmpeg (9.0.2 rejects `-vsync`), so frames are uniform samples and brief on-screen states may have been missed. The local Whisper endpoint timed out, so captions were not cross-checked. Topics the videos do not cover at all, and which are therefore only present here as standard practice: responsive behaviour, interaction states, focus and keyboard use, non-text contrast, type scales and line length.

Not used: the Epic Typography Tutorial video (https://www.youtube.com/watch?v=1GPoUrf0MXg), the DesignCourse blog post on typographic hierarchy, and the freeCodeCamp article were named in the original brief but were never fetched. Nothing in this package comes from them.
