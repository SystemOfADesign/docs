# Extraction: Typographic Visual Hierarchy in UI Design (4 Examples)

Original paraphrased notes on the design principles taught in one video. Not a transcript. Not endorsed by or affiliated with the creator.

## Source

| Field | Value |
|---|---|
| Title (as published) | Typographic Visual Hierarchy in UI Design (4 Examples) |
| Channel | DesignCourse (presenter: Gary Simon) |
| URL | https://www.youtube.com/watch?v=u9XSmlZhYq4 |
| Video ID | u9XSmlZhYq4 |
| Duration | 16:09 (968.5 s) |
| Publish date | 2021-09-24 (yt-dlp metadata `upload_date`) |
| Extraction date | 2026-11-20 |
| Tool shown on screen | Figma, typeface Roboto throughout |
| Creator's written version | Description links a written tutorial on designcourse.com (not fetched, not used here) |

Chapters (from video metadata): Introduction 00:00, sponsor 00:58, Example 1 01:33, Example 2 05:29, Example 3 11:13, Example 4 12:34, Final thoughts 15:22.

## Access record

| Item | Result |
|---|---|
| `watch:watch` skill usable | Yes, with one workaround (below). Preflight `setup.py --check` exited 0. |
| Download | OK via yt-dlp, 1280x720 AV1. |
| Transcript | Obtained. Method: **YouTube native captions** (English auto-generated track, `en` / `en-orig`), 421 segments. Whisper was not needed for the main transcript. |
| Frames | **80 frames**, uniform sampling every ~12.1 s, 768 px wide, all 80 viewed. |
| Extra visual evidence | 66 additional full-resolution crops of the Figma inspector panel taken with ffmpeg from the downloaded video at chosen timestamps, to read font size / weight / tracking / hex values that are illegible at 768 px. |
| Failure 1 | Skill's default scene-change sampling failed: installed ffmpeg 9.0.2 rejects the `-vsync` option used in `scripts/frames.py`. Worked around with the skill's own `--no-scene-change` flag (uniform sampling). Plugin not modified. |
| Failure 2 | Hook microscope (0-10 s) Whisper call to the local Spark endpoint timed out after 4 attempts. Only affects word-level timing of the intro; no instructional content there. |
| Skipped by instruction | Obsidian vault staging/ingest (no vault detected anyway), and filling the skill's own `report.md`. |
| Raw working files | Kept in the session scratchpad (video, captions, 80 frames, panel crops), not in this directory. |

## Timestamped findings

Paraphrased. Timestamps are caption times, accurate to a few seconds.

### Framing

- [00:21-00:33] The symptom of missing hierarchy: the viewer cannot tell where to look first, because neighbouring text elements are styled identically.
- [00:45-00:53] Hierarchy is treated as a fundamental: a layout with everything else right still reads as amateur if hierarchy is wrong.
- [01:53-02:18] Diagnostic question to ask of any text cluster: how many semantically different kinds of text sit next to each other? Each kind needs its own treatment.
- [02:44-02:54] There is no single best fix; several treatments are acceptable for the same problem.

### Example 1: footer navigation (labels over link lists) [01:33-05:29]

- [02:03-02:23] Two roles are present (column label, links) but both are styled the same.
- [02:23-02:46] Whitespace between the label and its list is the only differentiator, and that alone is not enough; the column reads as one undifferentiated vertical nav.
- [03:03-03:36] Simplest fix: keep everything else and change only font weight of the labels to bold. Presented as both a visual and a usability improvement.
- [03:38-03:46] Caveat: bold alone is sufficient here, but will not be in every context.
- [03:46-04:15] Stronger separation option: also make labels larger and add a little space below them. The presenter prefers the bold-only version in this context and finds large bold labels slightly odd here.
- [04:15-04:25] When a label is enlarged, try dropping it back to regular or light weight; size is already carrying the distinction.
- [04:35-04:52] Colour/contrast option: sample the section background and derive a mid-tone of it for the labels. Each extra changed property adds separation.
- [04:56-05:15] Underlining the links is another separator (and marks them as links), but he still wants the labels bold on top of it.
- [05:16-05:23] On reviewing the variants he is least happy with one of them and suggests lowering its contrast (which variant is ambiguous from the captions; see limitations).

