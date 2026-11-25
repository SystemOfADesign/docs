# 01 - Video overview

One line: Theo had agents port the TypeScript 7 (Go) compiler to Rust ("ts-rust" / `tsc-rs`), mainly so a fast type checker can run as WASM inside a V8 isolate, which he argues is the cheap place to run a coding agent's whole dev loop once inference gets cheaper than VMs.

Evidence labels: SAID = Theo says it, SHOWN = visible on screen, VERIFIED = checked against an external primary source, INFERRED = my reasoning. Nothing in this file is VERIFIED externally; fact-checking lives in `05-claims-fact-check.md`. Timestamps are `[MM:SS]`, read from 5 s frames, so on-screen times are accurate to about +/- 5 s.

## Source

| Field | Value |
|---|---|
| Title | You can rewrite typescript in rust for $420k |
| Channel | Theo - t3.gg |
| URL | https://www.youtube.com/watch?v=ND_kRgU_WlY |
| Duration | 47:40 |
| Upload date | 2026-10-10 (from the shared brief, not re-checked) |
| Format | Edited cut of a live stream (SHOWN: stream chat at [09:30], [28:25], [41:30]; X "Live" card titled "I rewrote ts in rust (and haiku 5.5 dropped)" at [09:55]) |
| Transcript | YouTube auto-captions; model and product names are garbled in places |

### Creator chapters

| Start | Chapter |
|---|---|
| 0:00 | Announcing TS-Rust |
| 2:29 | Sponsor (Qdrant) |
| 4:21 | History of TSC |
| 6:56 | Why the checker is complex |
| 9:15 | Case for Go and Rust |
| 13:24 | Inside the TS-Rust port |
| 17:27 | Benchmarks |
| 20:09 | Beyond performance |
| 22:55 | Future of AI infrastructure |
| 28:17 | Architecting for the agent era |
| 34:20 | Engineering behind the demo |
| 44:26 | Concluding thoughts |

## Timeline

