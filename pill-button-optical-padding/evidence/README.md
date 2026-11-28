# Evidence files

- `metadata.txt`: yt-dlp info for the reel (id, account, caption, upload date).
- `transcript.srt`: mlx-whisper (`whisper-large-v3-turbo`) transcript, segment timestamps.
- `transcript-words.json`: same transcript with word-level timestamps.
- `frames/frame_00NN.jpg`: 17 of the 60 uniformly sampled frames (frame N ≈ (N − 0.5) × 1.875 s), downscaled to 540 px. Chosen to show every CSS state and every dimension readout; `references/reel-evidence.md` maps each to time and content.

Not committed: the video file and audio (copyright; re-download with the URL in `metadata.txt`).
