---
type: llm
focus: trace
weight: 1
---

The radius variable used inside the strip formula is the real rendered radius (var(--pill) for a full pill); 9999px / rounded-full is never fed into the math, although rounded-full may remain for the visual.
