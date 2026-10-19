# Rod Bargayo portfolio (Next.js)

Next.js 16 (App Router) + React 19. No other dependencies: no Tailwind, no UI
kit, no email package. Styles are hand-written CSS with hardcoded hex colours
and a class prefix per section.

```
app/
  layout.js              fonts (bundled, see app/fonts) + page metadata
  page.js                renders <Portfolio />
  globals.css            all styles (jr- shell, jrh- overview, jre- expertise,
                         jrw- work, jrl- demos, jra- about, jrc- contact, jrm- overlays)
  api/contact/route.js   contact form handler (Node runtime)
  fonts/                 Manrope, DM Mono, Anton (SIL Open Font License)
components/
  Portfolio.jsx          horizontal section engine, nav, keyboard/wheel/swipe
  sections/              Overview, Expertise, Work, Demos, About, Contact
  demos/                 the five plugin demos (sample data, run in the browser)
  ProjectModal.jsx       project overlay: full-page screenshot, live tab, fallback
  ContactModal.jsx       contact form
  Modal.jsx              shared overlay (Escape, focus trap, focus return)
lib/
  data.js                ALL CONTENT: links, projects, experience. Edit here.
  smtp.js                tiny SMTP client for Hostinger Email (Node tls, no deps)
public/
  john_rodney_cutout.png ADD THIS: transparent cutout portrait
```

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in your Hostinger mailbox to test the form
npm run dev                  # http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import it at vercel.com/new. Vercel detects Next.js; keep the defaults.
3. **Project > Settings > Environment Variables**, add:

   | Name        | Value                                               |
   |-------------|-----------------------------------------------------|
   | `SMTP_USER` | your Hostinger mailbox, e.g. `hello@yourdomain.com` |
   | `SMTP_PASS` | that mailbox's password                             |
   | `MAIL_TO`   | optional; where messages land (defaults to `SMTP_USER`) |

4. Redeploy (environment variables apply to new deployments only), then send
   yourself a test message from the live site.

If sending fails, **Project > Logs** shows which step failed (for example
`AUTH password`). The password is never written to the logs.

Custom domain: **Project > Settings > Domains**, then follow Vercel's DNS
steps in Hostinger hPanel. Keep your MX records so Hostinger Email keeps working.

## Portrait

Put your transparent cutout at `public/john_rodney_cutout.png`. Without it,
the About section shows your profile photo in an arch frame instead.

## Contact form protection

- Hidden honeypot field: bots that fill it get a fake success; nothing is sent.
- Time trap: forms sent in under 3 seconds are refused.
- About 5 messages per hour per visitor (best effort on serverless).
- Same-site only: posts from other domains are refused.
- If sending fails, the visitor sees your email address as a backup.

## Old static version

`legacy-static/` holds the previous single-file version for reference.
It is ignored by Git and by Vercel, and can be deleted.
# rod-bargayo-portfolio
