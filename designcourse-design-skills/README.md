# designcourse-design-skills

Agent skills for lifting the design quality of **existing** web UIs: fix typography, hierarchy, alignment and spacing, borders and shadows, and color, inside the app's own tokens, brand and framework.

The guidance is an original synthesis of lessons observed in seven DesignCourse videos by Gary Simon, plus standard accessibility practice. It is not affiliated with or endorsed by Gary Simon or DesignCourse. No transcripts are reproduced; every rule traces to a timestamp in [EVIDENCE.md](EVIDENCE.md).

## What is in here

```
skills/
  lift-ui/         router: modes, process, approval gate, report format
    references/audit-checklist.md
    scripts/probe.mjs      screenshots + page measurements (needs playwright)
    scripts/contrast.mjs   WCAG contrast ratio, no dependencies
  lift-type/       typography and typographic hierarchy
  lift-layout/     alignment, spacing, grouping, density, actions
  lift-surfaces/   borders, dividers, shadows, containers
  lift-color/      contrast, neutrals, accent discipline, themes
EVIDENCE.md        rule id -> video timestamp, basis, and source limitations
research/          one extraction per source video (paraphrased notes)
evals/             fixture, six eval cases, acceptance criteria, one recorded run
tests/             structural tests (node --test)
.claude-plugin/    plugin manifest (name: ui-lift)
```

## Design of the system

- **Five skills, not seven.** The seven videos overlap heavily, so they collapse into four specialists by the kind of decision being made, plus one router. Borders and shadows are one skill because they answer the same question (what separates this from that); the button and content-heavy-layout videos feed several skills instead of owning one.
- **Router plus specialists.** `lift-ui` decides the mode, reads the design system, gates risky changes, validates and reports. Each specialist holds only diagnostics and rules for its dimension and can be invoked directly.
- **Small.** Each `SKILL.md` is under 120 lines. Rule ids such as `(T4)` are the only traceability cost at run time; the evidence lives in `EVIDENCE.md`, which the agent does not need to load.
- **Measured, not asserted.** Findings need a location, a number and a rule id. The two scripts supply most of the numbers.
- **Opinionated about restraint.** Remove, then differentiate, then add. Brand color, typeface, structure, copy and new styles are behind an approval gate.

## Use

Copy the five folders in `skills/` into a project's `.claude/skills/` (or any agent-skills directory), or load this directory as a Claude Code plugin. Nothing is installed globally by this package.

```text
Audit the design of the billing page. Don't change anything.          -> lift-ui, audit mode
Fix the typography on /settings, everything looks the same.           -> lift-type
The dashboard is cluttered and nothing lines up.                      -> lift-layout
Too many borders and the shadows look heavy.                          -> lift-surfaces
Text is hard to read in dark mode.                                    -> lift-color
Elevate the onboarding flow. Keep it recognisably ours.               -> lift-ui, full mode
```

Scripts, run from the app's directory:

```bash
node path/to/skills/lift-ui/scripts/probe.mjs http://localhost:3000/settings --label before --out .lift
# ...make changes...
node path/to/skills/lift-ui/scripts/probe.mjs http://localhost:3000/settings --label after --out .lift
node path/to/skills/lift-ui/scripts/contrast.mjs '#757575' '#ececec'
```

`probe.mjs` exits with code 3 and an install hint if `playwright` cannot be resolved from the current directory.

## Tests

```bash
node --test tests/
LIFT_PW_DIR=/dir/with/playwright node --test tests/   # also runs the browser test
```

See [evals/README.md](evals/README.md) for the behavioural evals, the fixture's seeded defects and the acceptance criteria.

## Sources and their limits

| Video | URL | Extraction status |
|---|---|---|
| Typographic Visual Hierarchy in UI Design (4 Examples) | https://www.youtube.com/watch?v=u9XSmlZhYq4 | succeeded |
| 5 Types of Shadows for your UI Designs | https://www.youtube.com/watch?v=5qL8Zg6hISU | succeeded |
| STOP Doing THIS to your Designs! (BORDERS) | https://www.youtube.com/watch?v=Mv8Pjtvujno | succeeded |
| Fixing your BAD Alignment! Stop doing this one thing.. | https://www.youtube.com/watch?v=yxPk82xV7bA | succeeded |
| Color Crash Course for UI/UX Designers [By Example] | https://www.youtube.com/watch?v=Ewj85eIda74 | succeeded |
| The most IMPORTANT design lesson, taught by a BUTTON! | https://www.youtube.com/watch?v=KjRPX5EeKFA | partial: short overview, no stated values |
| How do you Design a Layout with a TON of Content?! | https://www.youtube.com/watch?v=sfkF8aBT4dw | succeeded |

- Transcripts were YouTube auto-generated captions in every case. None was human-verified, and a Whisper cross-check was unavailable.
- Frames were uniform samples, because scene detection failed on the installed ffmpeg. Short on-screen states may have been missed.
- Numbers in the research notes were mostly read from small on-screen text in 720p video. The skills use direction and ratio from them, not the literal values.
- The videos do not cover responsive behaviour, interaction states, keyboard use or non-text contrast. Rules on those are marked `standard` in `EVIDENCE.md` and cite WCAG 2.2.
- Three sources named in the original brief were never fetched and contribute nothing: the Epic Typography Tutorial video (`1GPoUrf0MXg`), the DesignCourse blog post on typographic hierarchy, and a freeCodeCamp article.

Each `research/<video-id>/extraction.md` has its own access record and limitations section. The reference frames those notes link to under `assets/` are stills from the videos and from third-party designs shown in them; whether they are present in a given copy of this package is noted in `research/README.md`.
