/*
 * Small Brevo API v3 client: plain fetch, no SDK.
 * Shared by the website (lib/brevo.js, app/api/contact) and the
 * campaign command (scripts/brevo-campaign.mjs).
 * Reference: https://developers.brevo.com/reference/quickstart-reference
 *
 * Errors name the problem but never include the API key.
 */

const BASE = (process.env.BREVO_API_BASE || "https://api.brevo.com/v3").replace(/\/+$/, "");

export async function brevoRequest(apiKey, path, body, { timeoutMs = 15000 } = {}) {
    if (!apiKey) throw new Error("BREVO_API_KEY is not set");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res;
    try {
        res = await fetch(BASE + path, {
            method: "POST",
            headers: {
                "api-key": apiKey,
                "content-type": "application/json",
                accept: "application/json"
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: controller.signal
        });
    } catch (err) {
        throw new Error(err.name === "AbortError" ? "Brevo timeout" : "Brevo connection error: " + err.message);
    } finally {
        clearTimeout(timer);
    }

    let data = null;
    const raw = await res.text().catch(() => "");
    if (raw) { try { data = JSON.parse(raw); } catch { data = null; } }

    if (res.ok) return { status: res.status, data };

    const detail = data ? [data.code, data.message].filter(Boolean).join(": ") : res.statusText;
    const err = new Error(`Brevo ${path} failed (HTTP ${res.status}) ${detail}`.trim());
    err.status = res.status;
    err.code = data?.code;
    throw err;
}

/* Parse "2, 7" / [2, 7] / "2" into [2, 7]; drops anything that isn't a positive integer. */
export function parseListIds(value) {
    const items = Array.isArray(value) ? value : String(value || "").split(",");
    return items.map(v => Number(String(v).trim())).filter(n => Number.isInteger(n) && n > 0);
}

/*
 * Add (or update) a contact and put it on one or more lists.
 * POST /contacts  ->  201 created, 204 updated (updateEnabled)
 */
export async function brevoAddContact(apiKey, { email, listIds, attributes }) {
    const body = { email, updateEnabled: true };
    if (listIds?.length) body.listIds = listIds;
    if (attributes && Object.keys(attributes).length) body.attributes = attributes;
    const { data } = await brevoRequest(apiKey, "/contacts", body);
    return data?.id ?? null;
}

/*
 * Create an email campaign. POST /emailCampaigns -> 201 { id }
 *   sender:      { name, email }  (email must be a verified Brevo sender)
 *   htmlContent: full HTML of the email (or pass templateId instead)
 *   listIds:     recipients, e.g. [2, 7]
 *   scheduledAt: optional; ISO 8601 with timezone, e.g. 2026-11-01T09:00:00+08:00
 * Without scheduledAt the campaign is saved as a draft in Brevo.
 */
export async function brevoCreateCampaign(apiKey, { name, subject, sender, htmlContent, templateId, listIds, scheduledAt, replyTo, previewText }) {
    if (!name) throw new Error("Campaign name is required");
    if (!sender?.email) throw new Error("Sender email is required (MAIL_FROM)");
    if (!htmlContent && !templateId) throw new Error("Give the campaign htmlContent or a templateId");
    if (!listIds?.length) throw new Error("Give at least one recipient list id");

    const body = { name, subject, sender, recipients: { listIds } };
    if (templateId) body.templateId = Number(templateId);
    else body.htmlContent = htmlContent;
    if (scheduledAt) body.scheduledAt = scheduledAt;
    if (replyTo) body.replyTo = replyTo;
    if (previewText) body.previewText = previewText;

    const { data } = await brevoRequest(apiKey, "/emailCampaigns", body);
    return data?.id;
}

/* Send a saved campaign right away. POST /emailCampaigns/{id}/sendNow -> 204 */
export async function brevoSendCampaignNow(apiKey, campaignId) {
    await brevoRequest(apiKey, `/emailCampaigns/${encodeURIComponent(campaignId)}/sendNow`);
}
