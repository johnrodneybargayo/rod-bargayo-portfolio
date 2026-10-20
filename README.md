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
  brevo-api.mjs          Brevo API v3 client (plain fetch, no SDK): email,
                         contacts, campaigns
  brevo.js               contact form email + newsletter opt-in through Brevo
  smtp.js                Hostinger Email fallback over SMTP (Node tls, no deps)
scripts/
  brevo-campaign.mjs     `npm run campaign`: create/schedule/send a Brevo campaign
campaigns/
  example.html           starter campaign email (copy it per campaign)
public/
  john_rodney_cutout.webp transparent cutout portrait (About section)
```

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in your Brevo key to test the form
npm run dev                  # http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import it at vercel.com/new. Vercel detects Next.js; keep the defaults.
3. Add the email settings below under **Project > Settings > Environment Variables**.
4. Redeploy (environment variables apply to new deployments only), then send
   yourself a test message from the live site.

Custom domain: **Project > Settings > Domains**, then follow Vercel's DNS
steps in Hostinger hPanel. Keep your MX records so your email keeps working.

## Contact form email: Brevo (free, 300 emails/day)

In Brevo (app.brevo.com):

1. **Verify a sender.** Senders, Domains & Dedicated IPs > Senders > Add a sender.
   Best: authenticate your domain (e.g. `auracreo.com`) under Domains by adding
   the DNS records Brevo shows into Hostinger hPanel > DNS. Mail from an
   authenticated domain rarely lands in spam.
2. **Create an API key.** SMTP & API > API Keys > Generate a new API key.
   Copy it once; Brevo won't show it again.

In Vercel, add:

| Name            | Value                                                    |
|-----------------|----------------------------------------------------------|
| `BREVO_API_KEY` | the key from step 2 (starts with `xkeysib-`)             |
| `MAIL_FROM`     | the verified sender, e.g. `hello@auracreo.com`           |
| `MAIL_TO`       | your inbox, where messages arrive (Gmail is fine)        |

Replying to a form email goes straight to the visitor (Reply-To is set).

**If the form says it couldn't send**, open Vercel > Project > Logs and find
the `/api/contact` entry:

| Log message                                   | Fix                                             |
|-----------------------------------------------|-------------------------------------------------|
| `no email provider configured`                | Add the variables above, then redeploy.         |
| `MAIL_FROM / MAIL_TO are missing`             | Add both, then redeploy.                        |
| `HTTP 401` with `unauthorized`                | Wrong or deleted API key. Generate a new one.   |
| `HTTP 401` mentioning an unrecognised IP      | Brevo is blocking unknown IPs. In Brevo's security settings, turn off IP blocking for API keys (Vercel's IPs change). |
| `HTTP 400` mentioning the sender              | `MAIL_FROM` isn't verified in Brevo yet.        |

The API key is never written to the logs.

**Alternative:** leave `BREVO_API_KEY` empty and set `SMTP_USER` / `SMTP_PASS`
to a Hostinger mailbox instead; the form then sends through Hostinger Email.

## Email campaigns (Brevo)

Visitors who tick **"Send me occasional updates"** on the contact form are
added to your Brevo list. You then send that list a campaign from your computer.

1. In Brevo, create a list: **Contacts > Lists > Create a list**. Note its ID.
2. Set `BREVO_LIST_ID` to that ID in Vercel (and in `.env.local`), then redeploy.
3. Copy `campaigns/example.html`, write your update, and run:

```bash
# saved as a draft in Brevo, review it there before sending
npm run campaign -- --subject "New work: ESL plugin" --html campaigns/my-update.html

# schedule it (ISO time with timezone)
npm run campaign -- --subject "New work" --html campaigns/my-update.html --schedule 2026-11-01T09:00:00+08:00

# send right away
npm run campaign -- --subject "New work" --html campaigns/my-update.html --send-now
```

`--lists 2,7` sends to other lists; `--template 12` uses a Brevo template
instead of an HTML file; `npm run campaign -- --help` lists everything.
The command reads `BREVO_API_KEY` and `MAIL_FROM` from `.env.local`; it runs
only on your computer, so the key never reaches the browser.

Keep the `{{ unsubscribe }}` link in every campaign; Brevo requires it.
If signing up fails (e.g. a wrong list ID), the contact message still sends
and the log shows `contact brevo subscribe error`.

## Portrait

The About section uses `public/john_rodney_cutout.webp` (960 x 1351, transparent
WebP, about 125 KB). To replace it, export a transparent cutout cropped tight to
the subject, about 960px wide, as WebP with alpha, and keep the same file name.
If the file is missing, the section shows your profile photo in an arch frame.

## Live chat (Brevo Conversations)

1. In Brevo, open **Conversations** and finish the setup. Under **Settings > Widget**,
   copy the `BrevoConversationsID` from the install code. Pick the widget language there too.
2. In Vercel, add `NEXT_PUBLIC_BREVO_CONVERSATIONS_ID` with that ID, then redeploy.
   (Variables starting with `NEXT_PUBLIC_` are built into the page, so a redeploy is required.)

The chat widget (mascot + chat window, `components/ChatWidget.jsx`) appears bottom right;
with the ID set, its quick actions and messages open Brevo's live chat. Without it,
messages go into the contact form instead. Mascot images live in `public/mascot/`. Brevo's script only loads after the
visitor's first interaction (or when they press the button), so it doesn't affect
page speed. Reply from Brevo's web inbox or the Brevo mobile app.

If Brevo's install code shows a different script address than
`https://conversations-widget.brevo.com/brevo-conversations.js`, set it in
`NEXT_PUBLIC_BREVO_CONVERSATIONS_SRC`.

## Contact form protection

- Hidden honeypot field: bots that fill it get a fake success; nothing is sent.
- Time trap: forms sent in under 3 seconds are refused.
- About 5 messages per hour per visitor (best effort on serverless).
- Same-site only: posts from other domains are refused.
- If sending fails, the visitor sees your email address as a backup.

## Old static version

`legacy-static/` holds the previous single-file version for reference.
It is ignored by Git and by Vercel, and can be deleted.
