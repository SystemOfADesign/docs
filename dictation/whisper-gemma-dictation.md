# Push-to-talk dictation: reimplementation guide with a separate Whisper instance and Gemma correction

Source studied: the `my-dgx-spark` repo (`whisper-dictate/`, `voice-agent/`, `docs/`) at
working tree of 2026-11-09, plus the live server side on the DGX Spark (`smart-proxy/`,
`parakeet-stream/`, systemd user units). Paths below are relative to `whisper-dictate/`
unless stated.

The current stack uses Qwen 2.5 (via Ollama) for transcript correction. This guide
re-targets that step to **Gemma** and separates the Whisper instance from the LLM host so
either can move or be replaced independently.

---

## 1. One-paragraph summary

A thin client on the user's machine records the microphone on a hotkey toggle, posts
16 kHz WAV to an ASR HTTP endpoint, and types the result at the cursor. Accuracy comes from
a two-model flow: a fast "live" ASR types text while the user speaks, then on lift-off the
whole utterance goes through a full-context Whisper pass and a small instruction-tuned LLM
that fixes transcription errors, punctuation and casing using a per-user domain profile.
The LLM is a text filter, not an assistant: it must echo the transcript with fixes only.
All server pieces speak one contract (`multipart file + prompt -> {"text": ...}`), which is
what makes swapping Whisper hosts or the LLM a configuration change rather than a rewrite.

---

## 2. Current architecture (as built)

```
 client machine (macOS or Linux)                 GPU host (today: DGX Spark, GB10, CUDA 13)
 ┌─────────────────────────────────┐             ┌──────────────────────────────────────────┐
 │ mic -> dictate.py / dictate_linux│ POST /transcribe (wav, prompt)                         │
 │   Option tap = start/stop        ├────────────▶ :8010 parakeet-tdt-0.6b-v3   LIVE ASR     │
 │   Silero VAD picks cut points    │ ws /ws/stream (pcm16)                                  │
 │   chunks typed in seq order      ├────────────▶ :8011 fastconformer streaming (optional)  │
 │   window finalize every ~10 s    │ POST /finalize (wav, prompt, profile)                  │
 │   lift-off finalize              ├────────────▶ :8002 smart-proxy ─┬─▶ :8000 whisper.cpp  │
 │ text -> focused app (pynput)     │◀────────────  {"text", "degraded", ...} │   large-v3-turbo│
 └─────────────────────────────────┘             │                         └─▶ :11434 Ollama │
                                                 │                             qwen2.5:7b    │
                                                 └──────────────────────────────────────────┘
```

### 2.1 Components

| Piece | Where | Role | Keep in reimplementation? |
|---|---|---|---|
| `client/dictate.py` (1208 lines) | macOS | hotkey toggle, PortAudio capture, Silero VAD, chunk/window scheduler, seq-ordered typing, HID watchdog, mic-leak respawn, finalize rewrite | yes, unchanged except `.env` |
| `client/dictate.sh`, `client/_dictate-loop.sh` | macOS | background runner, endpoint auto-probe (`use spark|local|auto`), respawn on exit 42, heartbeat check | yes |
| `client/linux/dictate_linux.py` + `.sh` | Linux | same server contract, SIGUSR1 toggle, pw-record/arecord, pynput/xdotool/wtype/ydotool/clipboard emit; no VAD, no streaming, no HID watchdog | yes |
| `client/glossary.txt` | client | whisper `prompt` bias text (names, products). Must stay under ~224 tokens | yes, per user |
| `run-server.sh` + `systemd/whisper-server.service` | Spark | `whisper-server` (whisper.cpp) large-v3-turbo, `/transcribe`, VAD, `-nt`, `--suppress-nst`, 16 threads | replaced by a separate Whisper instance (section 5) |
| `smart-proxy/proxy.py` (Spark only, not in repo) | Spark | FastAPI: `/transcribe-raw`, `/finalize`, `/correct`, `/transcribe`, `/profiles*`, `/health`; Ollama chat with few-shot; degraded fallback | yes, re-pointed at Gemma |
| `smart-proxy/profiles/{default,nikhil}.md` | Spark | per-user domain context appended to the system instructions | yes |
| `parakeet-asr` (:8010), `parakeet-stream` (:8011) | Spark | NeMo CUDA models for live text | optional; CUDA-only (section 6.4) |
| `whisper-watch` (:8003) | Spark | second whisper-server, `-l auto`, DTW timestamps, used by the `/watch` skill | separate concern, same recipe |
| `voice-agent/` | Spark | browser PTT -> Whisper -> OpenAI/Anthropic -> VibeVoice TTS cascade | out of scope, reuses `WHISPER_URL` |
| `client/speak.sh`, `record-voice.sh` | macOS | Qwen3-TTS playback and voice reference capture | out of scope |

