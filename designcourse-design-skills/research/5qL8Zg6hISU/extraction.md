# Extraction: 5 Types of Shadows for your UI Designs

Original paraphrased notes on the design principles taught in the video. Not a transcript, not endorsed by or affiliated with the creator.

## Source

| Field | Value |
|---|---|
| Title | 5 Types of Shadows for your UI Designs |
| Channel | DesignCourse (presenter: Gary Simon) |
| URL | https://www.youtube.com/watch?v=5qL8Zg6hISU |
| Video ID | 5qL8Zg6hISU |
| Duration | 11:21 (681 s) |
| Publish date | 2022-07-08 (yt-dlp `upload_date`) |
| Extraction date | 2026-11-20 |
| Creator's chapters | 0:00 Intro, 0:25 course promo, 1:10 Type 1, 5:01 Type 2, 6:08 Type 3, 7:02 Type 4, 9:09 Type 5, 10:39 Final thoughts |
| Tool shown | Figma (drop-shadow effect on a card) |

## Access record

- Watch skill (`watch:watch`, plugin 0.2.0): usable. Preflight `setup.py --check` exit 0; backend reported `spark`.
- Download: yt-dlp succeeded (720p video + audio, merged mp4).
- Transcript method: **YouTube native captions** (auto-generated English, `en` / `en-orig` VTT). Whisper (Spark endpoint) was not needed and was not called for the full transcript.
- Frames: **80 uniform frames** (one per ~8.5 s, 1024 px wide) from the skill, all in the skill's working dir. 36 of them were viewed directly (2 intro/promo, 33 across the tutorial 1:16-10:20, 1 outro).
- Extra evidence: 40 cropped stills of the Figma effect panel, cut from the downloaded video with ffmpeg at chosen timestamps, to read numeric values. 8 full frames (1280 px) copied into `assets/`.
- What failed:
  - First run: the skill's scene-change frame extraction failed (`Unrecognized option 'vsync'`; local ffmpeg is 9.0.2, the script passes `-vsync vfr`). Re-ran with the skill's own `--no-scene-change` flag (uniform sampling). Plugin script not modified.
  - Consequence: no per-shot frames and no meaningful pacing/cut metrics.
  - `drawtext` filter missing in local ffmpeg, so crops are unlabeled (order tracked by filename).
- Skipped by instruction: Obsidian vault staging/ingest (Steps 4.4/4.5) and filling the skill's `report.md` markers (only needed for ingest).
- Raw working files (video, VTT, frames, crops) remain in the session scratchpad, not in this directory.

## Timestamped findings

Setup: one white card (photo, tag, heading, text link) on a pale blue frame, duplicated and restyled per shadow type.

- [01:55-02:29] **No shadow is a valid choice.** A white card on a tinted background already separates by fill contrast; a shadow there is preference, not need.
- [02:07-02:22] When the card fill equals the page background, the container disappears. That can also be acceptable: content does not always need a wrapping card.
- [02:31-02:59] **Type 1, subtle default shadow.** Figma's default drop shadow (small downward offset, small blur) is an acceptable starting point.
- [03:01-03:12] The default is a little dark; lowering opacity makes it more minimal and better.
- [03:12-03:22] Offsets have a "range of acceptability"; equal x and y offsets are fine too.
- [03:22-04:02] **Main don't:** a prominent, high-contrast shadow competes with the content. Described as a common beginner mistake. A shadow should sit in the background as a subtle aesthetic.
- [04:02-04:15] This low-contrast rule holds for every shadow type in the video except one (the neubrutalist one).
- [04:15-04:56] **Tint the shadow on colored backgrounds.** Black shadow over a colored surface mixes to a gray cast. Instead sample the background color and darken it, which reads as more natural.
- [05:08-05:31] **Type 2, hard shadow.** Zero blur with a somewhat larger x/y offset. Still fine as long as it stays low contrast and non-distracting.
- [05:31-06:07] Hard shadows also have an acceptable opacity/darkness range; past a certain contrast they become too distracting. Keep it "an afterthought".
- [06:09-06:52] **Type 3, neubrutalist shadow.** High-contrast hard shadow paired with a thicker stroke on the card. This is the one deliberate exception to the low-contrast rule; it is an aesthetic, not a default.
- [06:54-07:45] **Type 4, large soft shadow.** Card fill is the same color as the surface it sits on; a big, heavily blurred, very subtle shadow with a moderate offset supplies a rough low-contrast outline of the card.
- [07:45-08:00] The purpose is edge definition: the card is perceivable even though it shares the background color.
- [08:01-08:15] Same don't applies: a dark version of the soft shadow makes the design "about the shadow".
- [08:17-08:59] The large soft shadow works especially well for a white card on a white background, with a black or desaturated shadow color.
- [09:01-09:40] **Type 5, colored shadow.** Same soft-shadow geometry, shadow color picked from the pale, low-saturation corner of the picker; then sweep hue for variations.
- [09:21-09:43] Colored shadows must also be low contrast. Saturated/dark picks are the wrong area of the color field.
- [09:43-10:00] Function of all of these: create a general outline of the card against what it sits on.
- [10:07-10:37] Recap sequence: no shadow, subtle shadow, low-contrast hard shadow, high-contrast hard shadow with stroke, large soft low-contrast shadow (same-color card), same on white, colored shadows.
- [10:39-10:48] Stated takeaway: avoid high-contrast shadows unless intentionally doing a neubrutalist look.

