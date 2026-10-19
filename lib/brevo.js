/*
 * Website side of Brevo:
 *   brevoSend        one transactional email (the contact form message to you)
 *   brevoSubscribe   adds a visitor who opted in to your Brevo list, so your
 *                    campaigns (npm run campaign) can reach them
 * Plain fetch, no SDK. API helpers live in lib/brevo-api.mjs.
 *
 * The sender address must be registered and verified in Brevo
 * (Brevo > Senders, Domains & Dedicated IPs). Errors name the problem
 * but never include the API key.
 */

import { brevoRequest, brevoAddContact, parseListIds } from "./brevo-api.mjs";

export function brevoConfig() {
    return {
        apiKey: process.env.BREVO_API_KEY || "",
        from: process.env.MAIL_FROM || "",
        to: process.env.MAIL_TO || process.env.MAIL_FROM || "",
        fromName: process.env.FROM_NAME || "Rod Bargayo Portfolio",
        listIds: parseListIds(process.env.BREVO_LIST_ID)
    };
}

const escapeHtml = s =>
    String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function brevoSend(cfg, { subject, text, replyTo, replyName }) {
    const html =
        `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#102a57">` +
        escapeHtml(text).replace(/\n/g, "<br>") +
        `</div>`;

    await brevoRequest(cfg.apiKey, "/smtp/email", {
        sender: { name: cfg.fromName, email: cfg.from },
        to: [{ email: cfg.to }],
        replyTo: { email: replyTo, name: replyName },
        subject,
        textContent: text,
        htmlContent: html
    });
}

export async function brevoSubscribe(cfg, { email, name }) {
    if (!cfg.apiKey || !cfg.listIds.length) return false;
    await brevoAddContact(cfg.apiKey, {
        email,
        listIds: cfg.listIds,
        attributes: name ? { FIRSTNAME: name.split(/\s+/)[0] } : undefined
    });
    return true;
}
