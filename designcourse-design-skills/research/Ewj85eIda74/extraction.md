# Extraction: Color Crash Course for UI/UX Designers [By Example]

Original paraphrased notes on the instructional content of one video. Not a transcript. Not endorsed by or affiliated with the creator.

## Source

| Field | Value |
|---|---|
| Title | Color Crash Course for UI/UX Designers [By Example] |
| Channel | DesignCourse (presenter: Gary Simon) |
| URL | https://www.youtube.com/watch?v=Ewj85eIda74 |
| Video ID | Ewj85eIda74 |
| Duration | 19:43 (1182.8 s) |
| Publish date | 2022-01-18 (yt-dlp `upload_date`) |
| Extraction date | 2026-11-20 |
| Source resolution used | 1280x720 h264 |

Creator's own chapter list (from the video description): 0:00 Introduction, 0:45 sponsor/own-product segment, 1:29 Monochromatic Color Schemes, 4:25 Tint and Shade, 5:08 Color Contrast Importance, 8:42 Introducing 1 Color, 12:40 Pastel Colors, 16:15 Background Colors, 18:55 Final Thoughts.

## Access record

| Item | Result |
|---|---|
| `watch:watch` skill usable | Yes, with one workaround (below). Preflight `setup.py --check` exit 0; backend reported `spark`. |
| Video download | OK via yt-dlp (format 298+251, 720p). |
| Transcript | **YouTube auto-generated captions** (`en-orig` VTT, 549 segments). Whisper was NOT used for the transcript. |
| Frames | **80 uniform frames** at 0.068 fps, 768 px wide (skill run), read as 10 contact sheets of 8. Plus **38 targeted crops** I cut directly from the downloaded video with ffmpeg to read Figma panel values, and 8 reference frames exported to `assets/`. |
| Report | Skill emitted its `report.md` in the temp workdir; its 10 narrative markers were left unfilled because Obsidian ingest was skipped by instruction. |

What failed:

- **Scene-change frame sampling**: first run exited 1. `frames.py:233` passes `-vsync vfr`, which installed ffmpeg 9.0.2 rejects ("Unrecognized option 'vsync'"). Re-ran with `--no-scene-change` (uniform sampling). Plugin not patched. Consequence: no per-shot frames and no pacing metrics; coverage is one frame per ~15 s.
- **Whisper (hook microscope only)**: the 0-10 s word-level pass timed out after 4 attempts against the configured endpoint (`WATCH_WHISPER_ENDPOINT` in `~/.config/watch/.env`). Not needed for the transcript since captions were available.
- **Manual `en` caption track**: HTTP 429; the `en-orig` auto-caption track downloaded fine.
- **Frame timestamp labels**: the skill's uniform-frame `t=` labels are approximate (observed drift of several seconds against direct seeks). Timestamps below come from caption word timings and from accurate direct seeks, not from those labels.

Raw working files (video, VTT, frames, crops) stay in the session scratchpad, not in this directory.

## Timestamped findings

Setup: one Figma artboard (a heading, three text cards each with a round icon container, a few faint decorative background icons) is duplicated and recoloured about 17 times. The lesson is the set of colour decisions, not the layout.

**Framing**

- [00:00-00:40] Colour is presented as the most common beginner failure in UI work. Method: start from a dull grey layout and iterate on colour only.
- [01:45] Sequence: pure black/white first, then greys, then one colour, then several colours, then coloured backgrounds.

**Pure black and white, no greys**

- [02:05-02:45] Make the card surfaces black on the white page, text white, icon containers white. Maximum contrast between page and cards is one valid option.
- [02:45-03:10] Decorative background icons were briefly set to full black, then reverted: non-essential elements should stay at "watermark" strength because at full contrast they distract.
- [03:10-03:25] A variant: keep surfaces white and define the cards with a few-pixel black stroke instead of a fill.
- [03:25-04:05] Dark mode is produced by inverting roles: page black, cards white, text black, and the faint background decorations lightened/raised in opacity so they stay just visible.
- [04:05-04:25] Even within two values there are many valid arrangements (e.g. black icon containers with white icons).

