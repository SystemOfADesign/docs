# Extraction: designing a content-heavy layout (DesignCourse)

Original paraphrased notes. Not a transcript, not endorsed by or affiliated with the creator. All timestamps are `[mm:ss]` in the source video.

## Source

| Field | Value |
|---|---|
| Title | How do you Design a Layout with a TON of Content?! |
| Channel | DesignCourse (presenter: Gary Simon) |
| URL | https://www.youtube.com/watch?v=sfkF8aBT4dw |
| Video ID | sfkF8aBT4dw |
| Duration | 40:49 (2448.7 s) |
| Publish date | 2020-05-13 (yt-dlp `upload_date`) |
| Extraction date | 2026-11-20 |
| Format | Unscripted live design session in Adobe XD; dark, text-only news-style homepage built from scratch on a 1920-wide artboard |

Creator-supplied chapters (from metadata): Intro 00:00, Sponsor 00:48, Using Fontjoy 01:26, UI Design Fundamentals 04:22, Designing the Homepage 07:31, Adding Content 12:18, Adding Context 16:50, Duplicating Titles 21:03, Testing the Layout 23:06, Adding More Content 24:39, White Space 30:21, More Content 32:23.

## Access record

| Item | Result |
|---|---|
| Watch skill (`watch:watch` 0.2.0) usable | Yes, with two workarounds (below) |
| Preflight (`setup.py --check`) | Exit 0 |
| Transcript | Obtained. Method: **YouTube auto-generated English captions** pulled by the skill's yt-dlp step (`video.en.vtt`). No manual captions exist for this video |
| Whisper | **Failed.** Local Spark endpoint timed out on every attempt (hook pass and full pass). Not used; no cloud fallback attempted |
| Frames | **80** uniform frames, 768 px wide, one per ~30.6 s, covering 00:00 to 40:18. About 45 were inspected directly. Plus 11 targeted 1280 px frames pulled with ffmpeg from the downloaded video at specific timestamps |
| Assets kept | 8 frames in `assets/` (1280 px wide) |

What failed, and what was done:

1. First run: video stream download returned HTTP 403 (captions and metadata had already downloaded). A direct yt-dlp retry with the same format selector succeeded, so this was transient.
2. Second run: the skill's scene-change frame extraction failed because the installed ffmpeg (9.0.2) no longer accepts the `-vsync` option the script passes. Reran with `--no-scene-change` (uniform sampling). Consequence: no per-shot frames and no pacing metrics.
3. Third run was on the local file, so the skill did not see the captions and tried Whisper, which timed out. The skill's own report therefore says "no transcript"; the captions from run 1 were parsed separately and are the transcript used here.
4. Skipped by instruction: the skill's `report.md` narrative fill, Obsidian staging and ingest.

Raw working files (video, captions, frames, logs) remain in the session scratchpad, not in this directory.

## Timestamped findings

Paraphrased. Sponsor and tool-fiddling segments are omitted.

**Setup and typography**

- [01:26-03:00] Uses fontjoy.com to generate a three-font pairing; its slider controls how much the fonts contrast, and individual fonts can be locked while regenerating the others. Chosen set: Archivo Narrow (condensed sans, headlines), Junge and Martel (serifs, supporting and body text).
- [03:00-04:00] Picks a dark scheme and makes the artboard taller. Plans to add text progressively and try 2, 3 and 4 column arrangements.
- [08:45-10:00] Two of the three fonts look near-identical at similar sizes, so the third font is dropped for that role. Instead the same serif is reused at a smaller size. Point made: tiers of text must be clearly separated; a different font alone does not separate them.

**Fundamentals named as the ones that matter for content-heavy pages**

- [04:30-05:10] Of the roughly seven or eight UI fundamentals, white space and scale are the two that most determine the structure of a text-heavy layout.
- [05:10-05:50] Visual hierarchy is the third. Start by choosing the single most important piece of content and make it larger than the rest. But do not hand it too much space, because the rest of the content still has to fit.
- [38:05-38:30] Closing list: rows versus columns, contrast, scale, white space and visual hierarchy are what keep a type-heavy page cohesive.

**Hero block**

- [06:00-06:30] Headline is placed on a deliberate left alignment line shared with the logo.
- [07:30-07:50] With only a logo, a nav and one headline block, the page already looks composed. The presenter attributes this to alignment, scale and spacing rather than to the amount of decoration.
- [08:10-08:40] On a homepage, show an excerpt and not the full story. The four-line excerpt is cut to two lines and line height is increased slightly.
- [10:00-11:15] Hero becomes three tiers: headline, a one-line sub-headline, and a small muted excerpt. More line height and spacing are added to separate the tiers further.
- [11:20-12:10] Runs a contrast checker (Stark plugin) on the muted excerpt. Passing result is about 6.6:1. Demonstrates a darker grey that fails at 3.19:1, and states normal text should not go under 4.5:1 (WCAG AA). Calls low-contrast text a common mistake.