### Example 2: feature block (eyebrow, headline, description) [05:29-11:16]

- [05:36-05:58] Three roles: small sub-heading above, headline, description. Identical styling leaves no entry point.
- [06:07-06:21] Start with the most important element (the headline) and make it the largest.
- [06:21-06:31] Size on the headline alone still leaves the other two roles identical to each other; more work needed.
- [06:31-06:55] Add bold to the headline. Side-by-side with a regular-weight copy shows the eye goes to the heavier one.
- [07:01-07:22] Sub-heading option A: a size between description and headline, so it is clearly not body text.
- [07:22-07:42] Limit: if the sub-heading approaches headline size they compete. Finding that balance is described as a matter of experience.
- [07:45-08:15] Description: tint it with a darkened version of the background hue instead of pure black, lowering its prominence. Do not go too light because of accessibility; he indicates a lightest acceptable point.
- [08:19-08:31] Sub-headings can be made stylistically distinct from everything else, which reinforces hierarchy further.
- [08:33-09:12] Sub-heading option B (eyebrow style): uppercase, quite small, bold, extended letter spacing, tinted colour.
- [09:12-09:19] Limit: too small becomes unreadable and therefore pointless.
- [09:21-09:55] Sub-heading option C: reset tracking, put the label in a small filled container (badge) with white text.
- [09:40-09:47] Aside: neutral greys do not sit well on a background that has hue; tint the colour toward the background hue.
- [09:55-10:12] Text in containers/buttons needs even padding on all four sides (he eyeballs it).
- [10:12-10:20] Variant: rounded corners on the badge.
- [10:28-10:45] Variant: low-contrast badge (pale fill, dark text) instead of saturated fill with white text.
- [10:45-11:16] Summary of the progression: from undifferentiated text to each element defined "in its own space"; the simpler size+weight version is also acceptable.

### Example 3: section heading over three feature columns (dark background) [11:13-12:34]

- [11:19-11:35] Common block right under a hero: one section heading plus repeated title+description columns.
- [11:39-11:47] Section heading is typically the largest, though not mandatory.
- [11:47-12:05] Column titles made larger and bold; section heading can be bold as well but need not be. Much of this is preference.
- [12:21-12:35] Then colour: description text recoloured using a colour sampled from the design, giving what he considers a well-defined hierarchy.

### Example 4: article / help page on white [12:34-15:22]

- [12:44-13:08] Ask which element is most important. Here it is the title, since it tells users what the page is about; make it large enough to be seen first, sized relative to the existing body text.
- [13:08-13:25] Title weight is a brand/aesthetic choice: bold, light or thin can all work once size carries the emphasis. He picks bold.
- [13:27-13:39] Breadcrumb made more obviously a breadcrumb by adding a small dot separator between items.
- [13:47-14:05] Clickable text must look clickable: either a containerised button with a background, or an underline. Underline is described as universally understood.
- [14:15-14:25] Just those two changes (title size/weight, link underlines) already give a workable page.
- [14:25-14:42] The date should also differ: lower opacity or make it grey, but not below a readable contrast.
- [14:42-14:56] Compensation rule: text that is bold, or very large, can afford lower contrast.
- [15:03-15:11] If the page has a colour scheme, use it on links (or other secondary elements) as a further differentiator.

## Concrete design guidance

Values below were read from Figma's inspector in full-resolution crops of the video unless marked otherwise. They are what was shown, not recommendations stated as rules by the presenter. All text is Roboto. Line height stayed at 32 px for every text layer including 31-48 px headings (an artefact of the demo file, not taught).

### Example 1: footer

