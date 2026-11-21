# Extraction: "STOP Doing THIS to your Designs! (BORDERS)"

Original structured notes on the design principles taught in one video. Paraphrased; not a transcript. Attribution to the creator is for sourcing only and implies no endorsement of these notes or of anything built from them.

## Source

| Field | Value |
|---|---|
| Title | STOP Doing THIS to your Designs! (BORDERS) |
| Channel | DesignCourse (presenter: Gary Simon) |
| URL | https://www.youtube.com/watch?v=Mv8Pjtvujno |
| Video ID | Mv8Pjtvujno |
| Duration | 18:35 (1114.7 s) |
| Publish date | 2020-08-07 (yt-dlp `upload_date`) |
| Source resolution | 1280x720 |
| Date of extraction | 2026-11-20 |

Creator-supplied chapters (from the video description):

| Start | Chapter |
|---|---|
| 0:00 | Introduction (includes sponsor read, approx. 01:04-02:01) |
| 2:06 | Bad borders with improvements |
| 12:57 | Good border examples |
| 18:04 | Outro |

## Access record

| Item | Result |
|---|---|
| `watch:watch` skill usable | Yes, with one workaround (below). Plugin `watch@claude-watch` 0.2.0; preflight `setup.py --check` exit 0 |
| Download | yt-dlp succeeded (video + audio + metadata + captions) |
| Transcript | Available. **Method: YouTube auto-generated English captions** (no manual subtitle track exists; `automatic_captions.en` used). 566 caption segments |
| Whisper | Not used for the transcript. The local Whisper endpoint (`WATCH_WHISPER_ENDPOINT`, a link-local address) timed out (4 attempts) during the skill's optional 0-10 s "hook microscope" pass; a direct health check also timed out. No impact on the main transcript |
| Frames (skill) | **80 frames**, uniform sampling, 1 every ~13.9 s, 512 px wide, all 80 viewed |
| Frames (extra) | 19 additional full-resolution (1280 px) stills pulled with ffmpeg from the skill's downloaded file at specific moments; 16 viewed. 8 copied to `assets/` |
| Hook frames | 20 frames at 2 fps for 0-10 s were produced by the skill; not reviewed (talking-head intro, no instructional content) |

What failed or was skipped:

- **Scene-change frame extraction failed** on first run: the skill's `frames.py` passes `-vsync vfr`, which the installed ffmpeg 9.0.2 rejects ("Unrecognized option 'vsync'"). The run aborted with zero frames. Re-ran with the skill's own `--no-scene-change` flag (uniform sampling), which worked. The plugin was not modified.
- Consequence: no scene-change data, so no pacing metrics, and brief slide flips between sampled frames may be missed.
- Whisper endpoint unreachable (see above); word-level hook transcript not produced.
- Skill steps 4.4/4.5 (Obsidian staging/ingest) skipped: no vault detected and ingest was out of scope. The skill's `report.md` narrative markers were left unfilled for the same reason.
- Raw working files (video, captions, frame dumps, `report.md`) remain in the session scratch directory, not in this output directory.

## Timestamped findings

Timestamps are caption timestamps (mm:ss), accurate to a few seconds.

### Framing

- [00:14-00:22] The problem addressed is overuse of borders, a pattern the presenter says he sees repeatedly in submitted designs.
- [00:39-00:51] Borders are not banned. They can add to a design when used correctly and in a "modern context".
- [00:23-00:37], [00:53-01:02] Structure: three viewer-submitted designs are reworked step by step with borders removed, then a set of Dribbble shots shows borders used well.

### Example 1: resume/CV template [02:02-05:27]

- [02:15-02:28] Diagnosis: a thick rule sits under every section heading, at the highest possible contrast (pure black on pure white).
- [02:28-02:35] A second border type (dashed) separates every item within a section.
- [02:35-02:46] The sections already have little white space between them, so adding lines on top increases clutter rather than clarity.
- [02:53-03:27] Step 1: delete the heading underlines. The bold heading already establishes that the content beneath belongs to it; visual hierarchy does the grouping, so the rule is redundant.
- [03:27-03:49] Step 2: delete the dashed item separators. The white space between repeated items already signals they are distinct.
- [03:49-04:09] Principle: if something already communicates separation, a second signal is clutter that pulls attention from the content, which here is type and is the thing that matters.
- [04:09-04:26] Removing lines is not enough by itself: sections still run together because vertical gaps between them are small.
- [04:26-05:11] Step 3: increase the white space between sections so each heading-plus-content block is easy to scan.
- [05:11-05:25] Flipping between first and last versions shows the result is cleaner and easier to read.