**Secondary column of links**

- [12:30-13:30] Adds a right-hand column for items that are secondary in importance: a long list of short headline links.
- [14:00-14:20] Getting the sizes of everything right relative to each other gets harder as the number of text elements grows.
- [14:30-16:20] Each link gets a thin border underneath as a divider; the default mid-grey is kept because it is subtle enough. The list is built with a repeating grid so spacing stays uniform. Varies the placeholder text by hand because identical repeated text hides how the layout really behaves.

**Middle zone: two columns of story cards**

- [16:30-18:00] Fills the area under the hero with two columns. Explicit ranking stated: hero is most important (most scale and its own area), the two-column stories are next, the link list is below those.
- [19:00-20:30] Tries a large faint decorative initial letter behind the paragraphs. Is unsure of it, notes it may be awkward to build in HTML and CSS, and later removes it [24:30-24:40].
- [20:30-21:00] Diagnoses the problem: the card titles and the hero text are too close in weight and size, so hierarchy between zones is weak.
- [22:00-23:00] Fix attempt: enlarge the hero. Side effect noted: enlarging one tier reduces its separation from the tier next to it, so adjacent tiers have to be scaled up together.
- [23:00-24:10] Second fix: put the lower zone on a slightly lighter background band and give the link column its own panel colour. Now the zones read as separate without needing more space.
- [24:10-24:30] Tightens gaps between elements: with a lot of content, large gaps between elements are not affordable.
- [21:30-21:50] Deliberately gives sibling titles different text lengths so the test is realistic.

**Subscribe form and card clean-up**

- [25:40-27:10] Adds a subscribe prompt with an email field and button under the cards. The prompt text acts as both heading and label. Keeps it small and close to the content above.
- [27:30-28:50] Very subtle corner rounding on the field and button; stays within a monochrome palette; button text is bold dark on a light fill.
- [28:50-29:40] Judges the cards to have too much body text. Shortens each excerpt and adds a simple "Read more" link with an arrow to each card.

**White space audit**

- [30:20-31:10] Checks alignment and spacing across the page. Draws a rectangle to measure the gap above one block and compares it with the equivalent gap elsewhere. Finds a small mismatch and corrects it. Small spacing differences are said to have a large effect on the overall impression.
- [31:10-31:30] Each group of content should read as its own block, with white space between blocks.
- [31:30-32:00] The amount of white space depends on how much content each section has to hold: more required content means less white space available, but what remains must still be applied consistently.

**Bottom zone: four columns of older items**

- [32:40-33:40] Adds a fourth zone with a section heading and four columns. Uses the repeat grid first to find the column width and gutter, then sizes the content to fit.
- [35:00-36:00] First version gives every item a thumbnail. With four columns and many rows, the presenter rejects it as too much.
- [36:00-36:50] Replaces it with plain links: a two-line title plus a small date line in a slightly different, quieter colour.
- [36:50-37:50] Separates the four columns with vertical rules rather than the horizontal rules used in the sidebar list.

**Recap**

- [38:30-39:30] Walks the finished page: the eye goes to the largest type first; the distinct grey container marks the secondary stories; the link panel is a step below; the bottom grid holds the least important or oldest items. The ranking is visible without reading anything.

## Concrete design guidance

Values are read from the XD property panel in frames unless marked "spoken". Where a value is uncertain it is flagged in the last section.