**Greys: tints and shades**

- [04:25-05:05] A card container does not need high contrast against the page it sits on. Only things that are read or operated (text, icons) need it. Card fill dropped to a very light grey.
- [06:45-07:10] Text does not need to be pure black; a very dark grey still works, and maximum-contrast type is often worth avoiding.
- [07:10-07:45] Preferred pattern for cards on a page: tint the page background slightly off-white and make the cards pure white. Icon-container cut-outs were then matched to the page colour so they read as notches.
- [07:45-08:25] Same idea in dark mode: black page, cards one step lighter (dark grey), text near white. Contrast still has to be verified.
- [08:25-08:40] Recap: both high-contrast and low-contrast card containers are acceptable.

**Contrast (the objective part)**

- [05:05-05:25] How much contrast is enough is defined by WCAG, described as minimum-readability guidelines.
- [05:25-05:50] Tool shown: Stark plugin (Figma; also mentioned for Adobe XD). Select the text and its background, run "Check Contrast".
- [05:50-06:05] Thresholds stated: normal text needs at least 4.5:1 for AA and 7:1 for AAA.
- [06:05-06:20] A mid-grey text on the light-grey card measured 3.9:1 and is called insufficient.
- [06:25-06:50] Contrast rules still apply once colour is introduced. Larger text may use a lower ratio because it occupies more area and is easier to read.
- [10:45-10:55] Stated split: much of colour is subjective, but contrast for type (and colour contrast generally) is where objective decisions live.

**One colour**

- [08:45-09:25] Pick a single primary and reuse it everywhere it appears. Applied first to the small heading accent bar and the icons only.
- [09:27-09:50] Grey card fills looked odd beside the accent, so the fill was removed and replaced by a stroke. The stroke can be high or low contrast; low is fine because nobody reads or operates a border.
- [09:50-10:10] The round icon containers were dropped entirely: whitespace between icon and text was judged sufficient.
- [10:10-10:45] Alternative use of the same colour: solid primary circles behind white icons.
- [10:55-11:50] Counter-example: filling the whole card with the saturated primary (with more primary on or next to it). Called overbearing; large areas of high-saturation colour are the problem. Advice: use colour subtly.
- [11:50-12:30] The same single-accent treatment works on a dark page: black page, dark-grey filled cards with no stroke, primary circles, white icons and text. Light and dark follow the same logic.

**Several colours via pastels**

- [12:40-13:10] To use more than one colour, use pastels for the icon containers, with black icons on top.
- [13:10-13:50] Switch the picker to HSL. Choose a point high in lightness and middling-low in saturation (saturation about 44 shown; advised not to go much higher). 
- [13:50-14:15] Then hold S and L fixed and move only the hue slider to get each additional colour. Four hues were produced this way.
- [14:15-14:50] The decorative background icons were tinted with the same pastels by hue-shifting, but still looked too strong.
- [14:50-15:25] Fix: drop their layer opacity to about 50% so they recede and stop competing with the text.
- [15:25-16:00] Optional: change the page from white to a slightly warm off-white (orange/yellow hue, barely any saturation), remove the card stroke, fill cards white. Cards and their text then stand out more.

**Saturated background**

- [16:00-16:35] Swap the page background to a vivid blue. The pastel design survives almost unchanged because the text is enclosed in solid white cards.
- [16:35-17:00] Counter-example: one icon container set to a fully saturated red on the saturated blue. Described as painful to look at. The pastel version is preferred.
- [17:00-17:30] Variant: remove card fills, set text white directly on blue; the decorative icons then stand out too much, so drop them to about 25% opacity.
- [17:30-18:00] If the card boundary is still wanted, add a stroke: either light/white (high contrast) or a darker shade of the background colour. Either is acceptable for non-text, non-interactive elements.

**Closing**

- [18:00-18:50] Which variant to pick depends on the brand's visual identity. Once chosen, apply it consistently across every touchpoint, not only the UI.

## Concrete design guidance

Values below were read from the Figma panel in zoomed frames unless marked approximate. "Before/after" describes what was visible on the artboard.

### Neutrals and surfaces

