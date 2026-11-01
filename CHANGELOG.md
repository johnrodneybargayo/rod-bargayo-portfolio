# Changelog

All notable changes to the Rod Bargayo portfolio.
Versions follow [Semantic Versioning](https://semver.org/): a fix or tweak to an
existing feature is a patch (2.1.x), a new feature or a content repositioning is
a minor (2.x.0).

## [2.1.2] - 2026-11-01

### Fixed
- Opening the chat no longer leaves the "Minimize chat" pill and mascot
  showing behind the panel. The launcher fades out while the chat is open
  (the panel's own minimize and close buttons take over), the panel moves down
  into its spot, and the launcher comes back when the chat closes. Works on
  desktop and mobile.

## [2.1.1] - 2026-11-01

### Fixed
- Case study and project previews now fill the full width of the pop-up.
  Some sites (Podify's scrolling marquee) stretched the full-page capture
  sideways, so the page showed as a narrow strip on the left. Captures are now
  taken at a fixed 1280px desktop width with sideways overflow clipped, and any
  capture that still comes back too wide is cropped to the real page width.
- Previews that finished loading before the pop-up was ready no longer get
  stuck hidden.

### Changed
- All buttons are text only: the round arrow icons inside buttons are gone,
  including the pop-up's "Visit live site" and "I want results like this".
- Buttons restyled to look raised instead of flat: gradient fill, top
  highlight, inner base shade, soft coloured glow, lift on hover and a light
  sweep across. Applies to the gold and white buttons, the About button, the
  case study card button and the automation demo's run button.

## [2.1.0] - 2026-11-01

Repositioned the whole site for business owners. Every section now leads with
what the work earns or saves a business (leads, sales, upfront payments, hours
of admin), not the tools or languages behind it.

### Added
- Case studies in `lib/data.js` (`FEATURED`): each has a `result` headline,
  `challenge`, `solution`, `impact` list and an empty `metrics` slot.
  Metrics render as stat tiles only when real numbers are filled in, e.g.
  `{ value: "+38%", label: "more enquiries in 90 days" }`.
- Case study pop-up: "The problem / What I built / What changed" columns under
  a shorter site preview, with an "I want results like this" button that
  pre-fills the contact form.
- King Operating case study (conversion tracking fix, campaign landing pages).
- `outcome` line for every entry in the "More businesses I've helped" list,
  shown in the preview pop-up and as the link tooltip.
- New `jrcs-` CSS block (case studies) at the end of `app/globals.css`.
- This changelog.

### Changed
- Sections renamed: Expertise to **Solutions**, Selected work to **Client
  results**, Plugin demos to **Try it live**, About me to **Why work with me**,
  Contact to **Free growth review**.
- Overview: headline "More leads. More sales. Less admin.", buttons "See client
  results" and "Get a free growth review", Podify result card, and a
  "How I work" card (Find the leak / Fix it / Measure it) replacing
  "20+ projects shipped".
- Solutions: cards rewritten as business problems (turn visitors into
  customers, let clients serve themselves, get paid faster, know what makes you
  money, turn customers into your sales team, stop doing admin by hand).
  Tool and framework logos removed; payment options kept and relabelled
  "Your customers can pay with". Automation demo rewritten in plain language.
- Client results: cards lead with the business result; featured card shows
  the client's wins instead of tech tags; hero row shows outcomes instead of
  skills.
- Try it live: demo tabs describe the business benefit; portal demo labels
  ("Simulate team progress", "Happening automatically" activity feed) no
  longer mention webhooks or ClickUp.
- Why work with me: headline "Think PROFIT / Build GROWTH", owner-first intro
  as co-founder of Aura Creo, features "Results you can measure / Plain
  English, no jargon / Support after launch", list renamed Background.
- Experience list: added Co-Founder and COO (Aura Creo) and Developer and
  Marketer (Go Online Now-Connect).
- Free growth review: free 2 to 3 ideas within one business day offer;
  sign-off shows "Co-founder, Aura Creo / Cebu, Philippines".
- Contact form: business-focused title, intro, field label ("What you want
  more of") and placeholders.
- Chat assistant: business-first topics (How can you help me?, Client results,
  Pricing, Timeline), rewritten answers and section tips.
- Sidebar: "Taking new clients" with a Free growth review link; topbar role
  "Websites that grow revenue".
- Page title and description rewritten for business owners.
- Labour Hire and Recruitment moved from the featured cards to the list.

### Removed
- "Head of Information Technology" from the Experience list.
- "WordPress Website Developer (Independent)", replaced by the Aura Creo role.

## [2.0.0] - 2026-10-20 to 2026-10-21

First Next.js version (replaces the single-file static site in `legacy-static/`).

### Added
- Next.js 16 + React 19 app: horizontal section engine with keyboard, wheel
  and swipe paging; sections Overview, Expertise, Selected work, Plugin
  demos, About, Contact.
- Five in-browser plugin demos with sample data: client portal, referrals and
  affiliates, ESL lesson scheduler, sticky booking calendar, resource access
  gate.
- Project preview pop-up with full-page screenshot, live tab and fallback.
- Contact form through Brevo with Hostinger SMTP fallback, honeypot spam
  protection and newsletter opt-in.
- Brevo API client and `npm run campaign` for email campaigns.
- Brevo Conversations live chat with a scripted chat assistant and animated
  avatar.
- Expanded services in the Expertise section and an updated project list.

### Changed
- Layout, icons and page performance optimised across all sections.