| Topic | What was shown | Time |
|---|---|---|
| Canvas | Desktop artboard labelled "Web 1920"; content sits in a centred column with wide side margins | [04:00] frame |
| Type roles | Condensed sans for all headlines and link titles; serif for sub-headline, excerpts and dates. Two families in practice, three tiers of size | [09:00-10:00] |
| Hero excerpt, before | Serif 24 px with 29 px line height (about 1.2), full white, four lines. Dense and competes with the headline | [07:51] frame |
| Hero excerpt, after | Cut to two lines, set smaller, muted grey, more line height, with a larger one-line serif sub-headline between it and the headline | [08:30-11:15], [11:50] frame |
| Contrast floor | 4.5:1 minimum for normal text. Shown passing at 6.6:1; a darker grey failed at 3.19:1 | [11:20-12:10] spoken and frame |
| Muted text | Muted grey is used for de-emphasis but only down to the level that still passes the contrast check | [11:50] |
| Dense link list | Two-line condensed titles separated by 1 px mid-grey rules, uniform row spacing from a repeating grid, list column about 447 px wide on the 1920 canvas | [14:30-16:20], [16:12] frame |
| Zone separation by tone | Page background, a slightly lighter band for the second zone, a darker panel for the link column. Differences are small steps of the same neutral | [23:00-24:10], [24:06] frame |
| Overlapping panel | The link panel straddles the boundary between the hero band and the lower band, tying the two together | [24:06], [38:50] frames |
| Card anatomy | Two-line title, short muted serif excerpt of about five lines, text link with arrow. No image, no box, no border | [29:00-30:00], [30:40] frame |
| Card grid | 2 columns x 2 rows in the middle zone, sharing the hero's left edge | [29:40] frame |
| Bottom grid | 4 columns x about 7 rows of title plus date, 1 px vertical rules between columns, no horizontal rules | [37:50] frame |
| Small metadata | Date line set small (about 19 px on the 1920 canvas, spoken) in a quieter colour than the title | [36:30-36:50] |
| Divider choice | Horizontal rules for a single-column stack; vertical rules for side-by-side columns. Not both at once | [14:30], [36:50] |
| Corner radius | Barely visible rounding on input and button | [27:30] |
| Form | One line of prompt text, one input, one button, on a single row, placed directly under the cards | [26:00-28:50] |

Before and after observations from frames:

- **Hero** [07:51 vs 11:50]: before, a headline with a tight four-line white paragraph directly under it; after, three clearly different tiers (large condensed headline, mid serif line, small grey excerpt) with more air between them. Less text, more legible ranking.
- **Zones** [18:50 vs 24:06]: before, hero, cards and link list all sit on one flat dark background and the card titles compete with the hero; after, tonal bands and a panel make three regions visible at a glance with no change in spacing.
- **Cards** [24:06 vs 30:40]: before, longer excerpts with a faint decorative initial behind them; after, shorter excerpts, the decoration removed, and a "Read more" link added. The cards look lighter and have a clear action.
- **Bottom grid** [35:46 vs 37:50]: before, a thumbnail above every title across four columns and several rows, which reads as a heavy checkerboard; after, text-only title and date pairs with thin vertical rules, which holds 28 items calmly.

## Key frames

| Time | Asset | Shows | Why it matters |
|---|---|---|---|
| 07:51 | [assets/07m51s-hero-dense-excerpt-before.jpg](assets/07m51s-hero-dense-excerpt-before.jpg) | Hero with headline and a tight four-line white excerpt (24 px / 29 px) | The "before" state: too much excerpt text, too little tier separation |
| 11:50 | [assets/11m50s-contrast-check-pass.jpg](assets/11m50s-contrast-check-pass.jpg) | Three-tier hero with contrast plugin reporting 6.6:1, AA passing | Shows muted text being verified, not guessed |
| 16:12 | [assets/16m12s-sidebar-link-list-dividers.jpg](assets/16m12s-sidebar-link-list-dividers.jpg) | Right column of two-line links with thin rules beneath each | Pattern for packing many secondary items into a narrow column |
| 24:06 | [assets/24m06s-tonal-bands-zones.jpg](assets/24m06s-tonal-bands-zones.jpg) | Lighter band under the hero, panel behind the link list, two card columns | Zones separated by background tone when space is scarce |
| 30:40 | [assets/30m40s-block-spacing-alignment.jpg](assets/30m40s-block-spacing-alignment.jpg) | Zoomed view of band edge, card titles, excerpts, "Read more" links | Card anatomy and the gap being audited for consistency |
| 35:46 | [assets/35m46s-thumbnail-grid-rejected.jpg](assets/35m46s-thumbnail-grid-rejected.jpg) | Four-column grid with a thumbnail on every item | The rejected, over-heavy version of the low-priority zone |
| 37:50 | [assets/37m50s-four-column-link-grid.jpg](assets/37m50s-four-column-link-grid.jpg) | Four columns of title plus date with vertical rules | The replacement: text-only, highest density, lowest emphasis |
| 38:50 | [assets/38m50s-final-layout-overview.jpg](assets/38m50s-final-layout-overview.jpg) | Whole page: hero, card zone with form, link panel, start of bottom grid | Final hierarchy across four zones in one view |

Other frames inspected but not kept: empty artboard with logo and nav [04:35]; headline placed on the left alignment line [06:07]; hero font comparison [09:10]; failing contrast state with picker open [11:44]; link list before spacing clean-up [14:47]; first card added [17:51]; decorative initial experiment [19:23]; two cards on a flat background [22:57]; form being built [25:59-28:02]; full-page zoom-outs [29:02, 32:05, 38:15].

