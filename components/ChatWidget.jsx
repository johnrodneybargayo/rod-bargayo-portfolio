"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

/*
 * Chat widget with the illustrated mascot.
 * The front (greeting, quick actions, mascot reactions) is ours; conversations
 * go to Brevo Conversations live chat when NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
 * is set, otherwise to the contact form so nothing is ever lost.
 * Nothing here loads until the visitor first interacts with the page (`ready`).
 */

const CHAT_ID = process.env.NEXT_PUBLIC_BREVO_CONVERSATIONS_ID || "";
const SCRIPT_SRC = process.env.NEXT_PUBLIC_BREVO_CONVERSATIONS_SRC || "https://conversations-widget.brevo.com/brevo-conversations.js";
const M = name => `/mascot/${name}.webp`;
const POSES = ["present", "happy", "thinking", "explaining", "welcome"];

/* Brevo's standard loader; its own launcher is replaced by ours (hidden element) */
function loadBrevo() {
    if (!CHAT_ID || window.__jrBrevoLoaded) return;
    window.__jrBrevoLoaded = true;
    window.BrevoConversationsSetup = {
        customWidgetButton: ".jr-brevo-anchor",
        colors: { buttonText: "#102a57", buttonBg: "#ffd936" },
        zIndex: 80
    };
    window.BrevoConversationsID = CHAT_ID;
    window.BrevoConversations = window.BrevoConversations || function () {
        (window.BrevoConversations.q = window.BrevoConversations.q || []).push(arguments);
    };
    /* our mascot is the only launcher: keep Brevo's own button hidden until we hand over */
    window.BrevoConversations("hide");
    const s = document.createElement("script");
    s.async = true;
    s.src = SCRIPT_SRC;
    document.head.appendChild(s);
}