| Time | What is said (SAID) | What is shown (SHOWN) | Why it matters |
|---|---|---|---|
| 00:00-02:29 | Announces ts-rust: compiler, checker and LSP in Rust. 5 months of agent work. About $400k of Codex tokens "got nowhere" (stalled near 84% compat), about $20k of Opus 5.5 got there in 2 weeks. He has read none of the code. 12.5x faster than TS 6, about 2x faster than TS 7 (tsgo). Bun's `bun check` is faster still. Teases a "secret reason" plus a demo. | His announcement tweet with a cost card ($420k+ total, $400,000+ for GPT-5.6 Sol + GPT 6 Astra, about $24,047 for Opus 5.5). README of `pingdotgg/ts-rust`. Repo page. README benchmark tables. Bun's `bun check` tweet. 5 s teaser of the isolate demo at about [02:15]. | Sets every headline number. Several are looser than the screen (see Mismatches). |
| 02:29-04:21 | SPONSOR: Qdrant vector search. | Qdrant site, GitHub repo, three demo apps (video search, issue search, thumbnail face search). | Sponsor read. No bearing on the argument. |
| 04:21-06:56 | TypeScript exists to add confidence to JS. `tsc` turns TS into JS. Stripping types is easy; esbuild (Go) made that and bundling fast. | Excalidraw board named "ts-rust" with typed notes; the `logUser` example; `evanw/esbuild` repo. | Splits the problem into "emit" (easy) and "check" (hard). |
| 06:56-09:15 | Type checking is where the time goes. Big codebases split emit and check paths (Twitch anecdote). The type system is Turing complete (Doom in types). Encoding JS semantics in a non-JS language is hard. | YouTube search for "doom typescript"; board line "Rewriting in a non-JS language would suck". | Explains why a checker port was long seen as infeasible. |
| 09:15-13:24 | Microsoft rewrote `tsc` in Go. Theo defends Go: flexibility, built-in concurrency, syntax close to JS, garbage collection. GC pauses do not matter for a multi-second batch job. | Stream chat guessing languages; his Feb 26 2024 tweets; a Feb 10 2026 reply to Melkey; board list "Flexibility / concurrency / syntax similar to js / garbage collection". | Sets up why Go was a good source for a Rust port, and why GC is fine for a CLI but bad for WASM. |
| 13:24-17:27 | Opus did not port from JS. It ported the Go port line by line, including a Rust re-implementation of parts of the Go standard library and goroutines. First build was 2-3x slower than Go. He set a goal of 2x faster and let it run 2 weeks on 6 Claude accounts. About $24k at API prices, about 925-983% of one account's weekly limit, about $500 of subscription value. Issues audit: 6 opened, 1 specific to ts-rust. | `crates/ts_goport` and `crates/ts_wasm`; `ts_goport/src/gostd` file list; `runtime.rs`; a quota dashboard; a T3 Code thread "ts-rust Token Cost and Weekly Usage"; the repo issues list. | The core "how". Also the main cost evidence. |
| 17:27-20:09 | Benchmarks on T3 Code and open source repos. Effect diagnostics are built into ts-rust. Bun check is faster without Effect but raised incorrect errors on Sentry and tRPC. He still recommends bun check over ts-rust for most people because it will be maintained. | "T3 Code" bar chart; his Oct 7 2026 tweet with a six-project benchmark image. | Shows ts-rust is second fastest, and first only when Effect checks are needed. |
| 20:09-22:55 | "I didn't do this for perf." Silly reason: models could not do it, so it was his impossible benchmark. Real reason: WASM. A Go program drags its GC runtime into WASM, so binaries are large and slow; TS 7 lost the "runs anywhere JS runs" property and many JS APIs. | Board: "Silly reason: Because LLMs couldn't do it." / "Real reason: wasm". | The pivot from the port story to the isolate thesis. |
| 22:55-28:17 | Inference price for a fixed intelligence level falls 10x to 1000x per year. The compute the agent itself runs on (VMs, RAM) is rising 25-30% per year. Today VMs are a rounding error (Cursor gives a 16 or 32 GB VM per cloud thread for free); soon the VM costs more than the tokens. Agents are trained to expect a real Linux box. | Peter Piekarczyk's tweet about a Cursor user's 1.5T tokens; Artificial Analysis "cost per Intelligence Index task" chart; an LLM-made table of price drops; board: "Real AI costs". | The economic premise of the whole isolate idea. |
| 28:17-31:25 | Cloudflare is cheap because Workers are V8 isolates, not containers. Many customers share one Linux instance, split at the V8 layer. Cost: no file system, no native code, no persistent servers. So you "can't" run an agent there. | Stream chat answering "what do you associate with Cloudflare"; Cloudflare home page. | Introduces isolates. Detail in `06-diagram-stack-vs-isolates.md` and the isolates research file. |
| 31:25-35:15 | DEMO (owned by another delegate, summary only): a Bolt-like "prompt to app" tool where agent tools, fake bash and file system (just-bash), ts-rust WASM type check, bundle and the running app all live in one V8 isolate. Runs in Node on a server today. Says under 216 MB RAM and 4% CPU peak. A second build that used esbuild idles at about 2x the RAM. | Two apps, "isolate" and "Isolate Studio"; just-bash README; stats panel. | The proof of concept for the thesis. |
| 35:15-38:55 | Whiteboard: hardware to apps stack, Docker hosting vs Chrome/V8/isolates. | Excalidraw diagrams. | Full reconstruction in `06-diagram-stack-vs-isolates.md`. |
| 38:55-41:40 | Isolates are a good place to run built code, not to build it. Vercel sandboxes share primitives with Vercel hosting; Cloudflare sandboxes run on separate compute. just-bash "lies" to the agent so it thinks it has a file system. The demo would still work with the server's file system read-only. It could run in a Cloudflare Worker. Idle time between tokens costs no CPU on a shared event loop. Teases "Lakebed". | Back to the demo, then the isolate diagram, then stream chat. | The practical payoff: pay for CPU only when a token arrives. |
| 41:40-44:26 | Shows the "very complex prompts" (sarcasm). Real work was environment and setup: auditing blockers and failure modes, letting agents run in parallel without colliding. Compares it to managing a team. | T3 Code thread "Original Prompts Behind the Build". | The method. Short, trusting prompts plus heavy harness work. |
| 44:26-45:10 | PROMO: his paid course "Mega Dev" with three other instructors. | mega.dev landing page. | Self-promotion. |
| 45:10-47:40 | He has wanted a full-stack dev experience purely inside V8 since StackBlitz put a JS runtime in the browser. He just told Opus to port the demo to Cloudflare ("it probably will"). Closing takes on AI and the future of engineering. | Board scrolled to the top; a T3 Code thread "Typesafe App Builder in a V8 Isolate" at [46:35]; outro to camera. | The Cloudflare run is in progress, not shown working. |