| Technique | Value(s) seen | Visual observation | Time |
|---|---|---|---|
| Starter state | White artboard, mid-grey cards, canvas `#E5E5E5` | Flat and muddy; cards and text have similar weight | 01:30 |
| Low-contrast card fill | Card `#ECECEC` on white | Cards read as soft panels; text carries the hierarchy | 04:41-05:02 |
| Off-white page + white cards | Page `#ECECEC`, cards `#FFFFFF` | Cards lift off the page without any border or shadow | 07:30 |
| Dark shades | Page black, cards dark grey (exact hex not legible), text near white | Same structure as light version, inverted | 08:00-08:25 |
| Warm off-white page | approx `#F1F0EF`, HSL(40, 8, 94) | Subtle warmth; white cards and dark text pop more than on pure white | 15:48 |
| Card border instead of fill | Stroke `#C6C6C6`, HSL(0, 0, 78), 1 px, inside | Thin quiet outline; content area stays white | 09:52 |

Other panel facts (context, not taught as rules): body text Poppins Regular 18 px, line height 184.5%, card corner radius 11, artboard 1440x1024.

### Contrast measurements shown (Stark)

| Pair | Ratio | Result shown | Time |
|---|---|---|---|
| Very dark grey text on `#ECECEC` card | 11.7:1 | Passes AA and AAA, normal and large | 05:55 |
| Text `#757575` on `#ECECEC` card | 3.9:1 | Fails AA/AAA for normal text; passes AA large (3:1) only | 06:16 |
| Text `#757575` (after background change) | 4.61:1 | Passes AA normal (4.5:1), fails AAA normal (7:1) | ~06:25-06:40 |

Plugin legend visible in frame: normal text AA 4.5:1 / AAA 7:1; large text AA 3:1 / AAA 4.5:1. See [0555](assets/0555-stark-pass-11-7.jpg) and [0616](assets/0616-stark-fail-3-9.jpg).

### Single accent colour

| Technique | Value(s) seen | Visual observation | Time |
|---|---|---|---|
| Primary | `#9C1EFF` = HSL(274, 100, 56), stated aloud as the hex | Vivid violet | 09:14 |
| Accent on small elements only | Heading bar + icon glyphs in primary; cards outlined | Before: grey cards fight the accent. After: accent is the only colour and reads cleanly ([0937](assets/0937-single-accent-icons-stroke-cards.jpg)) | 09:27-10:10 |
| Accent as small solid shapes | Primary circles, white icons | Stronger, still controlled: colour area is small | 10:10-10:45 |
| Accent as large fill (discouraged) | Cards filled `#9C1EFF`, white icon containers, text switched to white | Three large violet blocks dominate the page ([1120](assets/1120-saturated-card-fill-overbearing.jpg)) | 10:55-11:50 |
| Accent on dark | Black page, dark-grey cards, primary circles, white text/icons | Works as well as the light version | 11:50-12:30 |

### Pastel multi-colour set

Construction shown at [13:10-14:15]: fix saturation and lightness, vary hue only.

| Swatch | HSL read from panel | Hex | Time |
|---|---|---|---|
| Pink (first pick) | (0, 44, 82) | `#E5BCBC` | 13:30 |
| Pink (settled) | (360, 41, 79) | `#E0B4B4` | 13:50 |
| Teal | (184, 42, 79) | `#B4DDE0` | 14:44 |
| Yellow-green | hue approx 68, same S/L | `#DAE0B4` | 15:14 |
| Lilac | hue approx 270, S 42, L 79 | approx `#CCB4E0` (low confidence) | 14:08 |

Working range implied: S about 41-44, L about 79-82. Presenter warns against pushing saturation much above the mid-40s.

- Icons on pastel circles stay black [12:50]; frame [1408](assets/1408-pastel-icon-containers.jpg).
- Decorative background icons: tinted with the same pastels, then layer opacity 50% on light pages [15:12] and 25% on the saturated blue page [17:22].

### Saturated background