### 2.2 Ports in use today

| Port | Service | Contract |
|---|---|---|
| 8000 | whisper.cpp `whisper-server`, large-v3-turbo | `POST /transcribe` multipart `file`, optional `prompt` -> `{"text"}` (no `/health`) |
| 8002 | smart-proxy | see 2.4 |
| 8003 | whisper.cpp, `-l auto`, DTW | same as 8000 |
| 8010 | parakeet-tdt-0.6b-v3 (NeMo) | `POST /transcribe` -> `{"text", "asr"}`, `GET /health` -> `{"model"}` |
| 8011 | fastconformer hybrid streaming (NeMo) | `ws /ws/stream`, PCM16 in, `{"partial"|"final"}` out |
| 11434 | Ollama | `/api/chat` |

### 2.3 Client behaviour worth preserving (do not re-derive)

- **Hotkey**: tap either Option alone (`<0.5 s`, no other key) toggles. Option+anything is an
  ordinary shortcut. Stale `held` entries are dropped using Quartz HID key state. Legacy
  `HOTKEY_MODE=hold` keeps Option+Ctrl push-to-talk, Shift skips the LLM pass.
- **Audio**: 16 kHz mono float32, per-device gain (`INPUT_GAIN`), device preference list
  (`INPUT_DEVICE`), PortAudio refresh on open so a re-plugged USB mic is found.
- **Silero VAD is cut-point only.** It never trims audio. It decides when a chunk/window can
  close at a pause so Whisper never sees a mid-word seam (seams cause hallucinated names).
- **Chunking**: every ~20 s (`CHUNK_SECONDS`) with a 5 s grace for a pause, the buffer is
  swapped and posted; results type in `seq` order even when a short chunk returns first.
  Each chunk's prompt = glossary + last 50 chars of the previous chunk. Context never
  crosses hotkey presses.
- **Windowed finalize**: every ~10 s (`FINALIZE_INTERVAL`) at a pause, that window's audio
  goes to `/finalize`; the window's typed tail is backspaced and retyped with the corrected
  text, then locked. Lift-off only finalizes the last window, so the end feels fast.
- **Never clobber**: a rewrite is skipped (logged) if the user typed/clicked, a new recording
  started, or the proxy returned `degraded=true`. Own keystrokes are flagged (`_injecting`
  plus a 300 ms grace) so they do not count as user activity.
- **Watchdog** (200 ms): hold-mode HID release detection (3 consecutive reads, disabled once
  typing taints HID flags), 600 s hard cap, chunk/window scheduling.
- **Mic leak**: PortAudio teardown that hangs > 2 s exits with code 42; `_dictate-loop.sh`
  respawns with 2/4/8 s backoff. `kill -USR1 <pid>` is a hot reload via the same path.
- **Heartbeat** file every 15 s; `dictate.sh status` flags > 45 s as stalled.
- **Fail loud**: every fallback is printed (`MIC-QUIET`, `DEGRADED`, `finalize FAILED`).

### 2.4 smart-proxy contract (`proxy.py`)

| Route | In | Out |
|---|---|---|
| `GET /health` | | `{"ok", "model", "asr_live", "asr_live_url", "asr_final", "asr_final_url"}` |
| `POST /transcribe-raw` | `file`, `prompt?` | live ASR only: `{"text", "asr", "whisper_s"}` |
| `POST /finalize` | `file`, `prompt?`, `profile` | final ASR + LLM: `{"text", "raw_text", "asr", "asr_s", "llm_s", "degraded", "profile"}` |
| `POST /correct` | JSON `{"text", "profile"}` | LLM only: `{"text", "raw_text", "llm_s", "degraded", "profile"}` |
| `POST /transcribe` | `file`, `prompt?`, `profile` | back-compat live ASR + LLM in one call |
| `GET /profiles`, `GET /profiles/{name}?create=`, `PUT /profiles/{name}` | | markdown profiles, `default` read-only, 8000 char cap |

Environment: `ASR_LIVE_URL`, `ASR_FINAL_URL`, `WHISPER_URL` (legacy alias), `OLLAMA_URL`,
`LLM_MODEL`, `LLM_TIMEOUT_S` (5), `WHISPER_TIMEOUT_S` (30), `PROXY_PORT`,
`ASR_LIVE_LABEL`/`ASR_FINAL_LABEL` overrides.

