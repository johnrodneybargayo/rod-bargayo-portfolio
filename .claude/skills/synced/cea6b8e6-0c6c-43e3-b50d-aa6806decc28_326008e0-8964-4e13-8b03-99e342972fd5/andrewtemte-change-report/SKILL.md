---
name: andrewtemte-change-report
description: "Use when Rod asks for a report, changelog, or summary of work done on the Andrew Temte site (theme/plugin). Formats changes as grouped, plain-language release notes."
---

# Andrew Temte — change report format

When Rod asks for "a report", "the list of report", a changelog, or a summary of what was built/changed on the Andrew Temte WordPress site, output **grouped release notes** in this exact style.

## Rules

- Group the changes under short **section headings** (plain text, no numbering). Use only the headings that apply to the work being reported. The standard set, in this order:
  - `New building blocks`
  - `LMS & forms`
  - `Diagnostics`
  - `Layout & content`
  - `Podcast tool (Podify)`
  - `Fixes`
  Add or drop headings to fit the actual work (e.g. `Accounts`, `Site & go-live`), but keep the same shape.
- Under each heading, use `*` bullets.
- Each bullet is written as **Name — plain-language explanation of what it does or why it matters**. Lead with the feature/block name (bold or backticked for shortcodes/code), then an em dash, then a non-technical clause a non-developer (Rod / Andy) can understand.
- Plain language only: say "the meta line", "the page", "turned off", not internal function names, hooks, or file paths. Never include code internals unless Rod asks.
- Keep bullets to one sentence. No sub-bullets.
- Do not wrap the whole thing in a code block — render it as normal formatted text so it reads as a report (unless Rod explicitly asks for copy-paste task lines for ClickUp, which is a different, terser format: one plain task per line, grouped into Lists).

## Example shape

New building blocks

* Newsletter / Form block — pick any form from Fluent Forms, Gravity Forms, or Contact Form 7 in one dropdown; editable eyebrow, heading, description, and cream/navy/plain tone
* Diagnostics shortcode `[andrewtemte_diagnostics]` — drop the diagnostic card grid onto any normal page

Diagnostics

* Every diagnostic card is now clickable (previously only "Available" ones were)
* Each diagnostic has its own page at `/diagnostic/<name>`

Fixes

* Book cover drop shadow removed
* Two-color headings render correctly on the front end (white + amber)

## Note

Rod also sometimes wants a **ClickUp task list** ("list of report I can copy and paste"). That is the terser variant: one short plain-language task per line, grouped into named Lists, optionally followed by suggested Status / Label / report-view values. Offer to save it into `Claude outputs/andrewtemte-clickup-report.md` in the theme folder or export as CSV when relevant.