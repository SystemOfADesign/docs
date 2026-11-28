---
tags: [pill-button-optical-padding]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Our pill buttons look slightly off: the check icon in the "Approve" button isn't centered in the round end and the label text sits closer to the edge than our 16px padding should give. The button lives in Button.tsx with Tailwind classes and a small globals.css. Fix it for every variant we have (icon on the left, icon on the right, text only, icon only, and the small size) without changing how the buttons look otherwise, and give me before/after numbers so design can sign off.

Input files: Button.tsx, globals.css
