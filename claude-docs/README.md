# Claude Docs screenshots

UI captures of claude.ai Claude Docs (the "Docs" artifact type). Taken 2026-11-04, Chrome on macOS. All shots use the same test doc, "Sample Document", opened from a chat at `claude.ai/chat/<id>?artifact=<id>`.

## Common layout (every shot)

- **Left rail:** New, Search, Projects, Artifacts, Scheduled, Design, Customize, Recents list. Doc-backed chats show a small doc icon next to the title.
- **Middle pane (chat):** the thread that owns the doc. Each doc edit via comment appears as a card: "Comment on 'Sample Document' sent to Claude", followed by "Used Claude Docs" (tool call) and a doc chip "Sample Document / Claude Docs / Only you", then Claude's short chat reply.
- **Right pane (doc):** title bar with doc-name dropdown, Share, comments toggle, expand, close. Toolbar: doc-name dropdown, text style (Tt), code, table, image, checklist, `+` insert.
- **Footer:** model picker shows "Opus 5.5 Medium", effort "Manual".
- **Comment-to-Claude mechanics (visible in chat):** the relayed comment carries a hidden system preamble telling Claude to write directly at the marked line in the doc and not reply in the thread; the user's actual text follows ("Can you write a sample 2 paragraphs on the book - twilight", then "Tighten the selected passage in place...").

## Captures

### Night session (00:19 to 00:21)

- **[claude-docs-2026-11-04-001949.png](claude-docs-2026-11-04-001949.png)** Baseline view. Doc with two Twilight paragraphs and a trailing user-typed line "This is amazing". Comments panel closed. Shows the full chat-side record of two comment-driven edits.
- **[claude-docs-2026-11-04-002052.png](claude-docs-2026-11-04-002052.png)** Text selection + floating toolbar. Second paragraph selected; inline bubble toolbar appears above it with: Claude spark (ask Claude), comment, suggest/improve, text style, Bold, Italic, Underline, Strikethrough, code, color, list, link.
- **[claude-docs-2026-11-04-002058.png](claude-docs-2026-11-04-002058.png)** Empty-line placeholder. Cursor on a new line shows ghost text "Start typing, or ask @Claude to write or edit". A Claude spark marker sits in the right margin of the paragraph that has a resolved comment.
- **[claude-docs-2026-11-04-002113.png](claude-docs-2026-11-04-002113.png)** Inline "ask Claude" composer. Selected paragraph highlighted; a composer appears under it prefilled with the `@Claude` chip and placeholder "Tell Claude what to change". Quick-action chips: "Make it shorter", "Make it simpler", "Fix spelling and grammar".

### Morning session (06:32 to 06:33)

- **[claude-docs-2026-11-04-063203.png](claude-docs-2026-11-04-063203.png)** Comments toggle tooltip. Hovering the speech-bubble icon in the doc title bar shows "Show all comments". Left rail now includes Search (compare night shots, which lack it).
- **[claude-docs-2026-11-04-063213.png](claude-docs-2026-11-04-063213.png)** Comments panel, Resolved (2). Right sidebar lists two resolved threads. Thread 1 anchored to "Whole document": user asks for two Twilight paragraphs, Claude replies "Added two paragraphs on Twilight under the title: plot overview, then climax, themes and impact." Thread 2 anchored to a quoted excerpt of paragraph 2: user asks to tighten it, Claude replies listing every claim kept. Each thread shows author, timestamp, resolved check.
- **[claude-docs-2026-11-04-063222.png](claude-docs-2026-11-04-063222.png)** Comment overflow menu. The `...` on a comment opens: Copy link, Edit, Reopen, Delete comment (red). An "Ask Claude to edit" reply box sits under the thread.
- **[claude-docs-2026-11-04-063238.png](claude-docs-2026-11-04-063238.png)** Resolve tooltip. Hovering the check icon on a thread shows "Resolve". Panel header reads "Comments 1" (one open) plus "Resolved (2)" group.
- **[claude-docs-2026-11-04-063250.png](claude-docs-2026-11-04-063250.png)** Anchor highlight on hover. Hovering thread 2 highlights its anchored paragraph in the doc (amber). Shows the thread-to-text linkage.
- **[claude-docs-2026-11-04-063309.png](claude-docs-2026-11-04-063309.png)** Reply composer with "Send to Claude". Clicking into a thread's reply box expands it: placeholder "Ask Claude to edit", a checked "Send to Claude" checkbox, and a send arrow. Anchored paragraph underlined in the doc.
- **[claude-docs-2026-11-04-063329.png](claude-docs-2026-11-04-063329.png)** Doc-name dropdown menu. Header shows "Document by you / Updated 2 days ago". Items: Hide comments (badge 1), Version history, Share, Export, Rename, Pin, Install artifact (disabled), Refresh, Permissions, Report artifact, Delete artifact (red).
- **[claude-docs-2026-11-04-063336.png](claude-docs-2026-11-04-063336.png)** Version history panel. Right sidebar "History" lists snapshots: Monday 9:48 AM (Current, Nikhil), 9:46 AM (Nikhil), 9:46 AM (Claude, 2 versions, expandable), 9:43 AM (Nikhil). Claude edits are attributed separately from user edits. Resolved comment thread floats in the doc margin.
- **[claude-docs-2026-11-04-063345.png](claude-docs-2026-11-04-063345.png)** Share tab. Popover with Share / Export tabs. Share: "Invite people by email" field, People with access (owner row with email and "Owner" role dropdown), General access "Only you" dropdown, footer "Only you can open this link" + "Copy private link". Gear icon for settings.
- **[claude-docs-2026-11-04-063353.png](claude-docs-2026-11-04-063353.png)** Export tab. Top callout "Sending this to someone? Share the link instead of a file..." with "Invite people" and "Copy public link" buttons, note that public link is view-only. Download formats: Word (.docx), PDF, Markdown (.md). Send to: Google Docs, Notion, "More formats and apps".

## Feature inventory observed

| Area | Capabilities seen |
|---|---|
| Editing | Rich text toolbar (bold, italic, underline, strike, code, color, lists, link, headings), table, image, checklist, inline `@Claude` edit composer with quick actions |
| Claude in doc | Comment-to-Claude on whole doc or selection; Claude writes in place and replies in the thread; chat pane logs each edit as a tool call |
| Comments | Sidebar panel, open/resolved groups, anchor highlight on hover, resolve/reopen, edit, copy link, delete, reply with optional "Send to Claude" |
| History | Version history with per-author snapshots, Claude edits grouped as multiple versions |
| Sharing | Invite by email, owner role, general access control, private link, public view-only link |
| Export | docx, pdf, md download; send to Google Docs, Notion, more apps |
| Doc management | Rename, Pin, Refresh, Permissions, Report, Delete |
