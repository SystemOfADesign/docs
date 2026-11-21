# Extraction: "Fixing your BAD Alignment! Stop doing this one thing.."

Original paraphrased notes on the design principles taught in one video. Not a transcript. Not endorsed by or affiliated with the creator.

## Source

| Field | Value |
|---|---|
| Title | Fixing your BAD Alignment! Stop doing this one thing.. |
| Channel | DesignCourse (presenter: Gary Simon) |
| URL | https://www.youtube.com/watch?v=yxPk82xV7bA |
| Video ID | yxPk82xV7bA |
| Duration | 6:55 (415 s) |
| Published | 2021-12-30 (from yt-dlp metadata) |
| Extracted | 2026-11-20 |
| Creator chapters | 0:00 Introduction, 0:50 First Example, 2:15 Second Example, 4:11 Final Example, 5:46 Recap, 6:23 Outro |

## Access record

| Item | Result |
|---|---|
| Watch skill (`watch:watch` 0.2.0) | Usable. Preflight `setup.py --check` exit 0. |
| Download | yt-dlp OK (video + info JSON + captions). |
| Transcript | Obtained. Method: **YouTube captions** (English auto-generated track, `en` / `en-orig` VTT). Whisper not invoked, Spark endpoint not tested. |
| Frames | **80** frames, uniform sampling, one every ~5.2 s, 1024 px wide. All 80 reviewed (as 3x3 contact sheets), 7 re-read at full 1024 px. |
| Hook microscope | 20 extra frames for 0-10 s were produced by the skill but not reviewed (intro talking head, not instructional). |
| Failure 1 | First run failed at scene-change frame extraction: the skill's `frames.py` passes `-vsync vfr`, which the installed ffmpeg 9.0.2 rejects ("Unrecognized option 'vsync'"). Worked around with the skill's own `--no-scene-change` flag (uniform sampling). Consequence: no per-shot frames and no pacing metrics. |
| Failure 2 | Installed ffmpeg has no `drawtext` filter, so contact sheets carry no burned-in timestamps; frame times were taken from the skill's frame list instead. |
| Skipped | Obsidian vault ingest (none detected, and out of scope). The skill's `report.md` pending markers were not filled; this file is the deliverable instead. |
| Raw working files | Kept outside this directory, in the session scratchpad (`watch-yxPk82xV7bA/`: video, VTT, 80 frames, sheets, report.md). Temporary. |

## Summary of what the video teaches

- One topic: **alignment consistency inside multi-column layouts**. Three small Figma mock-ups, each shown before and after.
- Core claim: a column should have one clear vertical edge that its elements share; mixing left-aligned and center-aligned content in neighbouring columns reads as inconsistent.
- No numeric values, grid systems, spacing scales or optical-alignment techniques are taught. See "Uncertainty and limitations".

## Timestamped findings

### Introduction [00:02-00:44]

- [00:10-00:24] Three example layouts each have an alignment flaw; the video shows how to fix alignment and overall layout in each.
- [00:24-00:39] Presenter says this mistake appears repeatedly in the design reviews they run (their estimate: two or three times per review).

### Example 1: centered text block next to an illustration [00:52-02:15]

- [00:52-01:05] Two-column block: illustration on the right; on the left an arrow icon, a headline and a paragraph, all center-aligned.
- [01:05-01:17] Presenter rates this the mildest case, "not bad at all", and frames the change as personal taste aimed at defining the column better.
- [01:22-01:34] Fix: right-align the headline and paragraph, and move the arrow so it sits on that same right edge.
- [01:34-01:44] With rulers on (Figma `Shift+R`), a guide dropped on that edge shows a clean vertical line, i.e. a defined column.
- [01:44-01:53] Why centered text fails to define a column: line lengths vary, so both sides of the block move in and out and neither forms an edge.
- [01:57-02:10] Optional reinforcement: stretch the arrow's stem up to the top of the frame so the shared edge becomes a literal drawn line. Presenter's verdict: the result looks like a rigid layout, while the original text looked placed arbitrarily in the middle.

### Example 2: left-aligned column next to a centered column [02:15-04:11]

- [02:17-02:40] Left column is praised: headline, description and three status rows all start on one left edge, and the row containers run to one right edge. Both edges hold when guides are dropped on them.
- [02:40-02:48] The edges remain visible even with rulers hidden; the elements run straight up and down.
- [02:48-03:06] Problem in the right column: logo, two paragraphs and a button pair are center-aligned, directly adjacent to a left-aligned column. Presenter calls mixing the two "a big no".
- [03:06-03:19] Fix: left-align both paragraphs, left-align the logo, move the buttons to the same left edge, and pull the column slightly closer to the first one.
- [03:21-03:38] Stated result: a firm second column, better flow, and consistency, because the adjacent blocks now use the same alignment.
- [03:38-04:04] Guides comparison: after the fix, one guide marks the second column's start. Before, the same column implied three different starting edges (start of logo, start of paragraph text, start of button).
- [04:04-04:12] Summary claim: the single-edge version is more consistent and simpler.

