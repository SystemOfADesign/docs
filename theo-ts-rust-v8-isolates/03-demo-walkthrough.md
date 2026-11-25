# 03 - Demo walkthrough (frame-by-frame forensics)

**One line:** Theo shows two builds of a Bolt-like "prompt -> agent -> live app" tool whose whole dev loop (files, typecheck via ts-rust WASM, bundle, server code, DB) runs inside one Node process; the Opus-built "isolate" sits at 259 MB RSS / 0-3% CPU, the "Astra"-built "Isolate Studio" (esbuild) at ~424 MB, and the agent's 13 tool calls cost 178 ms total against 114.4 s of waiting on the model.

Labels: SAID = Theo says it. SHOWN = readable on screen. INFERRED = my reasoning, not fact.
Source limits: video is 1280x720; readings come from 1 s frames plus 4 fps upscaled crops. Unreadable items are listed in "Could not read".

## Contents

- [What the demo is](#what-the-demo-is)
- [When each UI is on screen](#when-each-ui-is-on-screen)
- [Timestamped walkthrough](#timestamped-walkthrough)
- [UI transcription: "isolate" (Opus build)](#ui-transcription-isolate-opus-build)
- [UI transcription: "Isolate Studio" (Astra build)](#ui-transcription-isolate-studio-astra-build)
- [All metrics in one table](#all-metrics-in-one-table)
- [Side by side: the two builds](#side-by-side-the-two-builds)
- [Said vs shown mismatches](#said-vs-shown-mismatches)
- [What the UI reveals about the architecture](#what-the-ui-reveals-about-the-architecture)
- [Other on-screen evidence (just-bash, tabs, T3 Code)](#other-on-screen-evidence)
- [Open questions the video does not answer](#open-questions-the-video-does-not-answer)
- [Could not read](#could-not-read)

## What the demo is

- SHOWN: a chat panel on the left ("Describe an app or a change"), a live preview of the generated app on the right, Preview/Code tabs, and a process-metrics bar.
- SHOWN: the in-app agent is `gpt-6.1-sol`; it lists, reads, writes and edits files, runs a build (type check, bundle, deploy), calls the app's server functions and reads logs. Every file op takes 0.1-0.2 ms, a full build 92 ms.
- SAID [32:42-33:20]: the agent, the "computer" it works on, the type check, the compile and the running app all live in one V8 isolate; no VM or container per agent.
- SAID [32:50]: this instance runs "in Node on a server technically"; could run in a browser; [39:54] would behave the same with the server's filesystem read-only; [40:00] could run in a Cloudflare Worker.
- SHOWN: two separate builds of the same idea exist. "isolate" (SAID built by Opus) and "Isolate Studio" (SAID built in "Astra", uses esbuild, ~1.6x the RAM on screen).

## When each UI is on screen

Confirmed by template-matching all 572 five-second frames against both UIs; no other appearances.

| UI | Windows (video time) |
|---|---|
| Isolate Studio | 02:10-02:14 (teaser), 31:37-31:44, 33:57-34:19 |
| isolate | 31:45-31:49 (empty starter), 32:43-33:56 (main demo), 34:20-35:13, 39:48-41:26 (idle backdrop) |
| T3 Code threads about the demo | ~42:10 (sidebar), 46:36-46:41 (Cloudflare port thread) |

## Timestamped walkthrough

| Time | On screen (SHOWN) | What Theo says (SAID) | What it tells us (INFERRED) |
|---|---|---|---|
| 02:10-02:14 | Isolate Studio, split view: chat, code pane (`client.tsx`), preview "Project board". Header: PROCESS RAM 422.6 MB, CPU 0.3-0.4%, TYPECHECK 162 ms, BUNDLE 116 ms, Built. | Has a "secret reason" for ts-rust and a working demo; calls it a "little vibe coding demo". | Teaser uses the heavier Astra build. RAM differs from 31:37 (423.6 MB), so it is a separate capture of the same session. |
| 31:25-31:36 | Cloudflare homepage. | You cannot run an agent in the isolate layer: no files, no dev server, no TypeScript check. Then: "It looks like I did exactly that." | Sets up the reveal. |
| 31:37 | Isolate Studio, same split view as teaser. RAM 423.6 MB, CPU 0.3%. | This is the demo built "in Astra"; it has decisions that waste memory. | - |
| 31:38-31:44 | Code pane toggled off, preview full width. RAM 424.1 then 423.8 MB; CPU 0.8% for one second then 0.3-0.4%. | Will switch to the version Opus made, a better presentation. | Toggling a pane costs under 1% CPU on the process. |
| 31:45-31:49 | "isolate" in empty starter state. Three suggested prompts. Preview shows a "Starter" app. Footer: built 195ms, memory 186MB, cpu 0%, ts-rust check 180ms. | Needs to show one last reference first. | 186 MB is the idle baseline before any agent run. First (cold) check is 180 ms. |
| 31:50-31:52 | Google results for "just-bash" (justbash.dev says v3.6.0; GitHub; npm). | Introduces just-bash, by Malte at Vercel. | - |
| 31:53-31:57 | github.com/vercel-labs/just-bash: 4.3k stars, 273 forks, 460 commits, used by 870. | "Has become a pretty legit library." | - |
| 31:58-32:00 | Monorepo README: badges v3.6.0, Apache-2.0, 5.6M npm downloads/month; package described as a simulated bash environment with virtual filesystem. | Purpose: give agents a full fake bash in memory, in JavaScript. | - |
| 32:01-32:07 | `packages/just-bash/README.md` (743 lines, 29 KB): virtual bash, in-memory filesystem, TypeScript, for AI agents; optional curl, Python, JS/TS, sqlite. | Import Bash, then run most bash commands against fake files and fake processes. | - |
| 32:08-32:41 | Quick Start scrolled into view; 32:11-32:16 he highlights the five lines `new Bash()` ... `bash.exec(...)`. Text below: each exec gets isolated shell state, filesystem is shared across calls. | just-bash alone is not enough to build an app: you also need compile and type check, i.e. tsgo, tsc or now ts-rust. | The gap just-bash leaves (no type checker in-isolate) is the gap ts-rust WASM fills. |
| 32:42 | Browser tab sidebar opens over the README (tab list below). | "Now with TypeScript Rust, we can do really stupid things." | - |
| 32:43 | Switches to "isolate" tab. Agent is mid-run: "Working - 1m 46s", "10 steps - 176ms - 1 failed". Preview already shows the kanban app shell with 0 tasks. URL bar starts `bb-1.porp...`. | GPT-6.1 Sol built a full app, all in a V8 isolate. | Run was started ~1m46s earlier in this (second) "isolate" tab or the stream was cut; the empty tab at 31:45 is not this run. Host is not localhost. |
| 32:44 | Step 11 appears: "Called seed() 0.9ms". Preview updates to "10 tasks" with cards in every column. | - | The agent invokes the app's own server function as a tool; preview reflects the DB write within the same second. |
| 32:46-32:49 | "Calling..." then "Called tasks() 0.4ms", then "Read logs 0.1ms". Now 13 steps, 178ms. Timer 1m 49s -> 1m 52s. | "This one is running in Node on a server technically"; could run in the browser. | Agent verifies its own work: reads back data, then reads logs. |
| 32:50-32:51 | Step log collapses; final summary text streams in; input returns to idle placeholder. CPU reads 3% at 32:51 (highest value seen anywhere). | "This all just ran and worked." | The 3% blip coincides with the end of the model stream and UI update. |
| 32:53-33:04 | He scrolls the preview and drags cards between Backlog and To do. Column counts change live: 3/3 -> 2/4 -> 4/2 -> 6/1 (mid-drag) -> settles 3/3. CPU 0-1%. | Everything, agent to app compute, ran "on my isolate". | Drag = client RPC to the in-process server; cost is not visible on the CPU meter. |
| 33:05-33:21 | Static. Footer: built 92ms, memory 259MB, cpu 0%, ts-rust check 85ms. | "Used under 216 megs of RAM and it peaked at like 4% CPU." | Spoken numbers do not match the screen (see mismatch table). |
| 33:22-33:24 | Clicks "stats for nerds": three-column panel (This process / Build 3 / Agent). "js heap, main isolate" 25MB at 33:22, 24MB from 33:23. | Agent plus its computer "all together for pennies". | Heap moved 1 MB while idle: GC running. |
| 33:25 | Scrolls the panel: "Versus a process each" table fully visible, plus a "copies 0 / +10 / +100" control. | - | Built-in comparison against spawning a checker process per build. Control never clicked. |
| 33:26-33:56 | Panel closed; 33:29 preview scrolled back to top. | Doing this with Go "would suck"; WebAssembly is a bad fit for Go, great fit for Rust. | - |
| 33:57-34:04 | Switches to Isolate Studio. RAM 423.8 MB, CPU 0.2-0.3%. Cursor rests beside the "Build passed - ts-rust WASM" step; chat scrolled a few pixels. | Astra chose esbuild as the bundler. | Both builds use ts-rust WASM for checking; the difference is the bundler. |
| 34:05-34:19 | Text-selects the "PROCESS RAM 423.8 MB" readout. CPU 0.2-0.4%. | Idle, it uses 2x the RAM of the other version, because a Go-based package like esbuild "eats memory". | On-screen ratio is 423.8 / 259 = 1.64x. |
| 34:20-35:13 | Back to "isolate", idle, board in the order he left it. Footer unchanged (259MB, 0%). CPU sparkline now flat. | Cloudflare, Chrome and Node all use V8 isolates. "Nothing here left RAM. Nothing here left V8." The whole dev loop exists in V8. | No new evidence on screen; these are claims. |
| 35:14 | Excalidraw (hardware/kernel/OS stack drawing begins). | "Let's talk about how computers work." | End of main demo. |
| 39:48-41:26 | "isolate" again, idle, unchanged: 259MB, cpu 0% in every sampled frame. Nothing is clicked. | Flip the server filesystem to read-only and it runs the same; could run in a Cloudflare Worker; idle isolates cost only "a bit of RAM"; waiting on tokens costs no CPU. | Read-only filesystem and Workers are asserted, not demonstrated. The 0% idle CPU on screen does support the "idle costs no CPU" point. |
| 41:27-41:28 | Tab sidebar again, then Excalidraw isolate-stack drawing. | Mentions chat asking about "Lakebed"; "I won't say more yet". | - |
| 41:29-41:32 | His stream chat dashboard. One viewer asks whether the shown memory includes the virtual filesystem storage; another asks where the isolate demo is. | - | The VFS-memory question is not answered on screen. |
| ~42:10 | T3 Code sidebar: two threads titled "Typesafe App Builder in a V8 Isolate" in project `wasm-app-building`. | (Talking about ts-rust prompts.) | Two threads = two builds (mapping below, INFERRED). |
| 46:36-46:41 | T3 Code thread "Typesafe App Builder in a V8 Isolate", model picker "Claude Opus 5.5", effort High, "Working for 2m 8s -> 2m 12s". Opus is porting to Workers (details below). | Wanted to see if it runs on Cloudflare, "so I just told Opus, go do it. And it probably will." | The Cloudflare version was unfinished at recording time. |

## UI transcription: "isolate" (Opus build)

### Chrome and layout (SHOWN, 31:46 and 32:45)

| Element | Exact reading |
|---|---|
| Header left | logo, `isolate`, model label `gpt-6.1-sol`, button `New app` |
| Right pane tabs | `Preview` (active throughout), `Code` (never opened), path label `/preview/main` |
| Starter chat | "What should we build?" with suggestions: "A kanban board with drag and drop", "A habit tracker with streaks", "A shared grocery list with categories" |
| Input placeholder | idle: "Describe an app or a change"; during run: "Working..." with a stop button |
| Starter preview | heading "Starter", one text input "Say something" |
| Prompt used | "A kanban board with drag and drop" |
| Generated app | "boardroom / Acme workspace", breadcrumb Workspace > Projects, title "Product board", Board/List toggle, "10 tasks", search, "All priorities" filter, columns Backlog / To do / In progress / Done, cards with tag, title, description, priority, assignee initials |
| Agent's closing summary | paraphrase: dark kanban with drag-and-drop between columns and reordering; create/edit/delete, priorities, teammates, search, filter, list view; sample tasks included |

### Full step log (SHOWN, complete at 32:49)

Header: `13 steps - 178ms - 1 failed`. Timer at completion of step 13: `Working - 1m 52s`.

| # | Step | Time | First visible |
|---|---|---|---|
| 1 | Listed files | 0.1ms | 32:43 |
| 2 | Read server/index.ts | 0.2ms | 32:43 |
| 3 | Read client/index.tsx | 0.1ms | 32:43 |
| 4 | Wrote server/index.ts | 0.2ms | 32:43 |
| 5 | Wrote client/index.tsx | 0.1ms | 32:43 |
| 6 | Edited client/index.tsx | 0.2ms | 32:43 |
| 7 | Edited client/index.tsx | 0.1ms | 32:43 |
| 8 | Build failed - 1 type error (red) | 83ms | 32:43 |
| 9 | Edited client/index.tsx | 0.1ms | 32:43 |
| 10 | Built - type check, bundle, deploy | 92ms | 32:43 |
| 11 | Called seed() | 0.9ms | 32:44 |
| 12 | Called tasks() | 0.4ms | 32:48 ("Calling..." at 32:46) |
| 13 | Read logs | 0.1ms | 32:49 |

- Sum of the 13 displayed times = 177.5 ms; UI total 178ms; stats panel "tools in this isolate 178ms". Consistent.
- The two builds are 175 of the 178 ms. All 11 non-build steps together: 2.5 ms.
- Running header values as steps arrive: 10 steps/176ms (32:43), 11/177ms (32:44), 12/177-178ms (32:46-32:48), 13/178ms (32:49).

### Footer status bar (SHOWN)

| State | built | memory | cpu | ts-rust check | Time |
|---|---|---|---|---|---|
| Empty starter | 195ms | 186MB | 0% | 180ms | 31:45-31:49 |
| During and after kanban run | 92ms | 259MB | 0-1%, one reading of 3% at 32:51 | 85ms | 32:43-35:13, 39:48-41:26 |

- Per-second CPU readings 32:43-33:04: 1,0,0,0,1,0,1,1,3,1,0,0,0,1,1,1,1,1,0,0,1,1 (%). Small digits; a 0 vs 1 misread is possible, the single 3 is clear. From 33:05 onward every frame reads 0%.
- Memory reads 259MB in every frame from 32:43 to 41:26; the sparkline shows one step up (the run).
- Right end of the bar: toggle "stats for nerds".

### "stats for nerds" panel (SHOWN, 33:22-33:25, complete)

**This process**

| Row | Value |
|---|---|
| memory (rss) | 259MB |
| js heap, main isolate | 25MB at 33:22, 24MB from 33:23 |
| js heap, ts-rust worker | 4.9MB |
| cpu | 0% (sparkline with one small spike) |
| cpu split | main 0% - ts-rust 0% - other 0% |
| rpc calls | 131 - 0.2ms avg |
| database | 10 rows - 2.6KB |

**Build 3**

| Row | Value |
|---|---|
| passed | 92ms (bar: long purple segment, thin white, short blue) |
| ts-rust check | 85ms |
| wasm memory peak | 75MB |
| bundle - 35KB client | 0.2ms |
| tailwind - 17KB | 5.6ms |
| load into vm | 1.4ms |

85 + 0.2 + 5.6 + 1.4 = 92.2 ms, matching "passed 92ms".

**Agent**

| Row | Value |
|---|---|
| (bar) | almost entirely grey, sliver of purple at the right end |
| waiting on the model | 114.4s |
| tools in this isolate | 178ms |
| turns | 13 |
| tokens in / out | 78.3k / 5.2k |
| reasoning tokens | 156 |

**Versus a process each** (revealed by scrolling at 33:25)

| Row | wall | cpu | mem |
|---|---|---|---|
| ts-rust wasm (highlighted) | 85ms | 81ms | 79MB |
| tsc 6 (JS) | 291ms | 631ms | 142MB |
| tsc 7 (Go) | 56ms | 111ms | 46MB |
| tsc-rs native | 42ms | 42ms | 43MB |
| Node container | 541ms | - | 13MB |

Below the table: `copies 0` with buttons `+10` and `+100`. Never clicked. Nothing further below is shown.

## UI transcription: "Isolate Studio" (Astra build)

| Element | Exact reading (SHOWN) |
|---|---|
| Header left | pane toggles `Code` and `Preview`, then `Resources`, then `+` |
| Header metrics | `PROCESS RAM 423.8 MB`, `PROCESS CPU 0.2-0.4%` (0.8% once), `TYPECHECK 162 ms`, `BUNDLE 116 ms`, `Built` with a check mark |
| Chat, user turn ("YOU") | asks to make it more minimal and space efficient (a follow-up edit, not the first prompt) |
| Step list (all checked) | `read files`, `write files`, `build`, `Build passed - ts-rust WASM`, `inspect preview`, `read logs` (no per-step timings) |
| Chat, model turn ("GPT-6.1 SOL") | paraphrase: board made more compact; sidebar, header, footer removed; spacing reduced; descriptions one line; controls kept; existing tasks unchanged; build and runtime checks passed |
| Input | "What do you want to build?", model picker `GPT-6.1 Sol`, send button |
| Code pane (02:10-02:14, 31:37) | file tabs `server.ts`, `client.tsx` (active), `styles.css`; button `Build`; 28 lines of `client.tsx` |
| Right pane tabs | `Preview` (active), `Database`, `Logs` |
| Generated app | "Project board", "3 total tasks, 1 completed, 33% complete", search, columns Backlog 1 / To do 0 / In progress 1 / Done 1 |

- Never opened in the video: `Resources`, `Database`, `Logs`, `server.ts`, `styles.css`.
- `client.tsx` as shown (structure only, lines are cut off on the right): imports `useEffect, useState` from `react`; `createRoot` from `react-dom/client`; `createClient` from `@isolate/client`; a type-only import `api as ServerApi` from `./server`; then `const api = createClient<typeof ServerApi>()`; a `Task` type derived from the return type of `api.list`; a `refresh()` that awaits `api.list({})`; `create`, `move(id, status)`, `save` handlers; ends by rendering `<App>` into `#root`.

## All metrics in one table

| Metric | Value | Timestamp | Build |
|---|---|---|---|
| Process memory, idle starter | 186MB | 31:45-31:49 | isolate |
| Build time, starter | 195ms | 31:45-31:49 | isolate |
| ts-rust check, starter (first) | 180ms | 31:45-31:49 | isolate |
| Process memory (rss), after run | 259MB | 32:43-41:26 | isolate |
| CPU, observed range | 0-3% (3% for one second at 32:51) | 32:43-33:04 | isolate |
| CPU, idle | 0% | 33:05-41:26 | isolate |
| JS heap, main isolate | 24-25MB | 33:22-33:24 | isolate |
| JS heap, ts-rust worker | 4.9MB | 33:22 | isolate |
| WASM memory peak | 75MB | 33:22 | isolate |
| Failed build (1 type error) | 83ms | 32:43 | isolate |
| Passing build (Build 3) | 92ms | 32:43, 33:22 | isolate |
| ts-rust check inside Build 3 | 85ms | 33:22 | isolate |
| Bundle, 35KB client | 0.2ms | 33:22 | isolate |
| Tailwind, 17KB | 5.6ms | 33:22 | isolate |
| Load into vm | 1.4ms | 33:22 | isolate |
| RPC calls | 131, 0.2ms avg | 33:22 | isolate |
| Database | 10 rows, 2.6KB | 33:22 | isolate |
| Agent steps | 13 (1 failed) | 32:49 | isolate |
| Tool time total | 178ms | 32:49, 33:22 | isolate |
| Waiting on the model | 114.4s | 33:22 | isolate |
| Turns | 13 | 33:22 | isolate |
| Tokens in / out | 78.3k / 5.2k | 33:22 | isolate |
| Reasoning tokens | 156 | 33:22 | isolate |
| Per-process comparison: ts-rust wasm | 85ms wall / 81ms cpu / 79MB | 33:25 | isolate |
| Per-process comparison: tsc 6 (JS) | 291ms / 631ms / 142MB | 33:25 | isolate |
| Per-process comparison: tsc 7 (Go) | 56ms / 111ms / 46MB | 33:25 | isolate |
| Per-process comparison: tsc-rs native | 42ms / 42ms / 43MB | 33:25 | isolate |
| Per-process comparison: Node container | 541ms / - / 13MB | 33:25 | isolate |
| PROCESS RAM | 422.6 MB | 02:10-02:14 | Isolate Studio |
| PROCESS RAM | 423.6 -> 424.1 -> 423.8 MB | 31:37-31:44 | Isolate Studio |
| PROCESS RAM | 423.8 MB | 33:57-34:19 | Isolate Studio |
| PROCESS CPU | 0.2-0.4%, single 0.8% at 31:38 | all windows | Isolate Studio |
| TYPECHECK | 162 ms | all windows | Isolate Studio |
| BUNDLE | 116 ms | all windows | Isolate Studio |

Derived (INFERRED, arithmetic on SHOWN values):

- Tool time is 0.16% of model wait (178 ms vs 114.4 s).
- The run added 73 MB to the process (186 -> 259 MB), close to the 75 MB WASM peak.
- JS heaps (24 + 4.9 MB) plus WASM peak (75 MB) is about 104 MB; the other ~155 MB of RSS is Node itself, code and native memory.
- 13 turns and 13 steps: roughly one tool call per model turn, about 8.8 s of model wait per turn.

## Side by side: the two builds

| | "isolate" | "Isolate Studio" |
|---|---|---|
| Who built the tool | SAID: Opus [31:45] | SAID: "Astra" [31:40, 33:53] (caption spelling unverified) |
| Agent model inside the tool | SHOWN: `gpt-6.1-sol` | SHOWN: `GPT-6.1 Sol` |
| Type checker | SHOWN: ts-rust (footer "ts-rust check", "ts-rust wasm" row) | SHOWN: "Build passed - ts-rust WASM" |
| Bundler | Not named. SHOWN: bundle 0.2ms for 35KB client, separate tailwind step | SAID: esbuild [33:55] |
| RAM on screen | 259MB (186MB before the run) | 422.6-424.1 MB |
| CPU on screen | 0-3%, integer display | 0.2-0.8%, one decimal |
| Typecheck ms | 85 (180 on first/cold) | 162 |
| Bundle ms | 0.2 (+5.6 tailwind, +1.4 load into vm) | 116 |
| Total build | 92ms | not shown as one number (162 + 116 = 278 ms if additive, INFERRED) |
| Project files | `server/index.ts`, `client/index.tsx` | `server.ts`, `client.tsx`, `styles.css` |
| Step log | 13 lines with ms timings, failed build in red, collapsible | 6 checked lines, no timings |
| Metrics UI | footer bar + "stats for nerds" panel | header bar only |
| Extra tabs | Preview / Code | Code / Preview / Resources; Preview / Database / Logs |
| App on screen | "Product board", 10 seeded tasks | "Project board", 3 tasks |
| Prompt on screen | first prompt: kanban board | follow-up: make it more minimal |

Caveat (INFERRED): the two tools are showing different generated apps at different stages, so 85 vs 162 ms and 259 vs 424 MB are not a controlled comparison of bundlers.

## Said vs shown mismatches

| # | SAID | SHOWN | Note |
|---|---|---|---|
| 1 | "under 216 megs of RAM" [33:12] | 259MB in the footer and in "memory (rss)" in every frame 32:43-41:26; 186MB only in the empty starter | 216 never appears on screen. Origin unknown. |
| 2 | "peaked at like 4% CPU" [33:17] | Highest reading in any frame: 3% (32:51). Otherwise 0-1%. | Not contradicted (run began before the tab was shown), but 4% is not visible. |
| 3 | Astra build idles at "2x the RAM" [~34:05] | 423.8 MB vs 259MB = 1.64x | 2x only holds against his spoken 216 (1.96x) or the 186MB baseline (2.28x). |
| 4 | App is "entirely functioning all in a V8 isolate" [32:45] | Panel lists two JS heaps: "main isolate" and "ts-rust worker"; plus "load into vm" | At least two isolates in one process, not one. Still one process, no VM. |
| 5 | Doing this with Go "would suck" [33:40] | "Versus a process each": tsc 7 (Go) as a process is 56ms / 46MB, faster and smaller than ts-rust wasm at 85ms / 79MB | The table has no Go-compiled-to-WASM row, so the WASM claim itself is not measured on screen. The point that survives: a native process cannot be spawned inside an isolate at all. |
| 6 | esbuild is why the Astra build uses more memory [33:55-34:14] | Only whole-process RAM is shown; no breakdown, Resources tab never opened | Attribution is a claim, not shown. |
| 7 | Read-only filesystem would change nothing [34:48, 39:54] | Never demonstrated | Claim only. |
| 8 | Could run entirely in a Cloudflare Worker [40:00]; "it probably will" [46:40] | 46:37: port still in progress; Opus is asking whether the account has "Worker Loader" access | Unproven in the video. |
| 9 | "Nothing here left RAM" [34:50] | No disk or network view is shown | Unverifiable from the video. The model call itself necessarily leaves the process over the network (INFERRED). |
| 10 | Presents the build as live | At 32:43 the timer already reads 1m 46s while the same-named tab was an empty starter at 31:45-31:49 | Two "isolate" tabs exist in the sidebar; the run was started off-screen or the stream was cut (INFERRED). |

## What the UI reveals about the architecture

Every item: the hint is INFERRED, the evidence is SHOWN.

| # | INFERRED | SHOWN evidence | Frame |
|---|---|---|---|
| 1 | The host is one Node process and the numbers are whole-process numbers | "This process", "memory (rss)"; Studio labels "PROCESS RAM / PROCESS CPU"; SAID "running in Node on a server" | 33:22, 31:38 |
| 2 | ts-rust runs in its own worker thread, i.e. a second V8 isolate in the same process, not on the main thread | "js heap, ts-rust worker 4.9MB" next to "js heap, main isolate 24MB"; CPU split "main - ts-rust - other" | 33:22 |
| 3 | The type checker is WASM with its own linear memory outside the JS heap | "wasm memory peak 75MB" vs worker JS heap 4.9MB; row label "ts-rust wasm"; Studio step "ts-rust WASM" | 33:22, 33:25, 31:38 |
| 4 | The filesystem is an in-memory structure, not disk | File ops take 0.1-0.2 ms each | 32:49 |
| 5 | The agent has discrete tools, not a raw shell: list, read, write, edit, build, call server function, read logs | Step verbs "Listed / Read / Wrote / Edited / Build / Built / Called / Read logs"; no bash command lines appear | 32:49 |
| 6 | Type errors are fed back to the model, which fixes and rebuilds | "Build failed - 1 type error 83ms" -> "Edited client/index.tsx" -> "Built ... 92ms" | 32:43 |
| 7 | One "build" = type check + bundle + CSS + load, all in-process | "Built - type check, bundle, deploy"; Build 3 rows sum to 92 ms | 32:43, 33:22 |
| 8 | "Deploy" means evaluating the built server bundle in a VM context inside the same process | "load into vm 1.4ms" | 33:22 |
| 9 | The bundler in the Opus build is not esbuild-class work; likely a small JS-level linker with React supplied prebuilt | "bundle - 35KB client 0.2ms" vs Studio "BUNDLE 116 ms" | 33:22, 31:38 |
| 10 | Tailwind CSS is compiled in-process as a separate step | "tailwind - 17KB 5.6ms"; T3 Code line "Test Tailwind compile in workerd" | 33:22, 46:37 |
| 11 | Generated apps are full-stack: a server module and a client module | Files `server/index.ts` + `client/index.tsx`; `server.ts` + `client.tsx` | 32:49, 02:12 |
| 12 | Client talks to server through an end-to-end typed RPC proxy; server types are imported type-only into the client | `createClient` from `@isolate/client`, `import type { api as ServerApi } from './server'`, `createClient<typeof ServerApi>()`; thread title "Typesafe App Builder" | 02:12, 42:10 |
| 13 | RPC is dispatched inside the process, no network hop to another service | "rpc calls 131 - 0.2ms avg"; "Called seed() 0.9ms", "Called tasks() 0.4ms" | 33:22, 32:49 |
| 14 | The agent can call the app's server functions directly as a tool | "Called seed()", "Called tasks()" in the step log | 32:44-32:48 |
| 15 | The database is a tiny in-memory store owned by the process; the 10 rows are the 10 seeded tasks | "database 10 rows - 2.6KB"; preview "10 tasks" appears the second seed() is logged | 33:22, 32:44 |
| 16 | The preview is served by the same server under a path, not a separate dev-server port | Path label `/preview/main` beside the Preview tab | 31:46 |
| 17 | Multiple apps/sessions are a design goal | `New app` button; `/preview/main` naming; "copies 0 +10 +100" control | 31:46, 33:25 |
| 18 | Tool execution is noise next to inference; the box is idle 99.8% of the run | "waiting on the model 114.4s" vs "tools in this isolate 178ms"; cpu 0% | 33:22 |
| 19 | Roughly one tool call per model turn | turns 13, steps 13 | 33:22, 32:49 |
| 20 | Marginal memory of a run is roughly the WASM heap | 186MB before, 259MB after, WASM peak 75MB | 31:46, 33:22 |
| 21 | The "isolate" itself is far smaller than 259MB; most RSS is Node baseline | heaps 24 + 4.9 MB, WASM 75 MB, rss 259MB | 33:22 |
| 22 | The author's own framing is "in-isolate WASM vs spawning a process per check" | Table title "Versus a process each" with rows for tsc 6 (JS), tsc 7 (Go), tsc-rs native, Node container | 33:25 |
| 23 | The demo is hosted on a remote machine | URL bar begins `bb-1.porp...`, not localhost | 32:43 |
| 24 | The Workers port targets workerd with dynamic worker loading and Workers AI | T3 Code: "Test Tailwind compile in workerd"; Opus asks about "Worker Loader access"; pending answer shows "Workers AI GLM 5.3" | 46:37 |
| 25 | Model access for the Node demo goes through a proxy/tunnel | Opus asks whether the model should "go through a tunnel to cliproxy, or use a direct API key" | 46:37 |

## Other on-screen evidence

### just-bash pages (SHOWN, 31:50-32:42)

- Google result: justbash.dev, "just-bash v3.6.0", a TypeScript bash interpreter with in-memory filesystem for AI agents.
- Repo `vercel-labs/just-bash`: 4.3k stars, 273 forks, 10 watching, 460 commits, 189 branches, 24 tags, 78 issues, 105 PRs, used by 870, 54 contributors.
- Monorepo README: npm v3.6.0, Apache-2.0, 5.6M downloads/month; languages TypeScript 91.1%.
- Package README Quick Start: `npm install just-bash`; `new Bash()`; `bash.exec(...)` writing then reading `greeting.txt`; result has `stdout` and `exitCode`.
- Text under it: each `exec()` has isolated shell state (env, functions, cwd reset); the filesystem is shared across calls. Next heading: Custom Commands via `defineCommand`.
- SAID [39:35]: the demo is "inspired by just bash". Whether just-bash is a dependency of the demo is not shown.

### Browser tab list (SHOWN, 32:42-32:46 and 41:28)

In order: just-bash/packages/just-bash/README..., Isolate Studio, isolate, "Cloudflare: Build for the agent era", "pingdotgg/ts-rust: An experimenta...", "ts-rust/crates/ts_goport at main", "(21) Bun on X: 'In the next version...", "(20) Theo - t3.gg on X: 'Repo is h...", "(23) Theo - t3.gg on X: 'I got som...", isolate, Isolate Studio. Pinned above: "ts-rust - Excalidraw Plus", stream and chat tabs.

- Two "isolate" and two "Isolate Studio" tabs are open (INFERRED: one pair is a spare or earlier run).

### T3 Code (SHOWN, ~42:10 and 46:36-46:41)

| Thread | Project | Branch | Status | Icons |
|---|---|---|---|---|
| Typesafe App Builder in a V8 Isolate | wasm-app-building | `demo/isolate-app-builder` | Done | server-stack + Claude-style burst |
| Typesafe App Builder in a V8 Isolate | wasm-app-building | `t3/v8-isolate-app-builder-demo` | 1h | server-stack + OpenAI-style knot |

- INFERRED (unverified): the Claude-icon thread is the Opus build ("isolate"); the knot-icon thread is the "Astra" build ("Isolate Studio").
- 46:37 thread view, model picker "Claude Opus 5.5", effort "High", "Full access":
  - a finished command titled "Test Tailwind compile in workerd, then stop dev server";
  - Opus reports port 8799 is free and asks two things before starting "the Workers port": Worker Loader access on the Cloudflare account, and tunnel-to-cliproxy vs direct API key;
  - Theo's reply (paraphrase): wiped state is fine, wants the most compelling demo fast, use Cloudflare built-in inference or an OpenRouter key;
  - a pending question row: which model, which Cloudflare account; visible answer fragment "Workers AI GLM 5.3".

## Key frames

| Frame | Caption |
|---|---|
| [t02m12s](assets/t02m12s-teaser-isolate-studio-code-and-preview.jpg) | Teaser: Isolate Studio split view, 422.6 MB. |
| [t02m13s crop](assets/t02m13s-crop-studio-client-tsx-code-3x.jpg) | `client.tsx` with the typed `@isolate/client` RPC import. |
| [t31m38s](assets/t31m38s-isolate-studio-preview-header-metrics.jpg) | Isolate Studio header metrics and step list. |
| [t34m00s crop](assets/t34m00s-crop-studio-header-metrics-2x.jpg) | Studio header bar, 2x. |
| [t31m46s](assets/t31m46s-isolate-starter-state-186mb.jpg) | "isolate" empty starter: 186MB, check 180ms. |
| [t32m01s](assets/t32m01s-just-bash-readme-top.jpg) | just-bash package README, top. |
| [t32m12s](assets/t32m12s-just-bash-quickstart-highlighted.jpg) | just-bash Quick Start lines he highlights. |
| [t32m43s](assets/t32m43s-isolate-agent-working-and-tab-list.jpg) | Agent mid-run at 1m 46s, board empty, tab list open. |
| [t32m43s crop](assets/t32m43s-crop-browser-tab-list-3x.jpg) | Tab list and truncated URL `bb-1.porp...`, 3x. |
| [t32m44s](assets/t32m44s-isolate-seed-called-preview-fills.jpg) | "Called seed()" lands; preview shows 10 tasks. |
| [t32m49s](assets/t32m49s-isolate-full-step-log-13-steps.jpg) | Complete 13-step log. |
| [t32m49s crop](assets/t32m49s-crop-step-log-3x.jpg) | Step log with timings, 3x. |
| [t32m51s](assets/t32m51s-isolate-agent-done-cpu-3pct.jpg) | Run finished; the only 3% CPU reading. |
| [t32m55s](assets/t32m55s-isolate-drag-card-between-columns.jpg) | Dragging a card; column counts 2 / 4. |
| [t33m23s](assets/t33m23s-isolate-stats-for-nerds-open.jpg) | "stats for nerds" open. |
| [t33m24s crop](assets/t33m24s-crop-stats-panel-full-2x.jpg) | Stats panel, all three columns, 2x. |
| [t33m25s](assets/t33m25s-isolate-stats-versus-a-process-each.jpg) | Panel scrolled to "Versus a process each". |
| [t33m25s crop](assets/t33m25s-crop-stats-versus-table-2x.jpg) | Comparison table, 2x. |
| [t34m08s](assets/t34m08s-isolate-studio-ram-423mb-highlighted.jpg) | Studio RAM 423.8 MB selected while he says "2x". |
| [t41m28s](assets/t41m28s-excalidraw-isolate-stack-and-tab-list.jpg) | Isolate stack drawing with the tab list. |
| [t42m10s](assets/t42m10s-t3code-two-app-builder-threads.jpg) | T3 Code sidebar: two app-builder threads. |
| [t42m10s crop](assets/t42m10s-crop-t3code-sidebar-threads-3x.jpg) | Thread branches and provider icons, 3x. |
| [t46m37s](assets/t46m37s-t3code-opus-porting-to-cloudflare-workers.jpg) | Opus 5.5 mid-port to Cloudflare Workers. |

## Open questions the video does not answer

- Is the demo source public? No repo URL is shown; only branch names `demo/isolate-app-builder` and `t3/v8-isolate-app-builder-demo`.
- Is just-bash actually used, or only the inspiration? The step log shows file tools and no shell commands.
- Does 259MB include the virtual filesystem and DB? A viewer asks this at 41:30; no answer on screen.
- Where do "216 megs" and "4%" come from?
- What bundles the client in the Opus build (0.2 ms), and how are React and other npm packages resolved without an install step?
- What is the database: a JS object, SQLite in WASM, something else? Is it persisted anywhere?
- What isolates one generated app from another, and from the host? "load into vm" in Node is not a security boundary; nothing about tenant isolation is shown.
- What does the "copies +10 / +100" control compute? Never clicked, so per-tenant marginal cost is never shown.
- What is the "Node container 541ms / - / 13MB" row measuring (cold start of a container)? Label only.
- In the Astra build, does esbuild run as WASM in-process or as a native child process? If native, "nothing left V8" would not hold for that build, and process RAM would not even include it.
- Does it work with a read-only filesystem? Asserted twice, not demonstrated.
- Did the Cloudflare Workers port succeed? It was 2 minutes into a run at 46:37, blocked on Worker Loader access and model choice.
- How does the Code tab of "isolate" look, and what are Studio's Resources / Database / Logs tabs? Never opened.
- Which model or product is "Astra"? Only heard in captions; the knot icon suggests an OpenAI-family provider (INFERRED, unverified).
- Any relation to "Lakebed"? Theo declines to answer [41:26].

## Could not read

- URL bar at 32:43: only `bb-1.porp` visible; the rest is under the webcam overlay.
- Isolate Studio header, far right: one control hidden by the webcam (a trailing "t" is visible).
- `client.tsx` lines 6-9 and 18-25: cut off at the pane edge; server-side code never shown.
- T3 Code pending-question row at 46:37: truncated mid-word after "Which Cloudflare account should I de" and after "Theo P".
- Memory and CPU sparklines: shapes only, no axes.
- Source is 720p; no on-screen text was guessed. Anything not listed above was legible in upscaled crops.