| Technique | Value(s) seen | Visual observation | Time |
|---|---|---|---|
| Vivid blue page | approx `#0553C9`, hue 216, saturation near 100 (read mid-drag; final value may differ slightly) | White cards + pastel circles sit comfortably on it ([1633](assets/1633-pastels-on-saturated-blue.jpg)) | 16:20-16:35 |
| Saturated on saturated (discouraged) | Icon container `#FF2424`, HSL(360, 100, 57), on the blue | The red circle vibrates against the blue; neighbouring pastel circle looks calm by comparison ([1645](assets/1645-saturated-red-on-blue-clash.jpg)) | 16:45 |
| Text directly on colour | Card fill removed, text white | Readable; decorations become too loud until faded to 25% | 17:00-17:30 |
| Tonal border | Stroke `#003A90`, HSL(216, 100, 28), 1 px inside: same hue as page, darker | Quiet card edge that belongs to the background | 17:52 |
| Light border | White stroke | Crisper, higher-contrast edge; presented as an equal alternative | 17:38 |

## Key frames

| Time | File | What it shows | Why it matters |
|---|---|---|---|
| 05:55 | [assets/0555-stark-pass-11-7.jpg](assets/0555-stark-pass-11-7.jpg) | Stark dialog: 11.7:1, all four AA/AAA checks green, for dark text on a light-grey card | Shows that a low-contrast container can still hold high-contrast text |
| 06:16 | [assets/0616-stark-fail-3-9.jpg](assets/0616-stark-fail-3-9.jpg) | Same card with `#757575` text: 3.9:1, fails normal-text AA | Concrete example of grey text that looks acceptable but fails |
| 09:37 | [assets/0937-single-accent-icons-stroke-cards.jpg](assets/0937-single-accent-icons-stroke-cards.jpg) | Violet accent on heading bar and icons; cards mid-transition from fill to stroke | The restrained single-accent pattern |
| 11:20 | [assets/1120-saturated-card-fill-overbearing.jpg](assets/1120-saturated-card-fill-overbearing.jpg) | Cards fully filled with `#9C1EFF` | The discouraged use: too much saturated area |
| 14:08 | [assets/1408-pastel-icon-containers.jpg](assets/1408-pastel-icon-containers.jpg) | Three pastel icon circles (pink, lilac, teal), black icons, outlined white cards, HSL picker open | Hue-only variation at fixed S/L |
| 16:33 | [assets/1633-pastels-on-saturated-blue.jpg](assets/1633-pastels-on-saturated-blue.jpg) | Vivid blue page, white cards, pastel circles | Opaque content surfaces make a strong background safe |
| 16:45 | [assets/1645-saturated-red-on-blue-clash.jpg](assets/1645-saturated-red-on-blue-clash.jpg) | One circle changed to `#FF2424` beside a pastel one, on blue | Side-by-side of clashing vs calm accent |
| 18:32 | [assets/1832-all-iterations-board.jpg](assets/1832-all-iterations-board.jpg) | Zoomed-out board of all iterations | Overview of the whole option space covered |

Not saved but observed in the 80-frame pass: pure B/W light version (~03:12), B/W dark version (~03:57), off-white page with white cards (~07:30), dark-shade version (~08:23), accent circles on dark (~12:26), 50%-opacity pastel decorations (~15:17), warm off-white page (~15:50), text-on-blue with tonal stroke (~17:55).

## Practical rules for improving existing UIs

Derived from this video only. Each is traceable to the timestamp given.