### Example 3: contact section with columns inside a column [04:12-05:46]

- [04:14-04:29] Common pattern in contact sections: the second column is not centered, but it holds two items side by side, creating two columns within one column.
- [04:29-05:04] Side note on redundancy: the first column's heading already makes clear this is a contact area, so a second heading over the alternative contact details adds nothing and only clutters the layout. Remove it.
- [05:04-05:25] Alignment fix: instead of phone and email sitting side by side, stack them vertically on one left edge.
- [05:25-05:34] Rationale 1: fewer columns; no extra columns added without need.
- [05:34-05:46] Rationale 2 (readability/usability): for bullet-like items, scanning down a list is easier than scanning across.

### Recap [05:46-06:21]

- [05:51-06:05] Example 1's original would be acceptable; the change is a preference for a rigid, well-defined layout, described as an improvement in that respect.
- [06:05-06:21] Main rule restated: do not mix left-aligned and center-aligned text, especially when the blocks are close or adjacent, because it creates visible inconsistency within one view.

## Concrete design guidance

No pixel values, ratios or grid specs are given in the video. What is concrete is technique and before/after structure.

| # | Technique | Before (observed in frames) | After (observed in frames) | Timestamp |
|---|---|---|---|---|
| 1 | Give a text block next to media a hard edge on the side facing the media | Left block centered: arrow, headline, 6-line paragraph; both sides ragged; no shared edge with anything | Text right-aligned; headline, every paragraph line and the arrow end on one vertical line beside the illustration; left side ragged | [01:22-01:44], frame 02:10 |
| 2 | Turn a decorative element into the alignment edge | Short down-arrow centered above headline | Arrow stem extended from the top of the artboard down to just above the headline, sitting on the text's right edge, acting as a drawn column rule | [01:57-02:07], frame 02:10 |
| 3 | Verify columns with guides | n/a | Guides on a column's left and right extremes; every element should touch one of them | [01:36-01:44], [02:20-02:40], frame 02:25 |
| 4 | Match alignment across adjacent columns | Left column left-aligned; right column centered (logo, 2 paragraphs, primary button + text link) | Right column fully left-aligned: logo icon, paragraph start and primary button start on one guide | [02:48-03:38], frame 03:43 |
| 5 | Count implied edges | Centered column produces three separate left starts: logo, paragraph, button group (three guides needed) | One guide covers all three | [03:47-04:04], frame 03:58 |
| 6 | Tighten the gutter after re-aligning | Centered column's visual start sits far from column 1 | Second column moved slightly left, closer to column 1 | [03:15-03:19] |
| 7 | Make repeated row containers span the full column width | n/a (already correct) | Three status rows: container left edge = heading left edge; container right edges all equal | [02:25-02:37], frame 02:25 |
| 8 | Stack list-like items vertically | Phone and email on one row, side by side, under an extra heading | Phone above email, icons on one left edge, placed level with the first form field | [05:04-05:25], frames 04:19, 05:42 |
| 9 | Delete redundant secondary headings | "Message me" on the left and "Other Contact" on the right | Only "Message me" remains; contact details sit unlabelled beside the form | [04:29-05:04], frame 05:42 |

Additional frame observations (seen, not discussed by the presenter):

- Ex. 2 after: the paragraph keeps its narrow measure when left-aligned; only alignment changes, not width. Frame 03:43.
- Ex. 2: the primary button plus text-link pair stays a horizontal pair; the pair as a unit moves to the left edge. Frame 03:43.
- Ex. 3: the "Send Message" button is right-aligned to the form field's right edge in both versions; it is left unchanged and not commented on. Frame 05:42.
- Ex. 3 after: icons (phone, mail) share a left edge and labels share a second left edge, so icon+label rows form a tidy two-edge list. Frame 05:42.

## Key frames

Frame times come from the skill's frame list (uniform sampling, so times are approximate to ~5 s).

| Time | File | What it shows | Why it matters |
|---|---|---|---|
| 00:16 | [assets/t0016_frame04.jpg](assets/t0016_frame04.jpg) | Figma canvas with all three "before" mock-ups side by side | Overview of the three problem patterns |
| 00:57 | [assets/t0057_frame12.jpg](assets/t0057_frame12.jpg) | Example 1 before: centered arrow, headline, paragraph left of an illustration | Baseline for the "no defined edge" case |
| 02:10 | [assets/t0210_frame26.jpg](assets/t0210_frame26.jpg) | Example 1 before and after side by side | Shows right-aligned text plus extended arrow rule forming a column edge |
| 02:25 | [assets/t0225_frame29.jpg](assets/t0225_frame29.jpg) | Example 2 before, with two red guides bounding the left column | A correct column: all elements touch the left guide, row containers touch the right |
| 03:43 | [assets/t0343_frame44.jpg](assets/t0343_frame44.jpg) | Example 2 before and after, guides on | After: logo, paragraph, button share one guide. Clearest single before/after |
| 03:58 | [assets/t0358_frame47.jpg](assets/t0358_frame47.jpg) | Example 2 before, with several guides in the centered column | Visual proof of multiple implied edges in a centered stack |
| 04:19 | [assets/t0419_frame51.jpg](assets/t0419_frame51.jpg) | Example 3 before: form on left, "Other Contact" heading with phone and email in one row | Columns-within-a-column and redundant heading |
| 05:42 | [assets/t0542_frame67.jpg](assets/t0542_frame67.jpg) | Example 3 before and after side by side | After: heading gone, contact items stacked on one edge |

