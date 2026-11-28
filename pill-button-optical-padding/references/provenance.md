# Provenance (optional)

The method in `SKILL.md` was transcribed from a short video by Ariakit (@ariakitjs) published 2026-11-27: https://www.instagram.com/reel/DgQdaYhCFeA/ . This file is the archival record: how it was captured, the transcript, what was on screen when, and where the audio and visuals were reconciled. Nothing here is needed to apply the skill.

Capture (2026-11-27): downloaded with yt-dlp; 60 frames sampled uniformly at 1024 px width (`--no-scene-change`, because scene-change sampling of this screen recording is unreliable); audio transcribed locally with mlx-whisper (`whisper-large-v3-turbo`, word timestamps) because the self-hosted Whisper endpoint was unreachable. No captions existed on the post. `../evidence/` holds `metadata.txt` (yt-dlp info), `transcript.srt` and 17 downscaled key frames (`frame_00NN.jpg`, frame N ≈ (N − 0.5) × 1.875 s), chosen to show every CSS state and dimension readout. The video and audio are not committed; re-download from the URL above.

## Transcript (mlx-whisper, lightly aligned to frames)

| Time | Spoken |
|---|---|
| 0:00 | Claude has been styling your pills wrong. This one is right, and it took some pi to get here. |
| 0:06 | Let's rewind. |
| 0:09 | Here's the usual pill. Half an em of padding on top, one em on the sides, but the icon is off-center in its round end. |
| 0:17 | And the curve eats the corners, so the text looks closer to the edge than its padding. 12 pixels, not 16. |
| 0:26 | First, the icon. A negative margin pulls it into the padding. And now it's concentric. Same space all around. |
| 0:36 | Now the text. The curve cuts these two corners. Spread them over the height, and you get a 1 minus pi over 4 of the radius. |
| 0:44 | For a full pill, the radius is half the height. |
| 0:49 | Add the strip to the end of the text. |
| 0:54 | And it breaks. |
| 0:56 | The math reads 999 pixels. Use the real radius instead, and there it is. 16. |
| 1:04 | It's just math, so it holds. Change the padding. |
| 1:11 | Or the radius, and the space stays right. |
| 1:15 | But move the icon to the other end, and both sides break. |
| 1:18 | Those margins only know start and end, so each part names its own room at the edge. |
| 1:27 | Then two rules give it to the first child, and the last. |
| 1:33 | Now it works either way. |
| 1:37 | Without the icon, |
| 1:42 | as just an icon, |
| 1:46 | or back where it started. |

Whisper heard "half an M" for "half an em" and "some pie" for "some pi"; corrected here. Nothing else was ambiguous.

## On-screen CSS and readouts, by frame

Frame numbers are from the 60-frame uniform sample (frame N ≈ (N − 0.5) × 1.875 s). Readouts are the dimension labels drawn under the button: `start | gap | end` in CSS px, plus the badges "Concentric / Off-center", "Optical space N", "8 all around", "avg N".