| Element | Before | After (variants) | When |
|---|---|---|---|
| Column labels | Regular 16, #000000, same as links | A: Bold 16 | 03:14-03:38 |
| | | B: Bold 20 with extra gap below; then tried Regular 20 | 04:00-04:25 |
| | | C: Bold 16 in mid-tone blue-grey #697A84 on pale blue-grey band | 04:38-04:45 |
| | | D: unchanged labels + underlined links, then labels bold too | 04:58-05:10 |
| Links | Regular 16, #000000 | unchanged (underlined in D) | |

- Observed before [01:37]: three columns where label and links differ only by a slightly larger gap; reads as one list.
- Observed after A [03:38]: labels immediately read as headings with no size or colour change.
- Observed after C [04:38]: labels recede in colour yet still read as headings because they stay bold; links (pure black) become the most prominent text.

### Example 2: feature block

| Element | Before | After | When |
|---|---|---|---|
| Headline | Regular 16 | 31, then Bold 31 | 06:15-06:35 |
| Sub-heading, option A | Regular 16 | Regular ~21 (18 also tried); 25 demonstrated as too close to the 31 headline | 07:09-07:42 |
| Sub-heading, option B | | Uppercase, Bold 12 then Bold 14, tracking 19%, colour #6C817C | 08:38-09:12 |
| Sub-heading, option C | | Bold 14, tracking back to 0%, white text on filled rect #289D81; later rounded | 09:28-10:20 |
| Sub-heading, option D | | pale tinted rounded badge with dark text | 10:28-10:45 |
| Description | Regular 16, #000000 | Regular 16, dark desaturated green #3D4F4A, lightest shown #566B66 | 08:00-08:10 |
| Background | pale mint | unchanged | |

- Size ratios shown (description : sub-heading : headline) = 16 : 21 : 31, roughly 1 : 1.3 : 1.9. The failing case is 16 : 25 : 31, where the top two differ by only ~1.25x.
- Eyebrow recipe as shown [09:05]: 12-14 px, bold, uppercase, ~19% letter spacing, colour tinted toward the background hue; sits about 0.4-0.45x the headline size.
- Observed [07:52]: larger regular-weight sub-heading above a bold headline reads as a lead-in line; hierarchy is clear but the two lines are close in size.
- Observed [09:05]: the small tracked uppercase label is clearly a different kind of text from both headline and body, so the headline has no competitor.
- Observed [10:05]: the filled badge is the most attention-grabbing treatment for the smallest text; padding looks even on all sides.
- Description colour is the background hue darkened, not grey [08:00]; visually it sits one step behind the black headline.

### Example 3: three-column feature section on dark background

| Element | Before | After | When |
|---|---|---|---|
| Section background | #26323B | unchanged | |
| Section heading | Regular 16, #FFFFFF, centred | 40, shown bold in the final state | 11:45-12:18 |
| Column titles | Regular 16, #FFFFFF | Bold 20 | 11:50-12:05 |
| Descriptions | Regular 16, #FFFFFF, centred | recoloured to a dimmer tint (hex not captured) | 12:24-12:31 |

- Ratios shown: body 16 : column title 20 : section heading 40 (1 : 1.25 : 2.5).
- Observed before [11:30]: seven text blocks in identical white 16 px; the section heading is indistinguishable from column titles.
- Observed after [12:18]: three clear tiers; small size step (16 to 20) for column titles works because weight changes with it.

### Example 4: article page

| Element | Before | After | When |
|---|---|---|---|
| Title | Regular 16, #000000 | 48; Thin and Light previewed; Bold 48 chosen | 13:03-13:27 |
| Breadcrumb | two plain words separated by space | dot separator added, both items underlined | 13:31-14:12 |
| Date | Regular 16, #000000 | Regular 16 #666666; then Bold 16 ~#7D7D7D-#7E7E7E; finally a teal tint (approx. #69C8D5, low-confidence read) | 14:32-15:17 |
| Body | Regular 16, #000000, 32 px line height | unchanged | |