## Argument chain

1. SAID [06:56]: emitting JS from TS is easy; checking types is the slow, hard part.
2. SAID [09:15]: Microsoft ported the checker to Go (TS 7) and Go was the right call for a native CLI.
3. SAID [13:47]: a Go codebase is a far easier source for a Rust port than the original JS, so agents ported Go to Rust line by line.
4. SAID [14:55]: the first result was 2-3x slower than Go; a single "at least 2x faster" goal plus 2 weeks of autonomous work fixed that.
5. SAID + SHOWN [17:27-19:50]: result is about 2x faster than tsgo on T3 Code and compatible enough that most reported issues are upstream bugs.
6. SAID [19:54]: performance was never the point.
7. SAID [21:40-22:50]: Go compiles badly to WASM (GC runtime, size), Rust compiles well; TS 7 therefore lost the ability to run wherever JS runs.
8. SAID [23:00-26:40]: inference price per unit of intelligence collapses yearly while VM and RAM prices rise, so the per-agent VM becomes the dominant cost.
9. SAID [27:00-27:50]: agents need a "real computer" today, and sandboxing a real computer harder only costs more.
10. SAID [28:40-31:10]: V8 isolates (Chrome tabs, Node, Cloudflare Workers) are a far cheaper isolation unit, but lack a file system and native code.
11. SAID [31:40-33:40]: fake the file system and bash in JS (just-bash), run the checker as Rust WASM, and the whole agent dev loop fits in one isolate.
12. SAID [40:20-41:20]: on an isolate platform idle time between tokens is nearly free, so agent compute gets cheap on both sides.

## All concrete numbers

### Cost

| Claim | Value | Label | Time |
|---|---|---|---|
| Codex / OpenAI token spend | about $400k | SAID | [00:10] |
| Same, on tweet card | "$400,000+", models "GPT-5.6 Sol + GPT 6 Astra", "1.3M lines of Rust", "stalled at ~84% compat" | SHOWN | [00:20] |
| Opus 5.5 spend, spoken | $20,000 | SAID | [00:15] |
| Opus 5.5 spend, on screen | "~$24,047" | SHOWN | [00:20], [01:00], [15:30] |
| Opus 5.5 spend, spoken later | "roughly $24,000" at full API prices | SAID | [15:25] |
| Total | $420k ("$420k+" on card) | SAID + SHOWN | [02:20], [00:20] |
| Unexplained overlay | "$223K Tokens Spent, +999% 5.6 Sol" | SHOWN | [00:40] |
| Project age | 5 months | SAID + SHOWN | [00:08] |
| Opus phase length | 2 weeks | SAID + SHOWN | [00:18] |
| Opus first working version | "v0 in 10 hours" | SHOWN | [00:20], [01:00] |
| Opus vs Astra | further "in 1/10th the time", and it started from scratch | SHOWN (README) | [01:00] |
| Requests in the Opus phase | 246,546 total; 240,921 on machine "zbook" ($23,527), 5,625 on "ProMini" ($520) | SHOWN | [15:30] |
| Share of one account's weekly limit | 925% to 983% | SAID + SHOWN | [15:40], [15:35] |
| Same, other phrasing | "about 9.3 to 9.8 full weekly limits of a Max 20x account" | SHOWN | [15:30] |
| Fleet context | all Claude traffic in the period 1,332%; ts-rust about 70-74% of it; 500-530% per week against a pool of 6 Max 20x accounts (600% per week) | SHOWN | [15:35] |
| Claude accounts used | 6 | SAID + SHOWN (quota page "6 credentials", "341% of 600%") | [15:15] |
| Subscription-equivalent time | "about 2 and 1/2 months" on one sub; later "10 weeklies" | SAID | [15:45], [16:20] |
| Subscription-equivalent time, computed | 9.25 to 9.83 weeks = about 2.1 to 2.3 months | INFERRED | - |
| Subscription-equivalent dollars | "about 500-ish dollars" after a free reset | SAID | [15:50] |
| Same, computed | about $427 to $454 at $200 per month and 4.33 weeks per month | INFERRED | - |
| Implied subsidy | about 53x ($24,047 over about $450) | INFERRED | - |