### Example 2: text-to-voice-over tool [05:29-08:30]

- [05:42-05:50] Diagnosis: the main container has a border. It is light, but it is still a border.
- [05:50-05:56] The textarea has a darker border.
- [05:56-06:05] The play/stop/download buttons have thick, bold ring borders and are far too large.
- [06:05-06:11] The dropdown selects have borders that are not needed.
- [06:17-06:40] Step 1: replace the container's border with a slightly darker background fill. Reason given: once the border goes, a near-white container would be hard to distinguish from the page, so the fill takes over the job of defining the container.
- [06:41-06:53] Step 2: action buttons get no border at all.
- [06:53-07:19] Thick borders combined with a gloss effect add clutter and make the UI look dated; avoid styles that were clearly short-lived trends.
- [07:20-07:27] Self-correction: the first pass of the new buttons was too desaturated/low contrast, so contrast was raised.
- [07:28-07:41] Step 3: dropdowns rebuilt without borders, still clearly recognizable as dropdowns, with good spacing between them.
- [07:41-07:50] The controls now span the available width; in the original they were clumped together with centered labels.
- [08:10-08:22] Borders were not the only problem: element scale, white space and alignment were also fixed.
- [08:22-08:31] Of all the issues, the borders contributed most to the clutter and to the amateur look.

### Example 3: landing-page hero [08:33-12:26]

- [08:36-08:50] What works and is kept: the colour scheme, the header, the font. Noted issue: uneven white space.
- [08:53-09:03] Diagnosis: thick borders run all over the hero, including a frame extending from the illustration.
- [09:03-09:14] Each of the two buttons carries three nested borders, so six borders sit close together, all bold and in different colours.
- [09:14-09:30] Goal of the rework: keep as much of the original design and illustration as possible and improve mainly by removing borders.
- [09:45-09:56] The headline is given "room to breathe": generous white space and no other elements near it.
- [09:56-10:09] Elements may sit near or behind type only if they are very low contrast ("watermark" level).
- [10:09-10:30] Do not place high-contrast elements near, behind or on top of important type such as a headline; it hurts legibility and makes the headline harder to find because attention goes elsewhere.
- [10:30-10:40] Common failure: text over a photo background without enough contrast between the text and the image.
- [10:40-10:50] Black text on a white background is the maximum contrast case and is easy to read.
- [10:55-11:16] The original buttons were also far too large (scale issue, same as example 2).
- [11:16-11:45] The primary button has no border. The secondary button keeps a border, and this is called a good use: it is low contrast and does not distract.
- [11:45-12:05] The eye goes to the secondary button's label first, the outline still reads as a button, and it carries the button style across from the primary in a subtle way.
- [12:17-12:26] Result: easier to read and use, and less amateur-looking.

### Good uses of borders (Dribbble shots) [12:57-18:04]

- [12:37-12:55] There are several legitimate use cases for lines; the skill is knowing how to apply them.
- [13:10-13:30] Decorative grid lines across a hero: work because they are very thin and very low contrast.
- [13:30-13:50] The same lines thick (he suggests around 10 px) and pure white would look wrong. If a border is used decoratively, it should read almost like a watermark.
- [13:53-14:20] A thin line beside buttons: fine because the page is not using borders everywhere, there is a lot of white space, and the other fundamentals are solid.
- [14:21-14:50] A short vertical bar beside an indented sentence or paragraph, used to pull focus to it. A few pixels wide, in a secondary colour.
- [14:50-15:15] Menus, vertical or horizontal: a desaturated line runs the length of the menu and the current item is highlighted on it.
- [15:15-15:27] That is minimal usage. Boxing each menu item would be far too much. With borders, minimal is best.
- [15:40-16:00] A small line separating a heading from the content that follows; described as a modern pattern with many variants.
- [16:02-16:22] A heavier example: a frame around the top section, an underline under a "learn more" link, and a divider between two text blocks. Still effective because it is not overdone.
- [16:22-16:40] It also works because typography, white space, colour and contrast are all handled well.
- [16:44-17:00] Another heading accent: a line to the left of the heading instead of beneath it.
- [17:05-17:20] Dashboard: a light border works because it is 1 px and very low contrast.
- [17:20-17:35] An indicator for the current navigation item can be thicker and use the primary colour.
- [17:35-17:50] Tables: thin row separators are allowed but optional, and must be very low contrast.
- [17:50-18:07] Second dashboard: low-contrast, thin list separators; the selected item is higher contrast, thicker and in the primary colour.

## Concrete design guidance