1. **Audit text contrast with a tool, not by eye.** Normal text at least 4.5:1 (AA), 7:1 for AAA; large text 3:1 / 4.5:1. [05:05-06:20]
2. **Mid-grey body text on a grey surface is a likely failure.** `#757575` on `#ECECEC` measured 3.9:1. Darken the text or lighten the surface. [06:16]
3. **Spend contrast on what is read or operated.** Text and icons get high contrast; card fills, borders and dividers can be low contrast. [04:41-05:05, 09:50]
4. **Demote decoration.** Background ornaments and non-essential graphics should sit at watermark strength; reduce opacity (50% on light, 25% on saturated backgrounds shown) until they no longer compete with text. [02:45-03:10, 15:10, 17:22]
5. **Separate cards from the page with a small value step, not a heavy treatment.** Either off-white page + white cards, or white page + very light grey cards. [04:41, 07:10-07:45]
6. **If a filled card clashes with the accent, replace the fill with a 1 px low-contrast border.** [09:27-09:52]
7. **Remove containers that whitespace already does the job of.** Test deleting icon backgrounds before restyling them. [09:55-10:10]
8. **Prefer very dark grey over pure black for body text when the ratio still passes.** [06:50-07:10]
9. **Start from one primary colour and apply it to small elements first** (accent bars, icons, small solid shapes). [08:45-10:45]
10. **Do not flood large surfaces with a fully saturated colour.** If a card or section is filled with the raw primary, pull the colour back to small accents or use a tint. [10:55-11:50]
11. **Build a multi-colour set by locking saturation and lightness and rotating hue only.** Shown range: S about 41-44, L about 79-82 in HSL. [13:10-14:15]
12. **Keep foreground glyphs dark on pastel fills** rather than colouring them too. [12:50]
13. **Never place a fully saturated colour directly on another fully saturated colour.** Use a pastel, white, or a neutral instead. [16:35-17:00]
14. **On a vivid background, put text inside opaque light surfaces, or set it white and quiet everything else.** [16:20-17:30]
15. **For borders on a coloured background, use a darker shade of that same hue (or white).** Shown: page hue 216 with a stroke at lightness 28. [17:38-17:55]
16. **Derive dark mode by inverting roles, then re-check.** Page darkest, cards one step lighter, text near white, decorations re-lifted; re-run contrast checks. [03:25-04:05, 07:45-08:25, 11:50-12:30]
17. **A warm, barely saturated off-white page (around S 8, L 94) is a low-risk upgrade from pure white** when cards are white. [15:25-16:00]
18. **Pick one colour approach per product and hold it everywhere.** Choice should follow the brand identity; mixing approaches across screens is the failure. [18:00-18:50]

## Uncertainty and limitations

- **Transcript quality**: YouTube auto-captions, not human-verified and not Whisper. Several words are visibly dropped or misheard (e.g. "grace" for greys, stray "i"/"eye" tokens). Meaning was reconstructed from context plus frames; fine wording is low confidence.
- **Frame coverage is sparse**: 80 uniform frames over 19:43 (about one per 15 s) because scene-change sampling failed. Short intermediate states between samples may have been missed. Targeted crops filled the gaps only where I chose to look.
- **No pacing metrics or hook analysis** from the skill (scene detection and Whisper hook pass both failed). Not relevant to the design content.
- **Values read mid-drag**: the blue page colour (`#0553C9`) was captured while the picker was moving; treat as approximate. The lilac pastel hex is a low-confidence read. The dark-mode card grey was not legible. Other hex/HSL values were read clearly from 2x-upscaled crops but are still read off compressed 720p video.
- **Which pair gave 11.7:1 and 4.61:1**: the text colour for 11.7:1 was a very dark grey whose hex I could not read with certainty; the 4.61:1 reading used `#757575` after the presenter changed the selection, and the exact background in that check is inferred (consistent with white), not read. A 13.84:1 reading also flashed at about 06:10 for a pair I did not identify.
- **"Normal text" definition**: the presenter describes normal text as roughly 16 px regular weight or heavier [06:30]. That matches the Stark tooltip visible on screen, which is a caveat about result accuracy, not the WCAG large-text definition. I recorded what was said; it was not checked against the WCAG spec here.
- **Rule ranges are generalisations of single examples**: the pastel S/L band and the 50%/25% opacity figures come from one demonstration each, chosen by eye by the presenter. They are starting points, not stated standards.
- **Subjective claims**: judgements such as "overbearing" or "hurts your eyes" are the presenter's opinion as presented; only the WCAG thresholds are offered as objective.
- **Not covered by the video**: colour harmony schemes beyond hue rotation, semantic/state colours (error, success), interactive states, gradients, shadows, colour-blind safety beyond contrast ratio, colour tokens or naming, and non-text contrast requirements for UI components.
- **Excluded**: the 0:45-1:29 and 18:55-end segments promote the creator's own course and contain no design instruction.