## Concrete design guidance

Values read from the Figma effect panel in cropped stills. CSS equivalents are my translation, not shown in the video. Shared card: 290 x 416, corner radius 14, fill `#FFFFFF`, on a pale blue frame (card later filled `#D2E0ED` to match it).

| # | Type | x / y | Blur | Spread | Color @ opacity (observed) | Timestamp | Visual result |
|---|---|---|---|---|---|---|---|
| 0 | None | - | - | - | - | 01:55 | White card on pale blue reads clearly by fill alone |
| 1a | Figma default | 0 / 4 | 4 | 0 | `#000000` @ 25% | 02:58 | Visible dark smudge under the card; called fine but a bit dark |
| 1b | Subtle (preferred) | 0 / 4, then 4 / 4 | 4 | 0 | `#000000` @ 11% | 03:12-03:20 | Barely-there edge on bottom/right; card lifts slightly |
| 1c | Don't | 4 / 4 | 4 | 0 | `#000000` @ ~56% (seen while dragging up) | 03:40 | Hard dark rim around the card; eye goes to the edge, not the content |
| 1d | Tinted for colored bg | 4 / 4 | 4 | 0 | `#C3D4E3` @ 100% (background hue, darkened) | 04:36-04:41 | Shadow is a darker blue of the page instead of gray; cleaner than 1b side by side |
| 2 | Hard, low contrast | 9 / 9 | 0 | 0 | `#BACDDE` @ 100% | 05:18 | Crisp offset slab in a slightly darker page blue |
| 2x | Hard, upper limit | 9 / 9 | 0 | 0 | `#2E4C6B` @ ~50%, then pulled back to 24-35% | 05:48-05:54 | At ~50% the slab is clearly darker; presenter says not to go beyond roughly this |
| 3 | Neubrutalist | 9 / 9 | 0 | 0 | `#000000` @ 100% + `#000000` inside stroke, thickened | 06:22-06:52 | Black outline and solid black offset block; deliberately loud |
| 4 | Large soft, card = bg color | 4 / 4 then 10 / 10 | 50 | 0 | pale blue-gray, `#BACDDE` then `#AABAC9` @ 100% | 07:27-07:45 | Soft halo down-right; card edge implied without a fill change |
| 4x | Don't | 10 / 10 | 50 | 0 | `#204362` @ 100% | 08:04-08:10 | Heavy navy cloud behind the card; shadow dominates |
| 4w | Large soft on white | 10 / 10 | 50 | 0 | gray/desaturated; `#4E4E4E` @ 100% seen at 08:56, a lighter gray by 09:12 | 08:44-09:12 | White card on white, edge defined only by faint gray bloom |
| 5 | Colored soft | 10 / 10 | 50 | 0 | pale tints @ 100%: `#D1AFAF` (pink), `#B5D0AC` (green), `#ACD0CA` (teal) | 09:26-09:56 | Faint pink/green/violet glow on white; still reads as an outline |

Derived observations:

- **Two ways to get low contrast** are both shown: black at low alpha (11%) or a near-background color at full alpha. Either is fine; the measured goal is small luminance difference between shadow and surface. [03:06, 04:36, 05:18]
- **Geometry stays tiny or goes big-and-soft**: 4 px offset with 4 px blur, or 10 px offset with 50 px blur (blur = 5x offset). Hard shadows: blur 0, offset about 9 px on a 290 px wide card. [02:58, 05:18, 07:27]
- **Spread is never touched** (always 0). [all panels]
- **Light direction is consistent**: every shadow falls down or down-right. [02:58-09:56]
- **Colored shadow picks sit in the top-left region of the picker** (high brightness, low saturation); only hue changes between variants. [09:26-09:40]
- CSS translations (mine): 1b `box-shadow: 4px 4px 4px rgb(0 0 0 / 0.11)`; 2 `9px 9px 0 #BACDDE`; 3 `border: 3px solid #000; box-shadow: 9px 9px 0 #000` (border width assumed); 4 `10px 10px 50px #AABAC9`; 5 `10px 10px 50px #B5D0AC`.

## Key frames

Frames copied to `assets/` are 1280 px wide stills from the downloaded video.

