# Graph Report - rod-bargayo-portfolio  (2026-10-20)

## Corpus Check
- Corpus is ~11,344 words - fits in a single context window. You may not need a graph.

## Summary
- 162 nodes · 376 edges · 15 communities (14 shown, 1 thin omitted)
- Extraction: 93% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.84)
- Token cost: 91,708 input · 0 output

## Community Hubs (Navigation)
- Plugin Demos
- Package Manifest
- Fonts & Root Layout
- Contact API & Spam Guard
- Modals & Icons
- Brevo API & Campaigns
- Expertise & Work Content
- SMTP & Project Docs
- Page Shell & Navigation
- Overview & Contact Sections
- Newsletter Opt-in
- About Section
- Brevo Transactional Email
- Path Aliases
- Next.js Config

## God Nodes (most connected - your core abstractions)
1. `Icon()` - 25 edges
2. `README: Rod Bargayo portfolio (Next.js)` - 24 edges
3. `Portfolio()` - 15 edges
4. `BtnIsland()` - 14 edges
5. `react` - 14 edges
6. `SafeImg()` - 11 edges
7. `POST()` - 10 edges
8. `ProjectModal()` - 9 edges
9. `uid()` - 9 edges
10. `Work()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Brevo contact.FIRSTNAME personalization tag` --shares_data_with--> `brevoSubscribe()`  [AMBIGUOUS]
  campaigns/example.html → lib/brevo.js
- `Contact form error troubleshooting table` --references--> `POST()`  [INFERRED]
  README.md → app/api/contact/route.js
- `Contact form spam protection (honeypot, time trap, rate limit, same-site)` --conceptually_related_to--> `ContactModal()`  [INFERRED]
  README.md → components/ContactModal.jsx
- `Zero-dependency design (no Tailwind, no UI kit, no email package)` --rationale_for--> `brevoRequest()`  [INFERRED]
  README.md → lib/brevo-api.mjs
- `Email environment variables (BREVO_API_KEY, MAIL_FROM, MAIL_TO, BREVO_LIST_ID, SMTP_USER, SMTP_PASS)` --shares_data_with--> `brevoConfig()`  [INFERRED]
  README.md → lib/brevo.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Contact form email delivery with Brevo primary and SMTP fallback** — app_api_contact_route_post, lib_brevo_brevosend, lib_smtp_smtpsend, readme_brevo_contact_email, readme_hostinger_smtp_fallback [INFERRED 0.85]
- **Opt-in to campaign pipeline (subscribe, list, compose, send)** — lib_brevo_brevosubscribe, scripts_brevo_campaign, lib_brevo_api_brevocreatecampaign, campaigns_example, readme_email_campaign_workflow [INFERRED 0.85]
- **Bundled SIL OFL fonts used by the layout** — app_fonts_license_manrope, app_fonts_license_dm_mono, app_fonts_license_anton, app_fonts_license_sil_ofl [EXTRACTED 1.00]

## Communities (15 total, 1 thin omitted)

### Community 0 - "Plugin Demos"
Cohesion: 0.14
Nodes (23): DAYS, EslDemo(), initialSlots(), TAKEN, TIMES, GateDemo(), RESOURCES, store (+15 more)

### Community 1 - "Package Manifest"
Cohesion: 0.12
Nodes (16): dependencies, next, react, react-dom, description, engines, node, name (+8 more)

### Community 2 - "Fonts & Root Layout"
Cohesion: 0.16
Nodes (11): Fonts LICENSE (SIL Open Font License 1.1), Anton font (@fontsource/anton), DM Mono font (@fontsource/dm-mono), Manrope font (@fontsource-variable/manrope), SIL Open Font License 1.1, display, metadata, mono (+3 more)

### Community 3 - "Contact API & Spam Guard"
Cohesion: 0.22
Nodes (11): cleanLine(), dynamic, GET(), hits, json(), POST(), runtime, smtpSend() (+3 more)

