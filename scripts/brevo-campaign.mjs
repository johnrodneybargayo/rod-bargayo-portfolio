#!/usr/bin/env node
/*
 * Create (and optionally schedule or send) a Brevo email campaign.
 * Runs on your computer, never on the website, so the API key stays private.
 *
 *   npm run campaign -- --subject "New work" --html campaigns/example.html
 *   npm run campaign -- --subject "New work" --html campaigns/example.html --schedule 2026-11-01T09:00:00+08:00
 *   npm run campaign -- --subject "New work" --html campaigns/example.html --send-now
 *
 * Options
 *   --name       campaign name in Brevo (default: subject + date)
 *   --subject    email subject (required unless --template)
 *   --html       path to an HTML file for the email body
 *   --template   Brevo template id, instead of --html
 *   --lists      recipient list ids, e.g. 2,7 (default: BREVO_LIST_ID)
 *   --schedule   send time, ISO 8601 with timezone, e.g. 2026-11-01T09:00:00+08:00
 *   --send-now   send immediately after creating
 *   --preview    preview text shown in inboxes
 * With neither --schedule nor --send-now, the campaign is saved as a draft
 * in Brevo (Campaigns > Email) so you can check it before it goes out.
 *
 * Reads BREVO_API_KEY, MAIL_FROM, FROM_NAME, MAIL_TO, BREVO_LIST_ID from
 * the environment or from .env.local.
 */

import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { brevoCreateCampaign, brevoSendCampaignNow, parseListIds } from "../lib/brevo-api.mjs";

try { process.loadEnvFile(".env.local"); } catch { /* no .env.local: use the shell environment */ }

const { values: opt } = parseArgs({
    options: {
        name: { type: "string" },
        subject: { type: "string" },
        html: { type: "string" },
        template: { type: "string" },
        lists: { type: "string" },
        schedule: { type: "string" },
        "send-now": { type: "boolean", default: false },
        preview: { type: "string" },
        help: { type: "boolean", short: "h", default: false }
    }
});

function stop(message) {
    console.error("campaign: " + message);
    console.error("Run `npm run campaign -- --help` for the options.");
    process.exit(1);
}

if (opt.help) {
    console.log((await readFile(new URL(import.meta.url), "utf8")).split("*/")[0].replace(/^#!.*\n\/\*\n?/, "").replace(/^ \* ?/gm, ""));
    process.exit(0);
}

const apiKey = process.env.BREVO_API_KEY;
const fromEmail = process.env.MAIL_FROM;
const listIds = parseListIds(opt.lists || process.env.BREVO_LIST_ID);

if (!apiKey) stop("BREVO_API_KEY is not set (add it to .env.local).");
if (!fromEmail) stop("MAIL_FROM is not set (a sender verified in Brevo).");
if (!listIds.length) stop("No recipient list. Pass --lists 2,7 or set BREVO_LIST_ID.");
if (!opt.html && !opt.template) stop("Pass --html <file> or --template <id>.");
if (!opt.subject && !opt.template) stop("Pass --subject.");
if (opt.schedule && opt["send-now"]) stop("Use --schedule or --send-now, not both.");
if (opt.schedule && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(opt.schedule)) {
    stop("--schedule needs ISO 8601 with a timezone, e.g. 2026-11-01T09:00:00+08:00");
}
if (opt.schedule && new Date(opt.schedule) <= new Date()) stop("--schedule is in the past.");

let htmlContent;
if (opt.html) {
    try { htmlContent = await readFile(opt.html, "utf8"); } catch { stop(`Can't read ${opt.html}`); }
}

const name = opt.name || `${opt.subject || "Campaign"} (${new Date().toLocaleDateString("en-CA")})`;

try {
    const id = await brevoCreateCampaign(apiKey, {
        name,
        subject: opt.subject,
        sender: { name: process.env.FROM_NAME || "Rod Bargayo", email: fromEmail },
        replyTo: process.env.MAIL_TO || undefined,
        htmlContent,
        templateId: opt.template,
        listIds,
        scheduledAt: opt.schedule,
        previewText: opt.preview
    });
    console.log(`Created campaign #${id} "${name}" for list(s) ${listIds.join(", ")}.`);

    if (opt["send-now"]) {
        await brevoSendCampaignNow(apiKey, id);
        console.log("Sending now. Track it in Brevo > Campaigns > Email.");
    } else if (opt.schedule) {
        console.log(`Scheduled for ${opt.schedule}.`);
    } else {
        console.log("Saved as a draft. Review and send it in Brevo > Campaigns > Email.");
    }
} catch (err) {
    stop(err.message);
}
