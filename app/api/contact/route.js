import { smtpConfig, smtpSend } from "@/lib/smtp";

/* SMTP needs Node's tls module, so this route runs on the Node.js runtime */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_SECONDS = 3;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

/* Best-effort per-IP limit. Serverless instances are short-lived, so this
   slows bursts rather than guaranteeing a hard cap. */
const hits = new Map();

const json = (status, payload) =>
    Response.json(payload, { status, headers: { "Cache-Control": "no-store" } });

const cleanLine = (value, max) => String(value || "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

export async function POST(request) {
    /* Only accept posts from this site */
    const origin = request.headers.get("origin");
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    if (origin) {
        let originHost = "";
        try { originHost = new URL(origin).host; } catch { originHost = ""; }
        if (originHost !== host) return json(403, { ok: false, error: "This form can only be sent from the website." });
    }

    const cfg = smtpConfig();
    if (!cfg.user || !cfg.pass) {
        console.error("contact: SMTP_USER / SMTP_PASS environment variables are not set");
        return json(500, { ok: false, error: "The form is not set up yet." });
    }

    let body;
    try {
        body = Object.fromEntries(await request.formData());
    } catch {
        return json(400, { ok: false, error: "Please reload the page and try again." });
    }

    /* Spam checks: honeypot, time trap, rate limit */
    if (String(body.website || "").trim() !== "") return json(200, { ok: true });

    const started = Number(body.started || 0);
    const elapsed = (Date.now() - started) / 1000;
    if (!started || elapsed < MIN_SECONDS || elapsed > 86400) {
        return json(400, { ok: false, error: "Please reload the page and try again." });
    }

    const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => t > now - RATE_WINDOW_MS);
    if (recent.length >= RATE_LIMIT) {
        return json(429, { ok: false, error: "Too many messages from this connection. Please try again later." });
    }

    /* Validate */
    const name = cleanLine(body.name, 100);
    const email = cleanLine(body.email, 160);
    const project = cleanLine(body.project, 120);
    const message = String(body.message || "").slice(0, 5000).trim();

    const fields = [];
    if (!name) fields.push("name");
    if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) fields.push("email");
    if (!message) fields.push("message");
    if (fields.length) return json(422, { ok: false, error: "Please check your name, email and message.", fields });

    const text = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${project || "Not specified"}`,
        `Sent: ${new Date().toISOString()}`,
        `IP: ${ip}`,
        "",
        message.replace(/\r\n?/g, "\n")
    ].join("\n");

    try {
        await smtpSend(cfg, {
            subject: `[Portfolio] ${project || "New project inquiry"} from ${name}`,
            text,
            replyTo: email,
            replyName: name
        });
    } catch (err) {
        console.error("contact SMTP error:", err.message);
        return json(502, { ok: false, error: "Sorry, the message couldn't be sent right now." });
    }

    recent.push(now);
    hits.set(ip, recent);
    return json(200, { ok: true });
}

export function GET() {
    return json(405, { ok: false, error: "Method not allowed." });
}
