"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";
import { SITE } from "@/lib/data";

/*
 * Chat widget with the illustrated mascot.
 *
 * 1. Assistant: answers common questions right away (canned answers below, no AI).
 * 2. "Talk to Rod": switches the panel to Brevo Conversations live chat, embedded
 *    inside this panel (mode: "frame"), so the mascot header stays. What the visitor
 *    already asked is sent along, so Rod sees the context.
 *
 * Nothing loads until the visitor's first interaction (`ready`). Brevo's script only
 * loads when someone asks for live chat, or when a live conversation already exists.
 */

/* Brevo Conversations ID: public by design (it is in every visitor's browser). */
const CHAT_ID = process.env.NEXT_PUBLIC_BREVO_CONVERSATIONS_ID || "6ad6946b117ca6ee6e034bdd";
const SCRIPT_SRC = "https://conversations-widget.brevo.com/brevo-conversations.js";
const LIVE_KEY = "jr-chat-live"; /* remembers that this visitor already went live */

/* ---------- mascot sprite: one image, one pose per cell ---------- */
const SPRITE = ["wave", "present", "happy", "thinking", "explaining", "welcome"];

function Mascot({ pose, className = "" }) {
    const i = Math.max(0, SPRITE.indexOf(pose));
    return <span className={`jrx-sprite ${className}`} style={{ "--i": i }} aria-hidden="true" />;
}

/* ---------- what the launcher mascot says on its own, by section ---------- */
const TIPS = [
    [["wave", "Hi! 👋 How can I help you?"], ["explaining", "Need a website that actually works?"], ["happy", "Questions? Click me, I answer fast."]],
    [["thinking", "Not sure which platform fits you?"], ["explaining", "Ask me about Zapier or Kajabi automations!"], ["happy", "I can set up your payments too."]],
    [["happy", "Like what you see?"], ["explaining", "Want a site like these? Let's talk!"], ["thinking", "Curious how one was built? Ask me!"]],
    [["explaining", "Try the demos, they're real plugins!"], ["thinking", "Need a custom plugin like these?"], ["wave", "Questions? I'm right here."]],
    [["wave", "Nice to meet you! 😊"], ["happy", "Let's build something together."], ["thinking", "Want to know how I work? Ask me!"]],
    [["welcome", "Prefer chatting? Click me!"], ["happy", "I usually reply within a day."], ["wave", "Say hi, I don't bite! 👋"]]
];

/* ---------- the assistant's answers ---------- */
const LIVE = { label: "Talk to Rod", live: true };
const TOPICS = [
    { label: "Services", topic: "services" },
    { label: "Pricing", topic: "pricing" },
    { label: "Timeline", topic: "timeline" },
    { label: "Platforms", topic: "platforms" }
];