| Time | Asset | Shows | Why it matters |
|---|---|---|---|
| 02:59 | [0259-default-drop-shadow.jpg](assets/0259-default-drop-shadow.jpg) | No-shadow card beside Figma default shadow, panel reading 0/4/4, black 25% | Baseline values and the "no shadow is fine" comparison |
| 03:42 | [0342-dont-high-contrast.jpg](assets/0342-dont-high-contrast.jpg) | Third card with opacity pushed up, dark rim | The central anti-pattern |
| 04:41 | [0441-tinted-shadow-on-colored-bg.jpg](assets/0441-tinted-shadow-on-colored-bg.jpg) | Zoomed corners: gray-cast black shadow (left) vs background-tinted shadow (right) | Clearest before/after for tinting shadows on colored surfaces |
| 05:48 | [0548-hard-shadow-opacity-ceiling.jpg](assets/0548-hard-shadow-opacity-ceiling.jpg) | Hard 9/9/0 shadow with a dark blue at ~50% | Where a hard shadow starts to be too much |
| 06:56 | [0656-neubrutalist-stroke-plus-hard-shadow.jpg](assets/0656-neubrutalist-stroke-plus-hard-shadow.jpg) | Subtle hard shadow card next to black stroke + black hard shadow card | The one sanctioned high-contrast case, and that it comes with a stroke |
| 07:47 | [0747-large-soft-shadow-same-bg.jpg](assets/0747-large-soft-shadow-same-bg.jpg) | Card filled with the page color, outlined only by a blur-50 shadow | Shadow as the sole separator |
| 08:10 | [0810-dont-dark-soft-shadow.jpg](assets/0810-dont-dark-soft-shadow.jpg) | Same soft shadow with dark navy color | Shows the don't applies to soft shadows too |
| 10:03 | [1003-colored-shadows-on-white.jpg](assets/1003-colored-shadows-on-white.jpg) | White cards on white with gray, green and violet tinted glows | Target subtlety level for colored shadows |

Other frames viewed but not copied: 01:16-01:50 (single card setup), 02:07 (card fill matched to background), 09:12 (white card on white panel with gray shadow), 10:20 (final row of all variants).

## Practical rules for improving existing UIs

1. **Ask first whether the shadow is needed.** If a card's fill already contrasts with its surface, removing the shadow is a legitimate fix. [01:55-02:29]
2. **Audit every shadow for contrast.** If the shadow is noticeable before the content is, lower its alpha or lighten its color. Default target shown: black at about 10% rather than 25%+. [03:01-04:02]
3. **Do not ship tool defaults untouched.** The Figma default (black 25%) was called slightly too dark; treat similar framework defaults as a starting point to soften. [02:59-03:12]
4. **On tinted or colored surfaces, replace black/gray shadows with a darkened version of the surface color.** [04:15-04:56]
5. **Keep small shadows small:** offsets and blur around 4 px for a resting card. [02:48-03:22]
6. **Hard (zero-blur) shadows are allowed, but in a color close to the surface.** If it reads as a dark slab, back it off. [05:08-06:07]
7. **High-contrast hard shadows only as a full neubrutalist treatment:** pair with a thick dark stroke and apply it as a deliberate, consistent style, never as a one-off. [06:09-06:52, 10:41]
8. **When a card shares its background color (including white on white), use a large soft shadow** (blur about 50, offset about 10, very light color) to define the edge instead of adding a border or changing the fill. [06:54-08:59]
9. **Never darken the large soft shadow.** If the blur cloud is clearly visible as a shape, it is too strong. [08:01-08:15]
10. **Colored shadows: pale, low-saturation tints only**, chosen by hue, same soft geometry. They should still function as an outline, not as a glow effect. [09:09-10:00]
11. **Judge a shadow by one test:** does it merely outline the element against its surface? If it does more than that, reduce it. [09:53-10:00]
12. **Keep one light direction** (down / down-right) across all shadowed elements. Observed in every example rather than stated. [02:58-09:56]

## Uncertainty and limitations

- Transcript is YouTube auto-captions: no punctuation, occasional misrecognitions ("new brutalism", stray "i" tokens). Points were cross-checked against frames, but nuance in fast speech may be lost.
- Frames are uniform samples every ~8.5 s plus hand-picked stills; states between samples may be missed. Values seen while a slider was mid-drag (56%, 50%, 24%, 35%) are snapshots, not settled choices.
- The presenter states almost no numbers aloud except x 0 / y 4 / blur 4, 25% opacity, "both at 9 or so", blur "like 50", and x/y "10 and 10". All other numbers and every hex code are read from small on-screen text in 720p stills and may be off by a character.
- The final opacity/color the presenter kept for the hard shadow (Type 2) after the limit demo is not confirmed; it visually appears to return to the pale blue (`#BACDDE`).
- Neubrutalist stroke width was not readable (panel showed weight 1 before thickening; final looks about 3-4 px on a 290 px card). The CSS border width above is an assumption.
- White-background soft shadow color is low confidence (two different grays seen at different moments).
- The page background hex was not read directly; `#D2E0ED` is the card fill used when matching it.
- Rule 12 (light direction) and the "blur = 5x offset" ratio are my inferences from the examples, not stated guidance.
- CSS `box-shadow` strings are my translation; Figma and browser blur rendering differ slightly.
- Not covered by the video: inner shadows, layered/multi-shadow stacks, elevation scales, dark mode, hover/pressed states, accessibility or contrast requirements for boundaries. Only one card component on light backgrounds is shown.
- 0:25-1:10 is a course promotion with no instructional content; excluded.
- The linked Figma community file in the description was not opened.