## Practical rules for improving existing UIs

Each rule is derived only from this video.

1. **Rank the content before touching layout.** Name the single most important item, then tier everything else. Every later decision follows that ranking. [05:10-05:50], [17:40-18:00]
2. **Make the top item the largest, but cap its footprint.** On a dense page the hero gets more scale and its own area, not half the screen. [05:30-05:50]
3. **Show excerpts, not full content, on overview pages.** If a block feels heavy, shorten the text first. [08:10-08:40], [28:50-29:10]
4. **Give each block at most three text tiers with obvious size steps.** If two tiers look alike, change size or colour; swapping to a similar font does not help. [08:45-10:00]
5. **Scale adjacent tiers together.** Enlarging one tier shrinks its difference from its neighbour; re-check the pair. [22:20-22:50]
6. **De-emphasise with muted colour, then verify contrast.** Keep normal text at 4.5:1 or higher. [11:20-12:10]
7. **Raise line height slightly on small body text** when tiers feel cramped. [08:30], [11:00]
8. **Put secondary items in a narrow list column.** Short titles, uniform row spacing, thin low-contrast rules between rows. [12:30-16:20]
9. **Separate zones with small background tone shifts when you cannot afford more white space.** A band or panel does the job of a large gap. [23:00-24:10], [38:40-39:00]
10. **Spend white space between groups, not inside them.** Keep within-group gaps tight so each group reads as one block. [24:10-24:30], [31:10-31:30]
11. **Budget white space by content load.** More required content means smaller gaps, applied consistently. [31:30-32:00]
12. **Audit equivalent gaps for equality.** Measure the space above and between comparable blocks and fix small mismatches. [30:20-31:10]
13. **Hold a small number of left alignment lines** and snap headings, text and controls to them. [06:00-06:30], [30:20]
14. **Strip the lowest-priority zone down to text.** Title plus one quiet metadata line; drop thumbnails when item count is high. [35:40-36:50]
15. **Increase column count as importance drops.** One hero, two story columns, four columns of minor links. [16:50-17:20], [32:40-33:10]
16. **Use one divider direction per group.** Horizontal rules for stacked rows, vertical rules for parallel columns. [14:30], [36:50-37:50]
17. **Derive column width from the grid first, then fit content to it.** [33:00-33:40]
18. **Give every card one small, consistent action.** A text link with an arrow is enough. [29:10-29:40]
19. **Test with realistic, varied text lengths.** Identical placeholder strings hide wrapping and rhythm problems. [14:50-15:50], [21:30-21:50]
20. **Remove decoration that does not strengthen hierarchy** or that would be awkward to implement. [19:00-20:30], [24:30]
21. **Keep the palette and radii restrained** on text-dense pages; let type scale and tone carry the structure. [27:30-28:10]

## Uncertainty and limitations

- **Transcript quality.** Auto-captions only: no punctuation, some misheard words (font names appear garbled; "Junge" and "Martel" are confirmed from the XD font field and the standard Google Fonts names). Findings are paraphrased from that text cross-checked with frames.
- **Numeric values.** The 24 px / 29 px excerpt, 6.6:1 and 3.19:1 contrast results, 447 px list width, and 1 px border are read from frames or stated clearly. The "38" size comparison [09:40] and a line-height value near [11:10] are unclear in the captions and are not reported as values. The 19 px date size is spoken, not confirmed on screen. Headline sizes were not legible in sampled frames.
- **All pixel values are relative to a 1920-wide artboard** and should be treated as ratios, not as CSS values to copy.
- **Frame coverage is sparse.** One frame per ~30 s over 40 minutes, plus 11 targeted pulls. Intermediate steps between samples were inferred from captions. Scene-change sampling and pacing metrics were unavailable due to the ffmpeg incompatibility.
- **Not captured on a frame:** the brief counter-example the presenter shows around [07:50-08:00] of how the hero would look done badly, and the measuring rectangle drawn during the spacing audit [30:30-30:50]. Both are described from captions only.
- **Inferred, not stated by the presenter:** the "one divider direction per group" rule, the "column count rises as importance drops" rule, and the "link panel straddles two bands" observation are generalisations from what is visible on screen.
- **Scope of the video.** One desktop, dark, text-only homepage. No responsive behaviour, no real content, no images in the final design, no interaction states, no progressive disclosure beyond excerpts with "Read more" links. No explicit grid system or spacing scale is taught; spacing is judged by eye and by comparison.
- **The intro is replayed at [39:30-40:49]**; it adds no content.
- The skill's own `report.md` was left unfilled and no vault ingest was performed, per task instructions.