const ANSWERS = {
    hello: {
        pose: "wave",
        text: "Hi there! 👋 I'm Rod's assistant. Ask me about services, pricing, timelines or platforms, or talk to Rod directly.",
        chips: [...TOPICS, LIVE]
    },
    services: {
        pose: "explaining",
        text: "Rod builds websites and web apps, custom WordPress plugins, online stores and payments, automations between your tools (Zapier, Kajabi, Brevo, Mautic), tracking and dashboards, plus hosting and long-term care.",
        chips: [{ label: "Pricing", topic: "pricing" }, { label: "See examples", topic: "work" }, LIVE]
    },
    pricing: {
        pose: "thinking",
        text: "Every project is quoted on its scope, so you only pay for what you need. Tell Rod what you have in mind and he'll send a clear quote, usually within one business day.",
        chips: [{ label: "Get a quote", live: true }, { label: "Timeline", topic: "timeline" }]
    },
    timeline: {
        pose: "thinking",
        text: "It depends on the size of the project. Rod gives you a timeline together with the quote, and keeps you posted at each step: discover, build, launch.",
        chips: [{ label: "Start a project", topic: "start" }, LIVE]
    },
    platforms: {
        pose: "explaining",
        text: "WordPress, Shopify, Squarespace, Framer, React and Next.js. Designs from Figma or Canva, newsletters on Substack, payments with Stripe, PayPal, Kajabi, Shopify Payments, HitPay, PayMongo or Payoneer.",
        chips: [{ label: "Which one fits me?", live: true }, { label: "Services", topic: "services" }]
    },
    wordpress: {
        pose: "happy",
        text: "WordPress is Rod's specialty: custom themes, custom plugins (like Podify's client portal and referral program), WooCommerce stores, speed and security fixes.",
        chips: [{ label: "Try the plugin demos", go: 3 }, LIVE]
    },
    shopify: {
        pose: "happy",
        text: "Yes! Shopify and WooCommerce stores, subscriptions, member credits and payment gateways, all tested before launch.",
        chips: [{ label: "Payment options", topic: "payments" }, LIVE]
    },
    payments: {
        pose: "explaining",
        text: "Stripe, PayPal, Kajabi Payments, Shopify Payments, HitPay, PayMongo and Payoneer, including local payments for the Philippines.",
        chips: [LIVE]
    },
    automation: {
        pose: "explaining",
        text: "Rod connects the tools you already use: forms into Kajabi through Zapier, emails and lists in Brevo or Mautic, chatbots that capture leads. Every flow is documented.",
        chips: [{ label: "See how it works", go: 1 }, LIVE]
    },
    support: {
        pose: "welcome",
        text: "Rod looks after sites after launch too: hosting, Vercel deploys, security hardening, updates, backups and fixes.",
        chips: [LIVE]
    },
    work: {
        pose: "happy",
        text: "Rod has built for Podify, Dr. Laura Berman, Labour Hire and Recruitment, MedPersonnel and more. Want to see them?",
        chips: [{ label: "Open Selected work", go: 2 }, LIVE]
    },
    contact: {
        pose: "welcome",
        text: `You can chat with Rod live right here, email ${SITE.email}, or call or text ${SITE.phone}. He's in the Philippines (GMT+8) and usually replies within one business day.`,
        chips: [LIVE]
    },
    start: {
        pose: "happy",
        text: "Great, let's get you started! 🚀 What are you looking for?",
        chips: [
            { label: "A new website", say: "I need a new website" },
            { label: "A custom plugin", say: "I need a custom plugin" },
            { label: "An online store", say: "I need an online store" },
            { label: "Automation", say: "I need an automation" }
        ]
    },
    brief: {
        pose: "happy",
        text: "Nice! Rod would love to hear about it. Talk to him now and share a few details: what it's for, any examples you like, and when you'd like it live.",
        chips: [LIVE]
    },
    thanks: { pose: "happy", text: "You're welcome! 😊 Anything else?", chips: [...TOPICS.slice(0, 2), LIVE] },
    unknown: {
        pose: "thinking",
        text: "Good question! Rod can answer that best. Want to ask him directly? He'll see what you wrote.",
        chips: [LIVE, { label: "Show topics", topic: "hello" }]
    }
};

/* keyword matching, first match wins */
const RULES = [
    ["brief", /\b(i need|i want|looking for|build me|make me|new (web)?site|redesign)\b/i],
    ["pricing", /\b(price|pricing|cost|how much|budget|rate|quote|fee|charge|expensive|cheap)\b/i],
    ["timeline", /\b(how long|timeline|time ?frame|deadline|when can|weeks?|days?|fast|urgent|asap)\b/i],
    ["payments", /\b(payments?|stripe|paypal|hitpay|paymongo|payoneer|gateway|checkout)\b/i],
    ["shopify", /\b(shopify|woo ?commerce|store|shop|e-?commerce|sell)\b/i],
    ["wordpress", /\b(wordpress|wp|plugin|elementor|theme)\b/i],
    ["automation", /\b(automat\w*|zapier|kajabi|mautic|brevo|integrat\w*|api|crm|chat ?bot)\b/i],
    ["platforms", /\b(platform|squarespace|framer|react|next\.?js|figma|canva|substack|linktree|tech|stack)\b/i],
    ["support", /\b(host\w*|maintenance|maintain|support|security|backup|update|fix|bug|broken|slow|speed)\b/i],
    ["work", /\b(portfolio|examples?|previous|clients?|projects?|case stud\w*|your work)\b/i],
    ["contact", /\b(email|phone|call|contact|reach|where are you|location|time ?zone|available|hours)\b/i],
    ["services", /\b(services?|what (do|can) you|offer|help with|do you do)\b/i],
    ["thanks", /\b(thanks|thank you|ty|great|awesome|cool|ok(ay)?)\b/i],
    ["hello", /^\s*(hi|hello|hey|yo|good (morning|afternoon|evening)|kumusta)\b/i]
];
const match = text => (RULES.find(([, re]) => re.test(text)) || ["unknown"])[0];