LLM call shape: `system = BASE_INSTRUCTIONS + profile.md`, then 7 fixed few-shot pairs,
then the raw transcript as the user turn. `temperature 0`, `num_predict 512`,
`keep_alive -1`, non-streaming. Output guard: empty -> degraded; for inputs >= 40 chars the
output must be within `[0.5x, 2x + 40]` of the input length, otherwise degraded (catches the
model "answering" the transcript). A warm-up request at startup makes the model resident.
Logs never contain transcript text, only character counts and timings.

Known-good numbers on the Spark (2026-10-18): whisper 0.26 s, finalize 0.9 s for a 6 s phrase.

---

## 3. Target architecture

```
 client ──POST /transcribe──▶ ASR host A   : whisper.cpp large-v3-turbo        (separate Whisper instance)
 client ──POST /finalize ───▶ proxy host   : smart-proxy ──▶ ASR_FINAL_URL = host A
                                             └──────────▶ OLLAMA_URL      = LLM host B : Gemma
```

Three roles, any co-location is allowed:

| Role | Minimum | Good fit |
|---|---|---|
| A. Whisper instance | whisper.cpp built for the host's GPU API, `ggml-large-v3-turbo.bin` (1.6 GB), `ggml-silero-v5.1.2.bin` | Apple Silicon (Metal) or any CUDA box. CPU works for short chunks but misses the 1 s budget |
| B. LLM host | Ollama with a Gemma instruct model resident (`keep_alive -1`) | 16 GB+ unified memory for Gemma 3 12B QAT, 8 GB for 4B |
| C. Proxy | Python 3.11+, FastAPI, httpx; stateless | wherever B is (one LAN hop fewer on the slow path) |

The client only needs two URLs (`SPARK_URL*` for live ASR, `SMART_URL*` for the proxy).
The proxy derives nothing from hostnames, so A and B can be on different machines.

---

## 4. Reimplementation, step by step

### 4.1 Whisper instance (role A)

1. Build whisper.cpp at a known commit (Spark build: `968eebe`, 2026-05-15).
   - macOS: `cmake -B build -DGGML_METAL=ON && cmake --build build -j --target whisper-server`
   - CUDA: `cmake -B build -DGGML_CUDA=ON` (Spark unit hardcodes `PATH=/usr/local/cuda-13.0/bin:...`)
2. Models in `whisper.cpp/models/`: `ggml-large-v3-turbo.bin`, `ggml-silero-v5.1.2.bin`.
3. Launch (copy of `run-server.sh`, flags matter):

```bash
exec ./build/bin/whisper-server \
  -m models/ggml-large-v3-turbo.bin \
  --host 0.0.0.0 --port 8000 \
  --inference-path /transcribe \
  -l en -t 16 -nt --suppress-nst \
  --vad --vad-model models/ggml-silero-v5.1.2.bin
```

   `-nt` drops timestamps, `--suppress-nst` suppresses non-speech tokens (fewer
   "[BLANK_AUDIO]" artifacts), server-side VAD trims silence. For a language-agnostic
   second instance use `-l auto -dtw large.v3.turbo` on another port (that is `whisper-watch`).
4. Service: Linux `systemd --user` unit as in `systemd/whisper-server.service` plus
   `loginctl enable-linger <user>`; macOS a LaunchAgent with `KeepAlive=true` and the same
   `ProgramArguments`.
5. Verify: `curl -s -F file=@t.wav -F prompt="Claude, FastAPI" http://<A>:8000/transcribe`
   returns `{"text": ...}`. There is no `/health`; the proxy infers the label from `:8000`.
   Set `ASR_FINAL_LABEL=whisper-large-v3-turbo` explicitly on a non-8000 port.

### 4.2 Gemma on the LLM host (role B)

1. `brew install ollama` (macOS) or the Linux installer. Bind to LAN only if the proxy is on
   another machine: `OLLAMA_HOST=0.0.0.0:11434`, and firewall it to the LAN.
2. Pull a Gemma instruct model. Candidates, pick by memory and latency budget:

| Ollama tag | Params | Resident memory | Fit for this job |
|---|---|---|---|
| `gemma3:4b-it-qat` | 4B | ~3.5 GB | default. Fast enough for the 5 s `LLM_TIMEOUT_S`, strong instruction following for echo-with-fixes |
| `gemma3:12b-it-qat` | 12B | ~8.5 GB | best quality on names and casing; use on a 24 GB+ host |
| `gemma3:1b` | 1B | ~1 GB | too weak: drifts into answering the transcript, trips the length guard |
| `gemma3n:e4b` | ~4B effective | ~4 GB | alternative on constrained hardware, text quality close to 4B |

   Newer Gemma releases supersede these tags; check `ollama list` and the Ollama library
   before pinning. Pin the exact tag in the unit so a `pull` cannot silently change the model.
