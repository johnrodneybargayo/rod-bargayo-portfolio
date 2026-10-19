import tls from "node:tls";
import crypto from "node:crypto";

/*
 * Minimal SMTP client for Hostinger Email: implicit TLS on 465 + AUTH LOGIN.
 * Built on Node's own tls module, so there is nothing to install.
 * Error messages name the step that failed and never include credentials.
 */
export function smtpConfig() {
    return {
        host: process.env.SMTP_HOST || "smtp.hostinger.com",
        port: Number(process.env.SMTP_PORT || 465),
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
        to: process.env.MAIL_TO || process.env.SMTP_USER || "",
        fromName: process.env.FROM_NAME || "Rod Bargayo Portfolio",
        /* local testing against a self-signed server only; never set in production */
        insecureTls: process.env.SMTP_INSECURE === "1"
    };
}

export function smtpSend(cfg, { subject, text, replyTo, replyName }) {
    return new Promise((resolve, reject) => {
        const socket = tls.connect({
            host: cfg.host,
            port: cfg.port,
            servername: /^\d+\.\d+\.\d+\.\d+$/.test(cfg.host) ? undefined : cfg.host,
            rejectUnauthorized: !cfg.insecureTls
        });

        let buffer = "";
        let waiting = null;
        const timer = setTimeout(() => fail(new Error("SMTP timeout")), 20000);

        function fail(err) {
            clearTimeout(timer);
            socket.destroy();
            reject(err);
        }

        socket.setEncoding("utf8");
        socket.on("error", err => fail(new Error("Connection error: " + err.message)));
        socket.on("data", chunk => {
            buffer += chunk;
            /* a reply is complete when a line has a space right after the code */
            const lines = buffer.split("\r\n");
            for (let i = 0; i < lines.length - 1; i++) {
                if (/^\d{3} /.test(lines[i])) {
                    const reply = lines.slice(0, i + 1).join("\n");
                    buffer = lines.slice(i + 1).join("\r\n");
                    if (waiting) {
                        const w = waiting;
                        waiting = null;
                        w(reply);
                    }
                    return;
                }
            }
        });

        const step = (line, expect, label) => new Promise((ok, no) => {
            waiting = reply => {
                const code = Number(reply.slice(0, 3));
                expect.includes(code) ? ok(reply) : no(new Error(`Unexpected reply at ${label}: ${reply.trim()}`));
            };
            if (line !== null) socket.write(line + "\r\n");
        });

        const b64 = s => Buffer.from(s, "utf8").toString("base64");
        const word = s => `=?UTF-8?B?${b64(s)}?=`;
        const domain = cfg.user.split("@")[1] || "localhost";

        (async () => {
            await step(null, [220], "greeting");
            await step(`EHLO ${domain}`, [250], "EHLO");
            await step("AUTH LOGIN", [334], "AUTH LOGIN");
            await step(b64(cfg.user), [334], "AUTH username");
            await step(b64(cfg.pass), [235], "AUTH password (check SMTP_USER / SMTP_PASS)");
            await step(`MAIL FROM:<${cfg.user}>`, [250], "MAIL FROM");
            await step(`RCPT TO:<${cfg.to}>`, [250, 251], `RCPT TO ${cfg.to}`);
            await step("DATA", [354], "DATA");

            const headers = [
                `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
                `From: ${word(cfg.fromName)} <${cfg.user}>`,
                `To: <${cfg.to}>`,
                `Reply-To: ${word(replyName)} <${replyTo}>`,
                `Subject: ${word(subject)}`,
                `Message-ID: <${crypto.randomBytes(12).toString("hex")}@${domain}>`,
                "MIME-Version: 1.0",
                "Content-Type: text/plain; charset=UTF-8",
                "Content-Transfer-Encoding: base64"
            ];
            /* base64 body: no line-length or dot-stuffing issues */
            const body = b64(text).replace(/.{1,76}/g, "$&\r\n").trimEnd();
            await step(`${headers.join("\r\n")}\r\n\r\n${body}\r\n.`, [250], "message body");
            await step("QUIT", [221], "QUIT");
            clearTimeout(timer);
            socket.end();
            resolve();
        })().catch(fail);
    });
}