const timeNow = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function ChatWidget({ ready, go, openContact }) {
    const [open, setOpen] = useState(false);
    const [pose, setPose] = useState("present");
    const [text, setText] = useState("");
    const [thread, setThread] = useState([]); /* visitor messages + replies after the greeting */
    const [greetTime, setGreetTime] = useState("");
    const inputRef = useRef(null);
    const bodyRef = useRef(null);
    const poseTimer = useRef(null);

    useEffect(() => { if (ready) loadBrevo(); }, [ready]);

    useEffect(() => {
        if (open) {
            setGreetTime(t => t || timeNow());
            setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 260);
        }
    }, [open]);

    /* Escape closes the panel */
    useEffect(() => {
        if (!open) return;
        const onKey = e => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" }); }, [thread]);
    useEffect(() => () => clearTimeout(poseTimer.current), []);

    const flash = useCallback((p, ms = 1800) => {
        clearTimeout(poseTimer.current);
        setPose(p);
        poseTimer.current = setTimeout(() => setPose("present"), ms);
    }, []);

    const say = (from, body) => setThread(t => [...t, { from, body, time: timeNow(), id: t.length + 1 }]);

    /* live chat with Brevo, or the contact form when chat isn't configured */
    const goLive = (message = "") => {
        if (CHAT_ID) {
            loadBrevo();
            if (message) {
                window.BrevoConversations("updateIntegrationData", { first_message_from_widget: message.slice(0, 900) });
                try { navigator.clipboard?.writeText(message); } catch {}
            }
            setTimeout(() => {
                setOpen(false);
                window.BrevoConversations("show");
                window.BrevoConversations("openChat", true);
            }, message ? 1400 : 500);
        } else {
            setTimeout(() => { setOpen(false); openContact("", message); }, message ? 1400 : 500);
        }
    };

    const ACTIONS = [
        { key: "start", icon: "rocket", label: "Get Started", pose: "happy",
          run: () => { say("me", "Great! Tell me about your project and I'll get back to you."); flash("happy"); setTimeout(() => { setOpen(false); openContact(); }, 900); } },
        { key: "ask", icon: "question", label: "Ask a Question", pose: "thinking",
          run: () => { say("me", CHAT_ID ? "Sure! Opening live chat so you can ask me directly." : "Sure! Send me your question and I'll reply by email."); flash("thinking"); goLive(); } },
        { key: "features", icon: "grid", label: "View Features", pose: "explaining",
          run: () => { say("me", "Here's what I can build for you."); flash("explaining"); setTimeout(() => { setOpen(false); go(1); }, 900); } },
        { key: "support", icon: "headset", label: "Talk to Support", pose: "welcome",
          run: () => { say("me", CHAT_ID ? "Connecting you to me on live chat." : "Leave me a message and I'll reply soon."); flash("welcome"); goLive(); } }
    ];

    const send = e => {
        e.preventDefault();
        const msg = text.trim();
        if (!msg) return;
        say("you", msg);
        setText("");
        flash("happy", 2200);
        setTimeout(() => {
            say("me", CHAT_ID
                ? "Thanks! Live chat is opening. Your message is copied, so just paste it there and send."
                : "Thanks! I've put your message in the contact form. Add your email so I can reply.");
        }, 500);
        goLive(msg);
    };

    if (!ready) return null;

    return (
        <div className={`jrx${open ? " is-open" : ""}`}>
            {/* Brevo attaches to this hidden element instead of showing its own launcher */}
            <span className="jr-brevo-anchor" aria-hidden="true" />

            {/* ---------- panel ---------- */}
            <section className="jrx-panel" role="dialog" aria-modal="false" aria-labelledby="jrx-title" aria-hidden={!open} inert={!open}>
                <header className="jrx-head">
                    <img className="jrx-avatar" src={M("avatar")} alt="" width={52} height={52} />
                    <div>
                        <h2 id="jrx-title">Chat with me!</h2>
                        <p>I&apos;m here to help you.</p>
                    </div>
                    <button type="button" className="jrx-icon-btn" onClick={() => setOpen(false)} aria-label="Minimize chat"><Icon name="minus" /></button>
                    <button type="button" className="jrx-icon-btn" onClick={() => { setOpen(false); setThread([]); }} aria-label="Close chat"><Icon name="close" /></button>
                </header>

                <div className="jrx-body" ref={bodyRef} aria-live="polite">
                    <div className="jrx-msg">
                        <img className="jrx-msg-avatar" src={M("avatar")} alt="" width={40} height={40} />
                        <div>
                            <p className="jrx-bubble">Hi! <span aria-hidden="true">👋</span><br />How can I help you today?</p>
                            <time className="jrx-time">{greetTime}</time>
                        </div>
                    </div>

                    <ul className="jrx-actions">
                        {ACTIONS.map(a => (
                            <li key={a.key}>
                                <button
                                    type="button"
                                    onClick={a.run}
                                    onMouseEnter={() => setPose(a.pose)}
                                    onFocus={() => setPose(a.pose)}
                                    onMouseLeave={() => setPose("present")}
                                    onBlur={() => setPose("present")}
                                >
                                    <span className="jrx-action-icon"><Icon name={a.icon} /></span>
                                    {a.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {thread.map(m => (
                        <div key={m.id} className={`jrx-msg${m.from === "you" ? " is-you" : ""}`}>
                            {m.from === "me" && <img className="jrx-msg-avatar" src={M("avatar")} alt="" width={40} height={40} />}
                            <div>
                                <p className="jrx-bubble">{m.body}</p>
                                <time className="jrx-time">{m.time}</time>
                            </div>
                        </div>
                    ))}

                </div>

                {/* the mascot stands bottom right and reacts to what the visitor does */}
                <div className="jrx-mascot" aria-hidden="true">
                    {POSES.map(p => (
                        <img key={p} src={M(p)} alt="" className={pose === p ? "is-on" : ""} loading="lazy" decoding="async" />
                    ))}
                </div>

                <form className="jrx-form" onSubmit={send}>
                    <label htmlFor="jrx-input" className="jrx-sr">Type your message</label>
                    <input
                        id="jrx-input"
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        autoComplete="off"
                        maxLength={900}
                        value={text}
                        onChange={e => { setText(e.target.value); if (e.target.value) { clearTimeout(poseTimer.current); setPose("thinking"); } else setPose("present"); }}
                        onBlur={() => !text && setPose("present")}
                    />
                    <button type="submit" className="jrx-send" aria-label="Send message" disabled={!text.trim()}><Icon name="send" /></button>
                </form>
            </section>

            {/* ---------- launcher ---------- */}
            <div className="jrx-launch">
                {/* the mascot is the chat button */}
                <button type="button" className="jrx-launch-btn" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? "Hide chat" : "Chat with Rod"}>
                    <img className="jrx-launch-mascot" src={M("wave")} alt="" width={163} height={337} />
                </button>
            </div>
        </div>
    );
}