| Frames | Time | On-screen code | Readouts / annotations |
|---|---|---|---|
| 01-04 | 0:00-0:07 | `.label { --edge: calc( var(--r) * (1 - pi / 4) * var(--r) / var(--pill) ); }` (final state shown first) | `8 \| 10 \| 20` (one frame reads `9 \| 10 \| 21` during a py animation); frame 04 shows a tooltip `≈ 0.2146` under `(1 - pi / 4)` |
| 05 | 0:08 | rewind symbol; `.icon { width: 1lh; height: 1lh; margin-inline-start: calc(var(--py) - var(--px)); }` | `8 \| 10 \| 16`, "Concentric", "Optical space 12, not 16", "avg 12" |
| 06-08 | 0:09-0:15 | `button { --py: 0.5em; --px: 1em; --r: 999px; padding: var(--py) var(--px); gap: max(var(--py), var(--px) - (1lh - 1cap) / 2); border-radius: var(--r); }` | `16 \| 10 \| 16` |
| 09-10 | 0:15-0:19 | same | "Off-center" badge; icon's circle vs the round end's circle, offset labeled `8` |
| 11-14 | 0:19-0:26 | same | "space at each height" hatched strip at the round end; "avg 12"; "Optical space 12, not 16" |
| 15-17 | 0:26-0:32 | `.icon { width: 1lh; height: 1lh; margin-inline-start: calc(var(--py) - var(--px)); }` typed in | still `16 \| 10 \| 16` until the rule lands |
| 18-19 | 0:32-0:36 | same | `8 \| 10 \| 16`, "Concentric", "8 all around" |
| 20-22 | 0:36-0:41 | same | "cut by the curve": two dashed corner squares of side `r` at the label's end |
| 23-24 | 0:41-0:45 | same | "same area / r × (1 − π/4) = 4": the two cut corners redrawn as one thin strip over the full height |
| 25-26 | 0:45-0:49 | `button { ... --pill: calc(var(--py) + 0.5lh); --r: 999px; ... }` typed in | same |
| 27-30 | 0:49-0:56 | `.label { margin-inline-end: calc( var(--r) * (1 - pi / 4) * var(--r) / var(--pill) ) }` typed in | — |
| 31 | 0:56-0:58 | same, `--r: 999px` still | `8 \| 10 \| 10725`, "Optical space 10720, not 16" (button runs off screen) |
| 32-33 | 0:58-1:02 | `button { ... --r: var(--pill); ... }` | `8 \| 10 \| 20`, "Optical space 16", "avg 16" |
| 34-36 | 1:02-1:08 | same | drag handle on `--py: 0.5em` |
| 37-38 | 1:08-1:12 | `--py: 0.7em` | `11 \| 11 \| 21`, "11 all around", "avg 16", "Optical space 16" |
| 39 | 1:12-1:14 | `--r: 19px` | `8 \| 10 \| 20`, "avg 16", r bracket drawn |
| 40 | 1:14-1:15 | `--r: 4px` | `8 \| 10 \| 16`, "avg 16" (corners nearly square) |
| 41 | 1:15-1:17 | `--r: var(--pill)` restored | `8 \| 10 \| 20` |
| 42-43 | 1:17-1:20 | icon moved to last child; `.icon` still has `margin-inline-start` | `16 \| 6 \| 16`, "Optical space 12, not 16", "Off-center" (both sides broken) |
| 44-45 | 1:20-1:24 | `.icon { ...; --edge: calc(var(--py) - var(--px)); }` and `.label { margin-inline-end: ... }` → `.label { --edge: calc(...) }` | `16 \| 14 \| 16` then `16 \| 10 \| 16` |
| 46-47 | 1:24-1:28 | `button > :first-child { margin-inline-start: var(--edge); }` | `20 \| 10 \| 16`, "Optical space 16" at start, icon still "Off-center" |
| 48-49 | 1:28-1:33 | `button > :last-child { margin-inline-end: var(--edge); }` | `20 \| 10 \| 8`, "Optical space 16", "Concentric", "8 all around" |
| 50 | 1:33-1:36 | label only | `20 \| 20`, "avg 16" both ends |
| 51-53 | 1:36-1:41 | icon + label, then icon only | `8 \| 8`, "Concentric", "8 all around" |
| 54-57 | 1:41-1:47 | undo (⌘Z) back to icon first | `8 \| 10 \| 20`, "Concentric", "Optical space 16" |
| 58-60 | 1:47-1:52 | final `.label { --edge: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill)); }` | `8 \| 10 \| 20` |

## Cross-check of spoken vs. visual

| Claim | Audio | Visual | Status |
|---|---|---|---|
| Usual pill: 0.5em / 1em | yes | `--py: 0.5em; --px: 1em` | consistent |
| Icon off-center, fix with negative margin | yes | `margin-inline-start: calc(var(--py) - var(--px))`, readout 16 → 8 | consistent |
| Curve eats corners, 12 not 16 | yes | "avg 12", hatched strip | consistent (11.7 exact) |
| Strip = (1 − π/4) of the radius | yes | `r × (1 − π/4) = 4`, `≈ 0.2146` tooltip | consistent (4.29 exact) |
| Full pill radius = half the height | yes | `--pill: calc(var(--py) + 0.5lh)` | consistent |
| 999px breaks it; use the real radius | yes | `10725`, then `--r: var(--pill)` → 20 | consistent (10,725 exact) |
| Holds under padding change | yes | `--py: 0.7em` → 11 / 21 / avg 16 | consistent (11.2 / 20.98) |
| Holds under radius change | yes | `19px` → 20, `4px` → 16, avg 16 | consistent (19.87 / 16.17) |
| Per-child `--edge` + first/last-child rules | yes | shown verbatim | consistent |
| Text-only, icon-only cases | yes | `20 \| 20` and `8 \| 8` | consistent |
| `gap: max(var(--py), var(--px) - (1lh - 1cap) / 2)` | never mentioned | on screen throughout | shown, unexplained; kept verbatim |

## Ambiguity log (how the normative text was fixed)

1. **Denominator "the height".** The audio says "spread them over the height". The formula divides by `pill` (half the height) after taking two corners, which equals dividing the two corners' area by the full height `2·pill`. The on-screen hatched strip spans the full button height, not just the label's line box. Codified as the full height. Confidence: high (every readout matches).
2. **Line-height and cap height.** Never stated. Inferred from readouts: `1lh = 24px` (icon 24 square, button height 40, pill 20) and `1cap ≈ 12px` (gap readout 10 = max(8, 16 − (24 − 12)/2)). Used only to reproduce the `gap` number; the skill does not depend on these inferred values.
3. **Rounding.** Readouts are rounded to whole px (4.29 → "4", 11.7 → "12", 20.29 → "20", 20.98 → "21", 11.2 → "11"). The CSS is never rounded. The skill compares measurements with a 0.5 px tolerance.
4. **Starting `gap` rule.** Present on screen from the first "usual pill" frame; not part of the fix narrative. Kept verbatim, labeled as shown-but-unexplained.
5. **What "real radius" means when the token is 999px.** The remedy shown is to set `--r: var(--pill)`. It does not show `min()` or any clamp. Anything beyond "set `--r` to the rendered radius" is supplemental.
6. **Borders, multi-line labels, touch targets, browser fallbacks.** Not covered by the source at all. All guidance on them lives in `supplemental.md`.