- Ratio shown: title 48 on body 16 (3x).
- Grey compensation shown: the date went from #666666 at regular weight to a lighter ~#7D7D7D once made bold [14:44-14:56].
- Observed before [12:55]: breadcrumb, title, date and body all look like the same paragraph text.
- Observed after [14:56]: title dominates; breadcrumb reads as links; date is visibly secondary while remaining legible.

## Key frames

Times are frame capture times. Linked files are 1280 px wide stills re-exported from the downloaded video (8 kept).

| Time | Shows | Why it matters | File |
|---|---|---|---|
| 01:37 | Footer, labels and links all Regular 16 black | Baseline "no hierarchy" state; whitespace is the only cue | [assets/frame_01m37s.jpg](assets/frame_01m37s.jpg) |
| 03:38 | Same footer, labels bold only | Minimum effective change: one property (weight) | [assets/frame_03m38s.jpg](assets/frame_03m38s.jpg) |
| 04:02 | Labels Bold 20 with weight dropdown open | Size + weight variant; presenter tests lighter weights at larger size | not kept |
| 04:38 | Labels in mid-tone #697A84, colour picker open | Colour derived from background hue as a third lever | not kept |
| 05:39 | Feature block, three lines identical | Baseline for a 3-role cluster | [assets/frame_05m39s.jpg](assets/frame_05m39s.jpg) |
| 06:51 | Two copies side by side, bold vs regular headline | Direct comparison showing weight pulls the eye | not kept |
| 07:39 | Sub-heading enlarged to 25 next to 31 headline | The "too similar, now competing" failure case | not kept |
| 07:52 | Sub-heading ~21 regular above Bold 31 headline | Option A result: intermediate size | [assets/frame_07m52s.jpg](assets/frame_07m52s.jpg) |
| 08:03 | Description recoloured dark green, picker open | Tinted, lower-contrast body text | not kept |
| 09:05 | Uppercase bold tracked eyebrow over headline | Option B: stylistically distinct small label | [assets/frame_09m05s.jpg](assets/frame_09m05s.jpg) |
| 10:05 | Eyebrow as green filled badge with white text | Option C: container; even padding | [assets/frame_10m05s.jpg](assets/frame_10m05s.jpg) |
| 10:42 | Pale rounded badge with dark text | Option D: low-contrast container variant | not kept |
| 11:30 | Dark section, all text white Regular 16 | Baseline for heading + repeated columns | not kept |
| 12:18 | Section heading 40 bold, column titles Bold 20 | Three-tier result | [assets/frame_12m18s.jpg](assets/frame_12m18s.jpg) |
| 12:55 | Article page, everything Regular 16 | Baseline for long-form page | not kept |
| 13:19-13:31 | Title at 48 in Thin, then weight menu | Weight is a style choice once size leads | not kept |
| 14:56 | Bold 48 title, underlined dotted breadcrumb, bold grey date | Final article hierarchy | [assets/frame_14m56s.jpg](assets/frame_14m56s.jpg) |
| 15:20 | Date tinted teal, picker open | Scheme colour used as a differentiator | not kept |

## Practical rules for improving existing UIs

Derived from this video only. "Shown" values are examples from the demo, not thresholds stated by the presenter.