3. Make it resident and confirm the chat endpoint works:

```bash
ollama pull gemma3:4b-it-qat
curl -s http://<B>:11434/api/chat -d '{"model":"gemma3:4b-it-qat","stream":false,"keep_alive":-1,
  "options":{"temperature":0,"num_predict":64},
  "messages":[{"role":"system","content":"Echo the user text with punctuation fixed only."},
              {"role":"user","content":"so i asked cloud about the fast api server"}]}'
```

### 4.3 Gemma-specific adjustments in `proxy.py`

Gemma's chat template has **no native system role**; Ollama's Gemma templates fold the system
message into the first user turn. That works, but two things change versus Qwen:

- **Few-shot carries more weight than the system text.** Keep the 7 pairs; add one pair per
  recurring failure seen in the logs rather than lengthening `BASE_INSTRUCTIONS`.
- **Gemma tends to add a trailing newline or wrap output in quotes less often than Qwen, but
  more often prepends "Here is the corrected text:".** Extend the post-processing guard:

```python
_PREFIXES = ("here is the corrected", "corrected text:", "corrected transcript:")
low = out.lower()
for p in _PREFIXES:
    if low.startswith(p):
        out = out.split(":", 1)[-1].strip()
        break
```

- Keep `temperature 0`. Set `options.num_ctx` to 4096 so system + profile + few-shot + a
  60 s window (~250 tokens) never truncates; the default 2048 is tight with a long profile.
- `LLM_TIMEOUT_S=5` holds for 4B on Metal or CUDA. For 12B on an M-series mini raise to 8
  and accept slower lift-off, or keep 4B for windows and route only `/correct` to 12B.
- Config change only: `Environment=LLM_MODEL=gemma3:4b-it-qat`,
  `Environment=OLLAMA_URL=http://<B>:11434/api/chat`.
- Licensing: Gemma ships under the Gemma Terms of Use (not Apache 2.0 like Qwen 2.5). Fine
  for personal use; re-read before offering the proxy to other people.

### 4.4 Proxy (role C)

```
python3 -m venv .venv && .venv/bin/pip install fastapi uvicorn httpx python-multipart
Environment: PROXY_PORT=8002 ASR_FINAL_URL=http://<A>:8000/transcribe
             ASR_LIVE_URL=http://<A>:8000/transcribe   # or parakeet, see 6.4
             OLLAMA_URL=http://<B>:11434/api/chat LLM_MODEL=gemma3:4b-it-qat
```

`ASR_LIVE_URL` defaults to `WHISPER_URL`; pointing both at the Whisper instance gives a
single-model setup that still benefits from the Gemma pass. Verify with `GET /health` then
`curl -s -F file=@t.wav -F profile=default http://<C>:8002/finalize`.

Copy `profiles/default.md` verbatim and create one profile per user with `PUT /profiles/<name>`
(the proxy also clones default on `GET /profiles/<name>?create=true`). Profiles are read per
request, so edits are live.

### 4.5 Client

`.env` on each client (from `client/.env.example`):

```dotenv
HOTKEY_MODE=toggle
SPARK_URL_REMOTE=http://<A>:8000/transcribe      # live ASR, probed at start
SPARK_URL_LOCAL=http://127.0.0.1:8000/transcribe  # fallback only if a local whisper exists
SPARK_URL=http://<A>:8000/transcribe
SMART_URL_REMOTE=http://<C>:8002/transcribe       # client derives /finalize from this
SMART_PROFILE=<name>
# STREAM_URL_REMOTE=ws://<spark>:8011/ws/stream   # only while a NeMo host exists
```

Nothing in `dictate.py` references Qwen, Ollama or the Spark by name; the variable names
(`SPARK_URL`) are historical. Install, permissions and verification are in
`client/AGENT-SETUP.md`; the offline wheel bundle for corporate Macs is `docs/wheel-bundle.md`.

---

## 5. Validation

1. Contract: `curl` each of `/transcribe` on A, `/health` and `/finalize` on C with a 16 kHz
   mono WAV (`say -o t.aiff "..." && afconvert -f WAVE -d LEI16@16000 -c 1 t.aiff t.wav`).
2. Correction quality: run the few-shot inputs through `/correct` and diff against the
   expected outputs in `FEWSHOT`; all 7 must match exactly at temperature 0.