The presenter states few numeric values. Stated values are marked **stated**; everything else is an observation from frames, with sizes **estimated** from 1280x720 stills of slides shown at unknown zoom. Treat estimates as relative, not as CSS values.

### Values and thresholds

| Topic | Guidance | Basis | Time |
|---|---|---|---|
| Border thickness, acceptable | 1 px for container/card/table lines | stated | 17:13 |
| Border thickness, accent bar | "two or three or four pixels" for a vertical bar beside a text block | stated | 14:38 |
| Border thickness, bad | ~10 px at 100% white given as an example of what would look wrong | stated | 13:36 |
| Contrast, bad | 100% black rule on 100% white page | stated | 02:25 |
| Contrast, good | Very low contrast, "almost like a watermark" | stated | 13:44 |
| Active-state indicator | May be thicker, higher contrast, primary colour | stated | 17:25, 18:00 |
| Border density, bad | Three nested borders per button, six in close proximity, multiple colours | stated | 09:03 |
| Menu rail colour | Desaturated line; current item highlighted | stated | 15:03 |

### Alternatives to borders (techniques demonstrated)

| Instead of | Use | Before (frame) | After (frame) | Time |
|---|---|---|---|---|
| Rule under each section heading | Heading weight/size alone (visual hierarchy) | Heavy black rules, roughly 3 px, spanning each column under bold all-caps headings | Headings stand alone; grouping still obvious | 02:53-03:27 |
| Dashed dividers between list items | White space between items | Light grey dashed lines between every entry | No dividers; items still read as separate | 03:27-03:49 |
| Lines to separate sections | Larger vertical gaps between sections | Gap above a heading only slightly bigger than gaps between items | Gap above a heading several times the item gap (estimated at roughly 2x the original section gap); whole layout scaled down to fit | 04:26-05:11 |
| Light outline around a container | Background fill slightly darker than the page | Near-white panel with a hairline grey outline | Pale grey-lavender filled panel, rounded corners, no outline | 06:17-06:40 |
| Dark outline around a textarea | White field sitting on the tinted container | Grey 1 px outline on a white field over a near-white panel | Borderless white field; edge defined purely by fill contrast with the panel | 06:17-06:40 (frame 07:27) |
| Thick ring + gloss on icon buttons | Flat solid-fill shapes, no border | Three large glossy circles with thick dark rings and drop shadows (each roughly 4x the height of a select) | Three small flat dark-grey circles with white glyphs, evenly spaced | 06:41-07:27 |
| Outlined native selects | Borderless white fields on a darker footer band, with a caret | Four small outlined selects clumped at centre, centred labels | Four equal-width white fields spread across the full panel width, left-aligned labels above, on a distinct darker strip | 07:28-07:50 |
| Triple-outlined black buttons | One filled primary + one thin-outline secondary | Two stacked black buttons, each with white, purple and tan concentric borders | Side-by-side pair: solid magenta primary with white label; white secondary with thin grey outline and dark label; both much smaller | 10:55-12:05 |
| Decorative frame lines around hero and headline | Open white space around the headline | Thick purple/magenta frame lines crossing the hero, wrapping the headline and illustration; tan bar under the nav | All frame lines gone; headline in a clean sans, left-aligned, on plain white with wide margins; illustration retained | 09:14-10:50 |

### Supporting non-border fixes shown

- Scale: oversized buttons reduced substantially in both example 2 and example 3. [08:10], [10:55-11:16]
- Alignment and distribution: controls spread to fill the container width instead of clumping at centre. [07:41-07:50]
- Contrast check after simplifying: a first pass that was too washed out was corrected. [07:20-07:27]
- Typeface: the hero headline also changed from a wide display face to a plainer sans in the "after". This is visible in frames but not discussed. [frames 08:36 vs 11:23]

### Where borders are appropriate (patterns shown)

| Pattern | Treatment observed | Time |
|---|---|---|
| Decorative grid/guide lines over a hero | Hairline, semi-transparent white over a blue image; barely visible | 13:10-13:50 |
| Accent bar beside a lead paragraph | Short vertical line left of a 3-line paragraph, teal on a dark gradient, same height as the text block | 14:21-14:50 |
| Vertical menu rail | Faint vertical line left of a list; current item marked with a brighter, slightly thicker segment and brighter text; other items dimmed | 14:50-15:25 |
| Heading accent line | Short line under or beside a heading | 15:40-16:00, 16:44-17:00 |
| Thin page/section frame | Hairline tan frame inset in a dark hero; short underline under a text link; hairline vertical divider between two numbered text blocks | 16:02-16:40 |
| Tab indicator | Coloured underline under the active tab only; inactive tabs have none; faint hairline under the tab row | 17:20-17:35 |
| Cards on a tinted surface | White cards on very light grey with barely visible edges | 17:05-17:20 |
| Table/list row separators | Faint hairlines between rows | 17:35-18:07 |
| Selected list row | Coloured vertical bar at the left edge of the selected row; other rows separated by faint hairlines | 17:50-18:07 |
| Secondary (ghost) button | Thin, low-contrast outline; label is the darkest element | 11:16-12:05 |