1. Audit text clusters by role: list the semantically different kinds of text that sit together; any two roles with identical styling is a defect. [01:53-02:23]
2. Do not rely on spacing alone to separate a label from its content. [02:23-02:46]
3. Decide the single most important element in each cluster first and give it the strongest treatment (size first). [06:07-06:21, 12:44-13:01]
4. Try the cheapest fix first: change only weight on labels/headings. Escalate only if roles still blur. [03:03-03:46]
5. Available levers, to be combined as needed: weight, size, colour/contrast, case, letter spacing, underline, container. Every additional property changed increases separation. [04:35-04:52, 08:19-09:55, 14:44-14:46]
6. Keep adjacent tiers clearly apart in size; a secondary heading that approaches the primary one competes with it. Shown working: 16/21/31; shown failing: 25 against 31. [07:09-07:42]
7. When a heading is enlarged, re-evaluate its weight; large text can be regular or light and still lead. [04:15-04:25, 13:08-13:25]
8. For a label above a headline, prefer a small, distinct eyebrow (uppercase, bold, widened tracking, tinted) over a slightly smaller copy of the headline style. Shown: 12-14 px, ~19% tracking. [08:33-09:12]
9. Do not shrink labels below readability. [09:12-09:19]
10. Demote body/description text with a tint of the background hue instead of pure black or neutral grey, staying within accessible contrast. [07:45-08:15]
11. On coloured backgrounds avoid neutral greys; pick a darker or lighter shade of the background's own hue. [09:40-09:47]
12. Bold or very large text tolerates lower contrast than regular small text; lighten in step with weight/size, not before. Shown: #666666 regular to ~#7D7D7D bold at 16 px. [14:42-14:56]
13. Badge or button text needs equal padding on all four sides. [09:55-10:12]
14. Links must look clickable: underline is the safe default; a filled container is the alternative. [13:47-14:07]
15. Make breadcrumbs read as breadcrumbs with an explicit separator between items. [13:27-13:39]
16. Metadata (dates etc.) should be visibly secondary via grey/opacity and optionally weight, but never below readable contrast. [14:25-14:42]
17. Use an existing brand/scheme colour on links or secondary elements as an extra differentiator on otherwise monochrome pages. [15:03-15:11]
18. In sections with a heading over repeated title+description items, aim for three tiers: section heading largest, item titles bold and slightly larger than body, descriptions quietest. Shown: 40/20/16. [11:39-12:35]
19. Compare variants side by side before choosing; several treatments can be valid and the choice is partly brand preference. [02:44-02:54, 06:40-06:55, 12:05-12:10]

## Uncertainty and limitations

- Transcript is YouTube auto-generated captions: unpunctuated, with mis-hearings (e.g. stray "i" tokens, "craft" for an inaudible word at 00:51). Paraphrases follow the clear sense; nothing here should be treated as a quotation.
- Frames are uniform samples every ~12 s, not scene-detected. Short intermediate states between samples may be missed; some were recovered with targeted crops, not all.
- Numeric values come from reading small inspector text in 720p video. Font sizes and weights are high confidence. Hex values are medium confidence (#697A84, #3D4F4A, #566B66, #6C817C, #289D81, #26323B, #666666) and low confidence for the final date teal (~#69C8D5) and the bold date grey (#7D7D7D vs #7E7E7E). Some size fields were captured mid-edit (18 vs 21 for the Example 2 sub-heading; 21 appears to be the kept value, inferred).
- Not captured: page/section background hex for Examples 1 and 2, the Example 3 description recolour hex, exact badge padding and corner radius, exact added gap under enlarged footer labels.
- Ratios (1 : 1.3 : 1.9 etc.) are my arithmetic on observed values; the presenter states no ratios or type scale.
- Rule 12's hex pair and rule 6's pass/fail sizes are observations from one demo each, not general thresholds. The presenter gives no numeric contrast targets; "accessibility" is mentioned only qualitatively [08:04, 14:39].
- At 05:16-05:23 the captions do not make clear which footer variant he likes least; the note is left generic.
- At 15:03-15:11 he speaks about applying scheme colour to links, but the layer visibly recoloured in the sampled frames is the date. Rule 17 reflects the spoken guidance.
- Line height (32 px on every layer, including 48 px titles) was never adjusted or discussed; the video offers no line-height guidance, and the demo values should not be copied.
- No coverage of responsive behaviour, font pairing, type scales, line length, dark-mode specifics, or real production sites; all four examples are synthetic Figma mock-ups.
- Sponsor segment [00:58-01:33] and outro [15:22-16:09] contain no design instruction and were excluded.
- The creator's written tutorial linked in the description was not consulted, so nothing here is cross-checked against it.