### Community 4 - "Modals & Icons"
Cohesion: 0.40
Nodes (9): ContactModal(), EMPTY, RULES, BtnIsland(), Icon(), Modal(), ProjectModal(), hostOf() (+1 more)

### Community 5 - "Brevo API & Campaigns"
Cohesion: 0.24
Nodes (8): BASE, brevoAddContact(), brevoCreateCampaign(), brevoRequest(), brevoSendCampaignNow(), Brevo email campaign workflow (npm run campaign), listIds, { values: opt }

### Community 6 - "Expertise & Work Content"
Cohesion: 0.36
Nodes (8): CARDS, Expertise(), Work(), FEATURED, MORE_WORK, mshot(), SECTIONS, shot()

### Community 7 - "SMTP & Project Docs"
Cohesion: 0.24
Nodes (7): smtpConfig(), README: Rod Bargayo portfolio (Next.js), Per-section CSS class prefixes (jr-, jrh-, jre-, jrw-, jrl-, jra-, jrc-, jrm-), Email environment variables (BREVO_API_KEY, MAIL_FROM, MAIL_TO, BREVO_LIST_ID, SMTP_USER, SMTP_PASS), legacy-static/ old single-file version, Portrait cutout (public/john_rodney_cutout.png), Vercel deployment

### Community 8 - "Page Shell & Navigation"
Cohesion: 0.46
Nodes (6): Home(), IconSprite(), Portfolio(), Section(), Contact(), Demos()

### Community 9 - "Overview & Contact Sections"
Cohesion: 0.43
Nodes (4): SafeImg(), OPTIONS, Overview(), SITE

### Community 10 - "Newsletter Opt-in"
Cohesion: 0.33
Nodes (5): example.html starter campaign email, Brevo contact.FIRSTNAME personalization tag, {{ unsubscribe }} link, brevoSubscribe(), Newsletter opt-in (Send me occasional updates)

### Community 11 - "About Section"
Cohesion: 0.47
Nodes (5): About(), Portrait(), EXPERIENCE, favicon(), TRUSTED

### Community 12 - "Brevo Transactional Email"
Cohesion: 0.47
Nodes (5): parseListIds(), brevoConfig(), brevoSend(), escapeHtml(), Brevo contact form email delivery

### Community 13 - "Path Aliases"
Cohesion: 0.50
Nodes (3): compilerOptions, baseUrl, paths

## Ambiguous Edges - Review These
- `brevoSubscribe()` → `Brevo contact.FIRSTNAME personalization tag`  [AMBIGUOUS]
  campaigns/example.html · relation: shares_data_with

## Knowledge Gaps
- **3 isolated node(s):** `react-dom`, `Portrait cutout (public/john_rodney_cutout.png)`, `legacy-static/ old single-file version`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 52 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `README: Rod Bargayo portfolio (Next.js)` connect `SMTP & Project Docs` to `Fonts & Root Layout`, `Contact API & Spam Guard`, `Modals & Icons`, `Brevo API & Campaigns`, `Expertise & Work Content`, `Page Shell & Navigation`, `Newsletter Opt-in`, `Brevo Transactional Email`?**
  _High betweenness centrality (0.496) - this node is a cross-community bridge._
- **What connects `react-dom`, `Portrait cutout (public/john_rodney_cutout.png)`, `legacy-static/ old single-file version` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Plugin Demos` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Plugin Demos` to `Package Manifest`, `Modals & Icons`, `Page Shell & Navigation`, `Overview & Contact Sections`, `About Section`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Should `Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `Icon()` connect `Modals & Icons` to `Plugin Demos`, `Expertise & Work Content`, `Page Shell & Navigation`, `Overview & Contact Sections`, `About Section`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `brevoSubscribe()` and `Brevo contact.FIRSTNAME personalization tag`?**
  _Edge tagged AMBIGUOUS (relation: shares_data_with) - confidence is low._