## Key frames

Times are frame capture times. "512" frames are from the skill's uniform pass; "full" frames are 1280 px stills. Files exist only for rows with a link.

| Time | Res | Shows | Why it matters | Asset |
|---|---|---|---|---|
| 02:05 | full | Resume template "before": heavy black rule under every heading, dashed dividers between items, tight spacing | Baseline for redundant-separator critique | [01](assets/01_0205_resume_before.jpg) |
| 03:29 | 512 | Heading rules removed, dashed dividers still present | Isolates the effect of step 1 | - |
| 04:11 | full | All rules and dividers removed, original spacing | Shows lines were not needed, and that spacing is still too tight | - |
| 05:20 | full | Final resume: no lines, much larger gaps between sections | The "after": white space replaces borders | [02](assets/02_0520_resume_after.jpg) |
| 05:34 | full | Voice-over tool "before": outlined panel, outlined textarea, three large glossy ringed buttons, outlined selects | Baseline: four different border treatments in one small panel | [03](assets/03_0534_voiceapp_before.jpg) |
| 06:30 | 512 | Empty tinted rounded container with a borderless white field | Fill contrast replacing container and input borders | - |
| 07:27 | full | Container + three small flat borderless buttons | Border and gloss removal on actions; scale fix | - |
| 07:40 | full | Final voice-over tool: adds a darker footer band with four evenly spread borderless select fields | The "after": grouping by surface colour and spacing | [04](assets/04_0740_voiceapp_after.jpg) |
| 08:36 | full | Hero "before": purple/magenta frame lines, two black buttons each with triple concentric borders | Baseline for border density and competing colours | [05](assets/05_0836_hero_before.jpg) |
| 09:59 | 512 | Headline alone on white beside the illustration, no lines | Headline "room to breathe" | - |
| 11:23 | full | Final hero: filled primary button + thin-outline secondary button, clean headline | The "after"; also the sanctioned ghost-button border | [06](assets/06_1123_hero_after.jpg) |
| 13:14 | full | Fashion landing concept with hairline translucent grid lines | Decorative borders at watermark contrast | - |
| 14:24 | full | Gradient hero with a short vertical accent bar beside the lead paragraph | Accent bar to draw focus to a text block | - |
| 14:52 | full | Dark feature section with a vertical menu rail and highlighted current item | Minimal menu indicator instead of boxed items | [07](assets/07_1452_vertical_menu_rail.jpg) |
| 16:15 | full | Dark hero with hairline frame, link underline, divider between two blocks | Heavier border use that still works | - |
| 16:57 | full | Agency page with a line to the left of a heading | Heading accent variant | - |
| 17:39 | full | Payroll dashboard: active-tab underline in accent colour, near-invisible card edges | 1 px low-contrast containers; thicker coloured active indicator | [08](assets/08_1739_dashboard_tabs_cards.jpg) |
| 18:07 | full | Dark time-off flow: selected row with coloured left bar, faint row separators | Selected state vs resting separators | - |

## Practical rules for improving existing UIs

Derived from this video only. Each rule cites where it is taught or shown.