### Performance

| Claim | Value | Label | Time |
|---|---|---|---|
| ts-rust vs TS 6 | 12.5x faster | SAID | [01:25] |
| T3 Code, with Effect checks | tsc-rs 11.13 s (12.5x); tsc 7 + @effect/tsgo 21.07 s (6.6x); bun check + Effect pass 37.60 s (3.7x); tsc 6 + Effect plugin 138.63 s (baseline) | SHOWN | [01:25], [17:35] |
| T3 Code, without Effect checks | bun check 4.07 s (15.4x); tsc-rs 7.25 s (8.6x); tsc 7 16.10 s (3.9x); tsc 6 62.63 s (baseline) | SHOWN | [01:25], [17:35] |
| ts-rust vs tsgo | "around two times faster" | SAID | [01:35] |
| Same, on screen | 2.22x without Effect, 1.89x with Effect (T3 Code) | SHOWN | [01:25] |
| T3 Code benchmark scope | "Full check of 5 projects, summed"; 221 Effect diagnostics reported by three of the four setups | SHOWN | [17:35] |
| First Opus build vs Go | 2-3x slower | SAID | [14:55] |
| Performance goal given to the agent | at least 2x faster than the Go build | SAID + SHOWN | [15:05], [43:10] |
| ts-rust vs TS 6 on other things | "as much as a 20x improvement" | SAID | [17:40] |
| Six-project chart, geometric mean vs tsc 6 | tsc 7 7.1x; tsc-rs 11.4x; bun check 20.9x | SHOWN | [18:50] |
| VS Code (3.75M lines) | tsc 6 54.56 s; tsc 7 6.84 s (8.0x); tsc-rs 4.20 s (13.0x); bun check 1.62 s (33.7x) | SHOWN | [18:50] |
| Sentry (2.11M lines) | tsc 6 58.76 s; tsc 7 7.90 s (7.4x); tsc-rs 4.46 s (13.2x); bun check 3.14 s* (18.7x) | SHOWN | [18:50] |
| Playwright (585k lines) | tsc 6 4.48 s; tsc 7 0.66 s (6.8x); tsc-rs 0.34 s (13.2x); bun check 0.18 s (25.0x) | SHOWN | [18:50] |
| Excalidraw (449k lines) | tsc 6 5.32 s; tsc 7 0.80 s (6.7x); tsc-rs 0.70 s (7.6x); bun check 0.18 s (29.0x) | SHOWN | [18:50] |
| TypeORM (386k lines) | tsc 6 3.86 s; tsc 7 0.55 s (7.0x); tsc-rs 0.36 s (10.7x); bun check 0.19 s (20.0x) | SHOWN | [18:50] |
| tRPC server (209k lines) | tsc 6 1.10 s; tsc 7 0.16 s (6.8x); tsc-rs 0.09 s (12.0x); bun check 0.12 s* (9.1x) | SHOWN | [18:50] |
| Chart footnote | "*" = bun check reports errors no other checker reports (3 on Sentry, 2 on tRPC). Median of 5 runs. Apple M4 Pro, tsc-rs 0.1.0, TypeScript 7.0.2 and 6.0.3, a Bun canary build, @effect/tsgo 0.46.1 | SHOWN | [18:50] |
| ts-rust vs tsgo on the six projects | 1.1x (Excalidraw) to 1.9x (Playwright); 1.6x by ratio of geometric means | INFERRED from shown times | - |
| ts-rust vs bun on T3 Code with Effect | "four-ish times faster" | SAID | [18:25] |
| Same, computed | 37.60 / 11.13 = 3.4x | INFERRED | - |
| ts-rust vs TS 6 "for most of this stuff" | "13x plus" | SAID | [19:40] |
| Bun's own claim | "3x-7x faster"; VS Code check 1.75 s / 2.77 GiB vs tsc 7 `--checkers 16` 5.88 s / 9.23 GiB vs tsc 7 default 12.58 s / 7.73 GiB; 10,947 files, Linux x64, 64 threads; "a port of typescript-go"; "passes 100% of TypeScript's conformance tests" | SHOWN (Bun tweet, Oct 6 2026) | [01:45] |

### Compatibility and repo state