## Practical rules for improving existing UIs

Derived from this video only. Each is the presenter's stated guidance unless marked (observed).

1. **One alignment per neighbourhood.** If a block is left-aligned, the blocks beside or near it should not be center-aligned. Convert the centered block to match. [02:48-03:06], [06:05-06:21]
2. **Every column needs at least one straight edge.** Check that the elements in a column (logo, heading, body, buttons) start on the same vertical line. [03:38-04:04]
3. **Guide test.** Drop a guide on a column's left extreme and right extreme. If elements need more than one guide per side, the column is not well defined. [01:36-01:44], [02:20-02:40], [03:47-04:04]
4. **Centered multi-line text does not form an edge.** Varying line lengths make both sides ragged, so do not rely on a centered block to define a column next to other content. [01:44-01:53]
5. **Align text toward its partner.** For a text block left of an image, right-aligning the text gives a firm edge facing the image. Presenter labels this optional and a matter of taste. [01:22-01:34], [05:51-06:05]
6. **Put accent elements on the shared edge.** Icons, arrows and rules should sit on the column's alignment line, and can be extended to make that line explicit. [01:28-01:34], [01:57-02:07]
7. **Move the whole control group to the edge.** When re-aligning a centered column, move logo, paragraphs and button group together so all start on the same line. [03:09-03:19]
8. **Re-check the gutter after re-aligning.** Left-aligning a previously centered column shifts its visual start; nudge the column closer to its neighbour if the gap now looks too wide. [03:15-03:19]
9. **No columns inside a column without need.** Short list-like items (phone, email, similar) should be stacked vertically, not placed side by side. [04:14-04:29], [05:04-05:34]
10. **Prefer vertical scanning for list items.** Reading down a list is easier than reading across a row. [05:34-05:46]
11. **Remove headings that restate obvious context.** If a nearby heading already establishes what the section is, delete the secondary heading. [04:29-05:04]
12. **Full-width row containers.** Repeated rows or cards in a column should share both left and right edges with the column. (Praised as correct in the example, not presented as a fix.) [02:25-02:37]
13. **Severity ordering.** Mixed left/center alignment in adjacent blocks is the firm rule; a lone centered text block beside an image is a tolerable, lower-priority issue. [01:05-01:17], [05:51-06:21]

## Uncertainty and limitations

- **Scope is narrow.** The video covers horizontal text/element alignment in three mock-ups. It does not cover grids, spacing scales, baseline alignment, optical alignment, vertical rhythm, responsive behaviour or accessibility. None of those should be attributed to it.
- **No numeric values.** No pixel sizes, ratios or spacing values are spoken, and the Figma property panel is unreadable at 1024 px. Nothing numeric in this file comes from the video.
- **Auto-generated captions.** Lowercase, unpunctuated, with errors (stray "i", "left the line" for "left aligned", "rollers" for "rulers", "this eye" likely "this I"). Meaning was clear in every instructional passage; no passage was dropped as unintelligible.
- **Timestamps.** Spoken-point timestamps come from caption cue times (accurate to a few seconds). Frame times are approximate to ~5 s because of uniform sampling.
- **Frame gaps.** One frame per ~5.2 s, so the intermediate drag/align steps between sampled frames were not seen. Before/after states were seen clearly for all three examples.
- **Inferred, not stated:**
  - The "Additional frame observations" list (paragraph width kept, button pair kept horizontal, Send button unchanged, icon/label two-edge list).
  - That the Example 3 contact items are placed level with the first form field (read from frame 05:42; the presenter only says they are simplified).
  - Rule 12 and rule 13 are generalisations of remarks, not explicit instructions.
  - "Tighten the gutter" (rule 8) rests on one passing remark about dragging the column a bit closer.
- **Example 1 is self-described as preference.** The presenter says the original would be acceptable; treat rules 5 and 6 as optional style choices.
- **Mock-ups, not live sites.** All examples are the presenter's own Figma artboards with placeholder text; no real product UI is critiqued.
- **Not reviewed:** the 20 hook-microscope frames (0-10 s) and the audio itself (no Whisper pass).