const timeNow = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/* ---------- Brevo, embedded in our panel ---------- */
function startBrevo(container, onMessage) {
    if (window.__jrBrevoLoaded) return;
    window.__jrBrevoLoaded = true;
    window.BrevoConversationsSetup = {
        mode: "frame",
        injectTo: container,
        colors: { buttonText: "#ffffff", buttonBg: "#1250a3" },
        onNewMessage: onMessage
    };
    (function (d, w, c) {
        w.BrevoConversationsID = CHAT_ID;
        w[c] = w[c] || function () { (w[c].q = w[c].q || []).push(arguments); };
        const s = d.createElement("script");
        s.async = true;
        s.src = SCRIPT_SRC;
        if (d.head) d.head.appendChild(s);
    })(document, window, "BrevoConversations");
}

export default function ChatWidget({ ready, go, section = 0 }) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState("bot"); /* bot | live */
    const [pose, setPose] = useState("present");
    const [idlePose, setIdlePose] = useState("wave");
    const [tip, setTip] = useState(null);
    const [hop, setHop] = useState(0);
    const [unread, setUnread] = useState(0);
    const [text, setText] = useState("");
    const [typing, setTyping] = useState(false);
    const [thread, setThread] = useState([]);
    const [greetTime, setGreetTime] = useState("");
    const liveRef = useRef(null);
    const inputRef = useRef(null);
    const bodyRef = useRef(null);
    const timers = useRef([]);
    const openRef = useRef(false);
    const sentContext = useRef(false);

    useEffect(() => { openRef.current = open; }, [open]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    /* Rod replied while the panel is closed: badge + the mascot tells them */
    const onBrevoMessage = useCallback(msg => {
        if (msg && msg.type === "agent" && !openRef.current) {
            setUnread(n => n + 1);
            setIdlePose("happy");
            setHop(h => h + 1);
            setTip({ text: "Rod replied! 💬 Click me", n: Date.now(), sticky: true });
        }
    }, []);

    /* a visitor who already talked to Rod comes back straight to the live chat */
    useEffect(() => {
        if (!ready) return;
        let wasLive = false;
        try { wasLive = localStorage.getItem(LIVE_KEY) === "1"; } catch {}
        if (wasLive) setView("live");
    }, [ready]);

    /* the live view's container exists once the view is "live": start Brevo there */
    useEffect(() => {
        if (view === "live" && liveRef.current) startBrevo(liveRef.current, onBrevoMessage);
    }, [view, onBrevoMessage]);

    useEffect(() => {
        if (!open) return;
        setGreetTime(t => t || timeNow());
        setUnread(0);
        setTip(null);
        if (view === "bot") setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 260);
        const onKey = e => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, view]);

    useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" }); }, [thread, typing]);

    /* the launcher mascot talks every so often, changing pose between lines */
    useEffect(() => {
        if (!ready || open) return;
        const lines = TIPS[section] || TIPS[0];
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let i = 0;
        const own = [];
        const wait = (fn, ms) => own.push(setTimeout(fn, ms));
        const speak = () => {
            if (document.hidden) { wait(speak, 3000); return; }
            const [p, line] = lines[i % lines.length];
            i += 1;
            if (!still) { setIdlePose(p); setHop(h => h + 1); }
            setTip(t => (t && t.sticky ? t : { text: line, n: Date.now() }));
            wait(() => setTip(t => (t && t.sticky ? t : null)), 5200);
            wait(() => { if (!still) setIdlePose("wave"); }, 6000);
            wait(speak, 14000);
        };
        wait(speak, section === 0 ? 2500 : 1200);
        return () => own.forEach(clearTimeout);
    }, [ready, open, section]);

    /* typed = the visitor wrote it (sent to Rod as context); button presses are not */
    const add = (from, body, chips, typed = false) => setThread(t => [...t, { from, body, chips, typed, time: timeNow(), id: `${Date.now()}-${t.length}` }]);

    /* the assistant answers after a short "typing..." */
    const answer = key => {
        const a = ANSWERS[key];
        setTyping(true);
        setPose("thinking");
        later(() => {
            setTyping(false);
            add("bot", a.text, a.chips);
            setPose(a.pose);
            later(() => setPose("present"), 2600);
        }, 650 + Math.min(a.text.length * 6, 900));
    };

    const goLive = () => {
        try { localStorage.setItem(LIVE_KEY, "1"); } catch {}
        setPose("welcome");
        setView("live");
        /* pass along what they asked, so Rod has the context */
        const asked = thread.filter(m => m.from === "you" && m.typed).map(m => m.body);
        if (asked.length && !sentContext.current) {
            sentContext.current = true;
            later(() => {
                window.BrevoConversations?.("sendVisitorMessage", asked.length === 1 ? asked[0] : asked.map(q => `• ${q}`).join("\n"));
                window.BrevoConversations?.("updateIntegrationData", { came_from: "Portfolio chat assistant" });
            }, 1500);
        }
    };

    const pick = chip => {
        if (chip.live) { add("you", chip.label); goLive(); return; }
        if (chip.go !== undefined) { setOpen(false); go(chip.go); return; }
        if (chip.say) { add("you", chip.say, null, true); answer(match(chip.say)); return; }
        add("you", chip.label);
        answer(chip.topic);
    };

    const QUICK = [
        { key: "start", icon: "rocket", label: "Get Started", pose: "happy", run: () => { add("you", "Get Started"); answer("start"); } },
        { key: "ask", icon: "question", label: "Ask a Question", pose: "thinking", run: () => { add("you", "I have a question"); answer("hello"); } },
        { key: "features", icon: "grid", label: "View Features", pose: "explaining", run: () => { add("you", "What can you do?"); answer("services"); } },
        { key: "support", icon: "headset", label: "Talk to Support", pose: "welcome", run: () => { add("you", "I'd like to talk to Rod"); goLive(); } }
    ];

    const send = e => {
        e.preventDefault();
        const msg = text.trim();
        if (!msg) return;
        add("you", msg, null, true);
        setText("");
        answer(match(msg));
    };

    if (!ready) return null;
    const lastBot = [...thread].reverse().find(m => m.from === "bot");

    return (
        <div className={`jrx${open ? " is-open" : ""}`}>
            {/* ---------- panel ---------- */}
            <section className="jrx-panel" role="dialog" aria-modal="false" aria-labelledby="jrx-title" aria-hidden={!open} inert={!open}>
                <header className="jrx-head">
                    <img className="jrx-avatar" src="/mascot/avatar.webp" alt="" width={52} height={52} />
                    <div>
                        <h2 id="jrx-title">{view === "live" ? "Chat with Rod" : "Chat with me!"}</h2>
                        <p>{view === "live" ? <><span className="jrx-dot" /> Live chat, replies within a day</> : "I'm here to help you."}</p>
                    </div>
                    {view === "live"
                        ? <button type="button" className="jrx-icon-btn" onClick={() => setView("bot")} aria-label="Back to quick answers"><Icon name="arrow-right" className="jrx-flip" /></button>
                        : <button type="button" className="jrx-icon-btn" onClick={() => setOpen(false)} aria-label="Minimize chat"><Icon name="minus" /></button>}
                    <button type="button" className="jrx-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat"><Icon name="close" /></button>
                </header>

                {/* live chat: Brevo Conversations is embedded into this block */}
                <div className="jrx-live" hidden={view !== "live"}>
                    <p className="jrx-live-wait"><span className="jrx-typing"><span /><span /><span /></span>Connecting you to Rod…</p>
                    <div className="jrx-live-frame" ref={liveRef} />
                </div>

                {view === "bot" && (
                    <>
                        <div className="jrx-body" ref={bodyRef} aria-live="polite">
                            <div className="jrx-msg">
                                <img className="jrx-msg-avatar" src="/mascot/avatar.webp" alt="" width={40} height={40} />
                                <div>
                                    <p className="jrx-bubble">Hi! <span aria-hidden="true">👋</span><br />How can I help you today?</p>
                                    <time className="jrx-time">{greetTime}</time>
                                </div>
                            </div>

                            {thread.length === 0 && (
                                <ul className="jrx-actions">
                                    {QUICK.map(a => (
                                        <li key={a.key}>
                                            <button type="button" onClick={a.run}
                                                onMouseEnter={() => setPose(a.pose)} onFocus={() => setPose(a.pose)}
                                                onMouseLeave={() => setPose("present")} onBlur={() => setPose("present")}>
                                                <span className="jrx-action-icon"><Icon name={a.icon} /></span>
                                                {a.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {thread.map(m => (
                                <div key={m.id} className={`jrx-msg${m.from === "you" ? " is-you" : ""}`}>
                                    {m.from === "bot" && <img className="jrx-msg-avatar" src="/mascot/avatar.webp" alt="" width={40} height={40} />}
                                    <div>
                                        <p className="jrx-bubble">{m.body}</p>
                                        <time className="jrx-time">{m.time}</time>
                                        {m === lastBot && m.chips && !typing && (
                                            <div className="jrx-chips">
                                                {m.chips.map(c => (
                                                    <button key={c.label} type="button" className={c.live ? "is-live" : ""} onClick={() => pick(c)}>
                                                        {c.live && <Icon name="headset" small />}{c.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {typing && (
                                <div className="jrx-msg">
                                    <img className="jrx-msg-avatar" src="/mascot/avatar.webp" alt="" width={40} height={40} />
                                    <p className="jrx-bubble jrx-typing" aria-label="Typing"><span /><span /><span /></p>
                                </div>
                            )}
                        </div>

                        <Mascot pose={pose} className="jrx-mascot" />

                        <form className="jrx-form" onSubmit={send}>
                            <label htmlFor="jrx-input" className="jrx-sr">Type your message</label>
                            <input
                                id="jrx-input"
                                ref={inputRef}
                                type="text"
                                placeholder="Type your message..."
                                autoComplete="off"
                                maxLength={500}
                                value={text}
                                onChange={e => { setText(e.target.value); setPose(e.target.value ? "thinking" : "present"); }}
                            />
                            <button type="submit" className="jrx-send" aria-label="Send message" disabled={!text.trim()}><Icon name="send" /></button>
                        </form>
                    </>
                )}
            </section>

            {/* ---------- launcher: the mascot is the button ---------- */}
            <div className="jrx-launch">
                {tip && !open && (
                    <button key={tip.n} type="button" className={`jrx-say${tip.sticky ? " is-sticky" : ""}`} onClick={() => setOpen(true)}>
                        {tip.text}
                    </button>
                )}
                <span className="jrx-sr" aria-live="polite">{tip && !open ? tip.text : ""}</span>
                <button type="button" className="jrx-launch-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}
                    aria-label={open ? "Hide chat" : unread ? `Chat with Rod, ${unread} new message${unread > 1 ? "s" : ""}` : "Chat with Rod"}>
                    <span key={hop} className="jrx-launch-body">
                        <Mascot pose={idlePose} className="jrx-launch-sprite" />
                    </span>
                    {unread > 0 && <span className="jrx-badge" aria-hidden="true">{unread}</span>}
                </button>
            </div>
        </div>
    );
}
