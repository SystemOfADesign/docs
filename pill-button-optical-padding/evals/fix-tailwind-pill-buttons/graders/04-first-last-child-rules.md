---
type: llm
focus: trace
weight: 1
---

The styles apply the per-child edge value through rules equivalent to `> :first-child { margin-inline-start: var(--edge) }` and `> :last-child { margin-inline-end: var(--edge) }`, so icon-left, icon-right, text-only and icon-only variants all work without separate hand-written margins.