1. **Audit every border and ask what it is doing.** If hierarchy, spacing or a fill already communicates the same grouping or separation, delete the border. [03:05-03:27], [03:49-04:09]
2. **Do not underline section headings with heavy rules.** A clearly heavier/larger heading already owns the content beneath it. [02:53-03:27]
3. **Separate repeated items with space, not divider lines.** [03:27-03:49]
4. **After removing lines, increase spacing between groups.** Gaps between sections must be clearly larger than gaps within a section, or sections run together. [04:09-05:11]
5. **Never add borders to a layout that is already tight.** Lines in cramped layouts compound clutter. [02:35-02:46]
6. **Avoid maximum-contrast structural lines** (pure black on white, or the reverse). [02:22-02:28], [13:30-13:44]
7. **Define containers with a background fill instead of an outline.** When removing a container's border, shift its fill far enough from the page colour to stay distinguishable. [06:17-06:40]
8. **Let inputs be defined by fill contrast against their container** rather than by a dark outline. [05:50-05:56], [06:17-06:40], frame 07:27
9. **Primary/action buttons: solid fill, no border.** [06:41-06:53], [11:16-11:20]
10. **Never stack multiple borders on one element,** and never in multiple colours. [09:03-09:14]
11. **Remove dated surface effects along with heavy borders** (gloss, heavy rings). [06:53-07:19]
12. **A secondary button may use an outline** if it is thin and low contrast so the label, not the outline, draws the eye. [11:16-12:05]
13. **When a border stays, make it thin and low contrast:** 1 px for containers and table lines, near-watermark for decorative lines. [13:10-13:50], [17:05-17:20]
14. **Reserve thicker, higher-contrast, primary-coloured lines for state:** the current nav item, active tab or selected row. [17:20-17:35], [17:50-18:07]
15. **Menus: one faint rail plus a highlight on the current item.** Do not box each item. [14:50-15:25]
16. **Tables: row separators are optional; if used, keep them very low contrast.** [17:35-17:50]
17. **A short accent bar (2-4 px) beside a paragraph or a small line by a heading is an acceptable emphasis device,** used sparingly and in a secondary colour. [14:21-14:50], [15:40-16:00], [16:44-17:00]
18. **Keep border count low across the page.** Individually fine lines become a problem when they appear everywhere. [14:05-14:20], [15:15-15:27], [16:15-16:25]
19. **Give headlines clear space.** No high-contrast shapes, lines or imagery near, behind or over them; anything nearby must be very low contrast. [09:45-10:30]
20. **Ensure strong contrast between text and whatever is behind it,** especially over photos. [10:30-10:50]
21. **After stripping borders and effects, re-check contrast.** Simplified controls can end up too washed out. [07:20-07:27]
22. **Fix scale, spacing and alignment in the same pass.** Oversized controls and clumped layouts usually accompany border overuse; removing borders alone does not finish the job. [08:10-08:31], [10:55-11:16], [07:41-07:50]
23. **Preserve what works when reworking a design** (colour scheme, header, illustration); change the minimum needed. [08:36-08:50], [09:14-09:30]
24. **Borders only succeed on top of sound fundamentals** (typography, white space, colour, contrast). Do not rely on lines to rescue a weak layout. [14:10-14:20], [16:22-16:40]

## Uncertainty and limitations

- **Transcript quality.** Auto-generated captions, lowercase and unpunctuated, with recognition errors ("topography" for typography, "trans" for trends, "lenode"). Paraphrases reflect my reading of intent. No human-verified transcript was available and Whisper was unreachable for a cross-check.
- **Frame coverage is sparse.** One frame per ~13.9 s over 18.5 minutes, plus targeted stills. Scene-change sampling failed, so quick slide flips and intermediate build steps between samples may be unobserved.
- **Pixel sizes and ratios are estimates.** All "observed" thicknesses, gap ratios and size comparisons come from 720p stills of slides or browser pages at unknown zoom. The only numeric values the presenter states are: 1 px, "two or three or four pixels", ~10 px (bad example), and 100% black/white. No hex colours, opacity values or spacing units are given anywhere in the video.
- **No opacity values are taught.** "Low contrast" and "watermark" are qualitative; any translation to opacity or colour tokens is the implementer's inference.
- **Two good examples were poorly captured visually.** The shot discussed at 13:53-14:20 (line beside buttons) was mid-animation or loading in every sampled frame (flat colour blocks at 14:10 and 14:24 in the 512 pass); the footer-cards shot at 15:40-16:00 did not show the heading line clearly at sampled moments. Notes for those two rely on narration only.
- **Unremarked changes in the "after" slides.** The typeface change in the hero rework, rounded corners on the new container, left-aligned labels and the duplicated placeholder labels ("Voice Actor" x4, "Find Makers" x2) are visible but not discussed; the presenter acknowledges not updating the second button's text [11:25]. The reworks are quick mockups, not finished designs.
- **Item skipped by the presenter.** One Dribbble link (opened around 15:27) is dismissed as not a UI design; nothing extracted.
- **Parts not covered.** Sponsor read (approx. 01:04-02:01) and outro (18:07 onward) contain no design instruction. Dark mode, focus rings, form-field affordance, accessibility contrast ratios and responsive behaviour are not addressed by the video; rule 8 in particular (borderless inputs) is shown without discussion of accessibility trade-offs.
- **Age.** Published 2020; "modern" refers to trends of that time.
- **Third-party designs.** The reworked designs are viewer submissions and the good examples are Dribbble shots by other designers (links in the video description). Frames in `assets/` are low-count reference stills for analysis, not for redistribution.