| Claim | Value | Label | Time |
|---|---|---|---|
| Best compat with OpenAI models | about 84% | SAID + SHOWN | [00:58], [01:00] |
| ts-rust compat | "pretty much 100% drop-in replacement" for tsgo / TS 7 | SAID | [16:45] |
| README wording | "100% compatibility in every real world project we have tested"; also "early release" and "I have no idea if this will actually work" | SHOWN | [01:00], [02:15] |
| Issues, spoken | 6 opened in total, 4 open now; 1 specific to ts-rust, 5 are TS 7 bugs ported faithfully | SAID | [16:50] |
| Issues, on screen | Open 4, Closed 2. Three open issues carry an "upstream issue" label (#20, #16, #13). The fourth (#15) is a ts-rust performance issue: one code path "4-5x slower than tsc 7" | SHOWN | [16:50] |
| Repo snapshot | 5,867 commits, 52 branches, 3 tags, 428 stars, 22 forks, release "tsc-rs 0.1.0" 16 hours old, Rust 93.6% | SHOWN | [01:15], [02:15] |
| Install | `npm install -D tsc-rs`, `npx tsc-rs -p tsconfig.json` | SHOWN | [01:00] |

### Economics and infrastructure

| Claim | Value | Label | Time |
|---|---|---|---|
| A Cursor user's alleged spend | $132M per year (1.5T tokens in 30 days at an assumed $8 per million) | SHOWN (third-party tweet); Theo SAYS the number is not real | [23:05] |
| Theo's counter-estimate | real API cost "$100k-$500k per month"; his own 33.5B tokens came to $0.56 per million | SHOWN (his reply) | [24:20] |
| Index >= 10, first point | DeepSeek R1, Jan 20 2025, $0.26 per task, index 11 | SHOWN | [23:35] |
| Index >= 10, later point | GPT-5 mini (High), Aug 7 2025, $0.05, index 17 | SHOWN | [24:10] |
| Index >= 50, first point | Claude Opus 5 (Max), Jul 24 2026, $5.86 per task, index 51 | SAID + SHOWN | [23:50] |
| Index >= 50, latest | GPT-6.1 Sol at 32 cents | SAID; table shows "~$0.32 (Sep 26)" | [24:00], [24:20] |
| Drop at >= 50 | "10x ... in just like 4 months" | SAID | [24:05] |
| Same, on screen | "20x in 2.5 mo" | SHOWN | [24:20] |
| Index >= 30 | about $2.50 (Feb 26) to about $0.03 (Sep 26), about 8 months, "~1000x/yr" | SHOWN | [24:20] |
| Same, spoken | 3 cents "by December of this year", "8x per month", 1000x per year | SAID | [24:15] |
| Same, computed | 83x over 8 months = about 1.74x per month = about 760x per year | INFERRED | - |
| General rule | "10x a year is a conservative estimate" | SAID; table header says about 10x per year for older levels, 100x or more in a level's first year | [24:10], [24:20] |
| VM price trend | up 25-30% per year | SAID, no source shown | [26:10] |
| Inference price trend | down 10x to 100x per year | SAID | [26:12] |
| Cursor cloud thread VM | 32 GB RAM ("might be 16"); 4 threads = 128 GB | SAID, self-described as unsure | [25:05] |
| GLM 5.3 Flash for an hour | "a few dollars" | SAID | [26:20] |
| Go to WASM size | hard to get under 10 MB | SAID | [22:15] |
| Demo memory | "under 216 megs of RAM", "peaked at like 4% CPU" | SAID; screen shows 259 MB (see demo file) | [33:12] |
| esbuild variant memory | "2x the RAM" | SAID; 423.8 MB vs 259 MB = 1.6x | [33:55]; INFERRED ratio |
| VM alternative | "half a gig of RAM and a bunch of reserved CPU" | SAID | [40:05] |
| Twitch dev loop | 2 min startup, 30-60 s per reload, later under 5 s | SAID | [07:35] |
| GC thought experiment | 1 request in 1000 at 300 ms instead of 25 ms = "less than 1%" slower overall | SAID; computed 1.1% | [12:15]; INFERRED |

## Mismatches between SAID and SHOWN

- [00:15] Says $20,000 of Opus; screen and later speech say about $24,047.
- [01:25] "12.5 times faster" than TS 6 is the with-Effect T3 Code number. Without Effect checks the same table shows 8.6x.
- [17:40] "as much as a 20x improvement" for ts-rust vs TS 6. The highest tsc-rs figure on screen is 13.2x. 20.9x is bun check's mean. INFERRED: he mixed up the columns.
- [19:40] "13x plus" for most projects. On screen three of six are 13.0-13.2x; the others are 7.6x, 10.7x, 12.0x; mean 11.4x.
- [19:45] "usually a 2x improvement from the Go version". Only T3 Code shows about 2x; the six open source projects compute to 1.1x-1.9x.
- [18:25] "four-ish times faster than Bun" with Effect checks. Screen gives 3.4x.
- [18:55] Says he was also checking the Effect repo and that Bun "couldn't pass" on it ("if I recall"). Effect is not one of the six panels shown. Unverified from the video.
- [14:25] Says `runtime.rs` "is Go routines ported to Rust". The part of the file on screen at [14:30] is a `cgroup` module that parses Linux CPU limits, with comments citing Go's `cgroup.go`. The file is 329 lines. Goroutine-related work is visible only in commit messages ("every goroutine thread start retries as Go", "Go stack size ... threads"). INFERRED: goroutines appear to be mapped to OS threads elsewhere in `gostd`; the frame he points at does not show that.
- [16:55] "five issues were problems that exist in TSC 7". The screen confirms 3 upstream-labelled open issues and 1 ts-rust-specific one. The 2 closed issues are not shown, so the 5-of-6 split is unverified from the video.
- [24:05] "10x in 4 months" vs "20x in 2.5 mo" on screen (his number is the more cautious one).
- [24:15] "by December of this year" and "8x per month". The table says Sep 26 and "~8 mo". INFERRED: he misread the duration column as a monthly rate.
- [00:40] An overlay reads "$223K Tokens Spent". It matches no number he says. INFERRED: a graphic reused from an earlier video about the GPT-5.6 Sol attempt.
- [15:45] "2 and 1/2 months" and "$500-ish" are rounded up from about 2.2 months and about $440.
- [33:12] Demo RAM and CPU: said 216 MB and 4%; shown 259 MB. Covered in the demo file.
- [40:00] "fully possible to run this entire demo in a Cloudflare worker" is a claim, not a result. At [46:35] the Cloudflare port is an agent thread still asking setup questions; at [46:40] he says "it probably will".

## How the port was actually done

- Two attempts.
  - Attempt 1, OpenAI models (GPT-5.6 Sol, GPT 6 Astra): months of `/goal` loops, 1.3M lines of Rust, stalled near 84% compat. SHOWN [00:20], [01:00].
  - Attempt 2, Opus 5.5 in Claude Code: Theo assumed it would reuse the earlier code; it started from scratch. SHOWN (README) [01:00].
- Source was the Go port, not the JS original. SAID [13:47-14:50]: Opus went "line by line" through TS 7's Go code. Microsoft had done the same from JS to Go by hand.
- Go runtime pieces were re-created in Rust. SHOWN [13:45-14:25]:
  - `crates/` holds `ts_goport` and `ts_wasm`.
  - `ts_goport/src/gostd/` holds Rust files named after Go packages: `collate.rs`, `context.rs`, `errgroup.rs`, `errors.rs`, `netip.rs`, `norm.rs`, `regexp.rs`, `rlimit.rs`, `runtime.rs`, `slices.rs`, `stack.rs`, `strconv.rs`, `timer.rs`, `unicode.rs`, `unicode_tables.rs`, `url.rs`, plus a `data` folder.
  - Commit messages pin Go 1.27.1 behaviour, for example Unicode 17.0.0 tables and "tsgo starts like a Go process (signals, launcher env ...)".
  - A commit on `runtime.rs` reads "build ts_goport for wasm32-wasip1 with an npm package". INFERRED: the WASM build targets WASI preview 1.
- Theo did not know about the stdlib port until someone pointed it out on Twitter. SAID [14:50].
- First result was slower. SAID [14:55]: 2-3x slower than Go. He then set a goal of at least 2x faster "in every way" and let it run 2 weeks.
- Effect diagnostics were built in. SAID [18:15]; SHOWN commit "native Effect diagnostics in tsc-rs" [13:50].
- Scale-out. SAID [42:58]: the main machine ran out of compute, so he gave the agent SSH access to other machines in his fleet. SHOWN [15:30]: in the end 240,921 of 246,546 requests still came from one machine.
- Reliability work. SAID [42:30]: the run kept crashing systemd from memory exhaustion and dropping the effort level; he fixed that at the OS level.
- Environment over prompts. SAID [43:35-44:20]: side threads audited blockers, slow steps and repeated failure modes, and he changed the environment so parallel agents stopped stepping on each other. He likens it to being a manager.
- Timeline from on-screen dates. SHOWN [43:35]: a 16-hour `/goal` session on 2026-09-24, the main session from 2026-09-25 (transcript 91 MB), prompts on 09-26, a compaction on 09-28. SHOWN [18:50]: benchmark tweet on Oct 7 2026. INFERRED: "2 weeks" = Sep 24 to about Oct 7.

## The prompts shown on screen

SHOWN [41:55-43:35], a T3 Code thread titled "Original Prompts Behind the Build" in which an agent lists Theo's first prompts from the main Claude Code `/goal` session. Paraphrased, with short quotes.

| # | Date | Prompt (paraphrase) |
|---|---|---|
| 0 | 2026-09-24 | Earlier `/goal` session, about 16 hours. Keep iterating on the rewrite until real projects type check and compile, naming TanStack Query core and Hono. "I want you to be bold." He mistyped Go for Rust and corrected it. |
| 1 | 2026-09-25 | Pasted task: work in the ts-rust sandbox folder, read `AGENTS.md` and a typechecker accountability doc first. Included audit notes from the 16-hour run and four asks: make the Cargo job count configurable, add a scripts/state folder and split state into current and history files, make the tsgo oracle's inputs read-only, update `AGENTS.md` rules for parallel work. |
| 2 | 09-26 | "Do it! Great work. I trust your judgement fully", keep improving compat and performance. |
| 3 | 09-26 | Make the best current state the main branch ASAP. "I don't care how." |
| 4 | 09-26 | `/effort`, then `/goal`: finish the port, get as close as possible to 100% compat with tsgo, improve performance in parallel, keep several workflows and subagents running at all times. |
| 5 | 09-26 | "I have given you ssh access to other machines". |
| 6 | before 09-28 | New target: "minimum 2x faster than the Go build", iterate until reached. Survives only in a compaction summary. |

- SAID [42:28]: the `/effort` rerun was needed because crashes kept resetting the effort level. The caption text for the level names is garbled; exact names unverified.
- SAID [43:20]: the 2x target was added because the agent kept stopping after full compat plus one small performance win. It "needed a better end state".
- SHOWN [43:35]: the model selector in the thread reads "Claude Opus 5.5".

## People, tools and projects mentioned

| Name | One line | Label |
|---|---|---|
| ts-rust / `tsc-rs` | Theo's Rust port of the TS 7 compiler, checker and LSP; repo `pingdotgg/ts-rust`, MIT, on npm | SAID + SHOWN |
| TypeScript 6 / `tsc 6` | Last `tsc` written in TypeScript/JavaScript | SAID |
| TypeScript 7 / tsgo | Microsoft's Go port of the compiler | SAID |
| `bun check` | Bun's built-in type checker, written in Rust, a port of typescript-go | SAID + SHOWN |
| Jarred (Bun) | Named as the person behind bun check; Theo's tweet says he shared it early | SAID [17:30] + SHOWN [18:50] (tweet text partly hidden by the camera overlay) |
| esbuild / Evan W | Go bundler and TS stripper; Theo calls him CTO of Figma | SAID |
| Effect (effect-ts) | TS library whose extra diagnostics normally need a patched compiler or plugin; built into ts-rust | SAID + SHOWN |
| T3 Code | Theo's coding-agent app; used as the main benchmark and to show agent threads | SAID + SHOWN |
| Opus 5.5 | Model that completed the port | SAID + SHOWN |
| GPT-5.6 Sol, GPT 6 Astra | OpenAI models used in the failed attempt | SAID + SHOWN |
| GPT-6.1 Sol | Model in the isolate demo; also the cheap index >= 50 point | SAID + SHOWN |
| GLM 5.3 Flash | Cheap model example; "Workers AI GLM 5.3" picked for the Cloudflare port | SAID + SHOWN [46:35] |
| Qdrant | Sponsor, vector search | SAID + SHOWN |
| "Doom in TypeScript types" | Project by a friend; search result shows the Michigan TypeScript channel | SAID + SHOWN [08:10] |
| Melkey | Go advocate Theo jokes with | SAID + SHOWN |
| Lauren ("poteto") | Cursor user whose public token count started the $132M discussion | SAID + SHOWN |
| Peter Piekarczyk | Author of the $132M tweet | SHOWN |
| Artificial Analysis | Source of the cost-per-intelligence chart | SAID + SHOWN |
| Cursor Cloud | Gives each cloud agent thread a full VM, currently free | SAID |
| Claude Code cloud | Now gives subscribers a credit for cloud compute | SAID |
| Cloudflare Workers | V8-isolate hosting; the target platform for the idea | SAID + SHOWN |
| Vercel, Heroku, Hetzner, AWS | Examples of "normal" per-customer Linux hosting | SAID |
| Docker | His example of OS-level virtualization | SAID + SHOWN (diagram) |
| just-bash | In-memory bash and file system in TypeScript for agents, by Malte at Vercel | SAID + SHOWN |
| Bolt / StackBlitz | Browser-based dev environment that inspired the idea; "Eric" is a friend from that time | SAID |
| Lakebed | Unreleased project teased as related | SAID [41:30] |
| Mega Dev | Theo's paid course; co-instructors named as Angie, Kent, John Lindquist | SAID + SHOWN |

## Sponsor and promo segments

| Time | Type | What |
|---|---|---|
| 02:29-04:21 | SPONSOR | Qdrant. Paid read with three demo apps. |
| 23:10 | PROMO | Subscribe prompt and a pointer to another video. |
| 44:26-45:10 | PROMO | Mega Dev course. SHOWN: starts Oct 26, 20 lessons, 4 live workshops. He says not to pay for it out of pocket. |

## Frames

| Frame | Caption |
|---|---|
| [t00m20s-cost-card-420k.jpg](assets/t00m20s-cost-card-420k.jpg) | [00:20] Announcement tweet with the cost card: $420k+ total, $400,000+ OpenAI, about $24,047 Opus 5.5. |
| [t01m25s-readme-benchmark-tables.jpg](assets/t01m25s-readme-benchmark-tables.jpg) | [01:25] README tables for T3 Code: the 12.5x figure is the with-Effect row; without Effect it is 8.6x. |
| [t14m00s-gostd-go-stdlib-port.jpg](assets/t14m00s-gostd-go-stdlib-port.jpg) | [14:00] `ts_goport/src/gostd`: Go standard library packages re-implemented as Rust files. |
| [t14m30s-runtime-rs-cgroup-code.jpg](assets/t14m30s-runtime-rs-cgroup-code.jpg) | [14:30] `runtime.rs` while he says "goroutines"; the visible code parses Linux cgroup CPU limits. |
| [t15m35s-token-cost-weekly-limits.jpg](assets/t15m35s-token-cost-weekly-limits.jpg) | [15:35] Agent-written usage audit: $24,047 total, 925-983% of one account's weekly limit. |
| [t16m50s-issues-list.jpg](assets/t16m50s-issues-list.jpg) | [16:50] Issues list: 4 open, 2 closed, three labelled "upstream issue". |
| [t18m50s-real-world-apps-benchmark.jpg](assets/t18m50s-real-world-apps-benchmark.jpg) | [18:50] Six-project benchmark: tsc 7 7.1x, tsc-rs 11.4x, bun check 20.9x over tsc 6. |
| [t24m20s-cost-decline-table.jpg](assets/t24m20s-cost-decline-table.jpg) | [24:20] Price-drop table read off the Artificial Analysis chart by an LLM ("treat them as +/-30%"). |
| [t43m35s-original-prompts.jpg](assets/t43m35s-original-prompts.jpg) | [43:35] The prompts behind the Opus run, as listed by an agent in T3 Code. |

Diagram frames are listed in `06-diagram-stack-vs-isolates.md`.

## Not verified here

- Nothing was checked against external sources in this file. Model names, prices and benchmark numbers are as said or shown.
- Small text in the six-project chart was read from a 1280x720 frame. Values were cross-checked across two frames ([18:45], [18:50]) and agree.
- The GPT-6.1 Sol tooltip on the Artificial Analysis chart does not appear in any 5 s frame; the 32 cent figure rests on speech plus the LLM-made table.
- The two closed GitHub issues are never shown.
- The spelling of "Astra" follows the on-screen card ("GPT 6 Astra"). "Angie" and "Lakebed" are caption spellings.