3. Guard behaviour: send a question ("can you check the logs") and confirm the output is the
   question with a `?`, not an answer. Send a 300-char rambling transcript and confirm
   `degraded=false` and length within the guard.
4. Latency targets (6 s phrase): ASR < 0.5 s, `llm_s` < 1.5 s on 4B, lift-off rewrite
   visible < 2 s. The Spark baseline is 0.26 s + 0.9 s with Qwen 2.5 7B.
5. Client: `dictate.sh start` prints `mode: ... -> spark`, `smart: http://<C>:8002/transcribe`;
   logs show `[smart-final] window whisper Xs + llm Ys: 'raw' -> 'fixed'` lines and no
   `DEGRADED`. `python -m pytest -q` in `client/` passes (no mic needed).
6. Soak: a 90 s dictation produces 4 to 5 window rewrites in order, no mid-word seams, and
   `dictate.sh status` stays healthy afterwards.

---

## 6. Platform notes

### 6.1 Mac mini (Apple Silicon) as A, B and C

- whisper.cpp Metal build runs large-v3-turbo at roughly real-time x10 on an M4; fine.
- Ollama on macOS uses Metal; Gemma 3 4B QAT fits beside Whisper in 16 GB. 12B wants 32 GB.
- Replace systemd with LaunchAgents (one per role, `KeepAlive`, `RunAtLoad`, `StandardOutPath`
  under `~/Library/Logs`). `loginctl linger` has no equivalent; FileVault without auto-login
  means nothing starts until someone unlocks the machine after a reboot.
- Bind all three to the LAN interface or `127.0.0.1` plus a reverse proxy; never to a
  Funnel/public tunnel. The endpoints are unauthenticated by design (section 7).

### 6.2 Linux CUDA box as A/B

Straight copy of the Spark units. Keep the `Environment=PATH=/usr/local/cuda-*/bin:...` line;
the unit fails without it after a CUDA upgrade. `loginctl enable-linger` once.

### 6.3 Client-side differences

macOS client needs Microphone, Accessibility and Input Monitoring granted to the launching
terminal; the Python child inherits them. Linux client needs PipeWire or ALSA, and on Wayland
`ydotool` or `wtype` for typing (falls back to clipboard, then stdout).

### 6.4 Live typing without Parakeet

`parakeet-asr` and `parakeet-stream` are NeMo + CUDA and do not run on Apple Silicon. Options:

| Option | Effect |
|---|---|
| `ASR_LIVE_URL` = Whisper instance (default) | chunks every ~20 s instead of word-by-word; correctness identical, less "live" feel |
| second whisper.cpp instance with `ggml-small.en.bin` on :8010 | ~3x faster live chunks, lower accuracy, still corrected by the finalize pass |
| keep a CUDA host for :8010/:8011 only | preserves today's UX; one more machine to run |

The client already falls back from streaming to chunked when the websocket cannot open.

---

## 7. Security boundaries

- Every server endpoint is unauthenticated and plain HTTP. They are LAN-only by contract.
  The client runner refuses to silently go "local" when the remote probe fails only in the
  sense that it prints the mode; it does not authenticate anything.
- Off-LAN access: Tailscale (tailnet-only `serve`, never Funnel) or an SSH tunnel to A/C.
  The multi-user design (API keys, rate limit, access log without transcript text) is
  parked in `docs/future-remote-access.md`.
- Logs: the proxy logs character counts and timings only. The client log
  (`~/Library/Logs/whisper-dictate.log`) does contain transcripts; treat it as personal data.
- Profiles and `glossary.txt` contain names and project words; keep them out of public repos.

---

## 8. Cutover from the Spark and rollback

1. Stand up A, B, C on the new host(s); pass section 5 end to end with `SMART_PROFILE=default`.
2. Copy `smart-proxy/profiles/*.md` from the Spark (no secrets inside, but personal).
3. Flip clients: edit `.env`, `dictate.sh restart`. Rollback is the same edit back; the Spark
   services keep running untouched until decommission.
4. Decommission: `systemctl --user disable --now whisper-server dictate-smart-proxy
   parakeet-asr parakeet-stream` on the Spark.

---

## 9. Open questions

- 4B QAT for every window, or 4B for windows and 12B for lift-off `/correct`? Needs a
  measured `llm_s` on the target host first.
- Keep the Parakeet live path on a CUDA box, or accept chunked live typing everywhere?
- Formatting commands ("bullet point ...") are learned from one few-shot pair; add a second
  pair per command type once Gemma output is observed in real use.
- Should `default.md` gain the Gemma prefix guard examples as few-shot instead of code?
