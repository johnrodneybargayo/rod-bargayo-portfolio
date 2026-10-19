"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { BtnIsland, Icon } from "./Icons";
import { SITE } from "@/lib/data";

const EMPTY = { name: "", email: "", project: "", message: "", website: "" };

const RULES = {
    name: v => (v.trim() ? "" : "Please add your name."),
    email: v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."),
    message: v => (v.trim() ? "" : "Tell me a little about the project.")
};

export default function ContactModal({ open, project, onClose }) {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [state, setState] = useState("idle"); /* idle | sending | sent | error */
    const [serverError, setServerError] = useState("");
    const [sentTo, setSentTo] = useState({ name: "", email: "" });
    const started = useRef(0);
    const refs = { name: useRef(null), email: useRef(null), message: useRef(null) };

    useEffect(() => {
        if (!open) return;
        started.current = Date.now();
        setValues(v => ({ ...v, project: project || "" }));
        setErrors({});
        setServerError("");
        setState(s => (s === "sent" ? "idle" : s));
    }, [open, project]);

    const set = key => e => setValues(v => ({ ...v, [key]: e.target.value }));

    const submit = async e => {
        e.preventDefault();
        const next = {};
        Object.entries(RULES).forEach(([k, rule]) => { const m = rule(values[k]); if (m) next[k] = m; });
        setErrors(next);
        const firstBad = Object.keys(RULES).find(k => next[k]);
        if (firstBad) { refs[firstBad].current?.focus(); return; }

        setState("sending");
        setServerError("");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: new URLSearchParams({ ...values, started: String(started.current) })
            });
            const json = await res.json().catch(() => null);
            if (res.ok && json?.ok) {
                setSentTo({ name: values.name.trim(), email: values.email.trim() });
                setValues(EMPTY);
                setState("sent");
            } else {
                setServerError(json?.error || "Sorry, the message couldn't be sent right now.");
                setState("error");
            }
        } catch {
            setServerError("Sorry, the message couldn't be sent right now.");
            setState("error");
        }
    };

    const field = (key, label, input) => (
        <div className={`jrm-field${errors[key] ? " has-error" : ""}`}>
            <label htmlFor={`jrm-${key}`}>{label}</label>
            {input}
            {key in RULES && <p className="jrm-error" aria-live="polite">{errors[key] || ""}</p>}
        </div>
    );

    return (
        <Modal open={open} onClose={onClose} labelledBy="jrmContactTitle" dialogClass="jrm-dialog-form">
            {state === "sent" ? (
                <div className="jrm-success">
                    <span className="jrm-success-icon"><Icon name="mail" /></span>
                    <h3 id="jrmContactTitle">Message sent.</h3>
                    <p>Thanks, {sentTo.name}. I&apos;ll reply to {sentTo.email} soon.</p>
                    <button className="jr-btn jr-btn-ghost jr-btn-sm" type="button" onClick={onClose}>
                        Close
                        <BtnIsland icon="close" />
                    </button>
                </div>
            ) : (
                <>
                    <h2 id="jrmContactTitle">Tell me what you&apos;re building.</h2>
                    <p className="jrm-intro">Share a little context and I&apos;ll help shape the next useful step.</p>
                    <form className="jrm-form" onSubmit={submit} noValidate>
                        {/* honeypot: people never see it, bots fill it */}
                        <div className="jrm-hp" aria-hidden="true">
                            <label htmlFor="jrm-website">Leave this empty</label>
                            <input id="jrm-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
                        </div>

                        <div className="jrm-row">
                            {field("name", "Name",
                                <input ref={refs.name} id="jrm-name" type="text" autoComplete="name" placeholder="Your name" value={values.name} onChange={set("name")} aria-invalid={!!errors.name} />)}
                            {field("email", "Email",
                                <input ref={refs.email} id="jrm-email" type="email" autoComplete="email" placeholder="you@company.com" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} />)}
                        </div>
                        {field("project", "Project type",
                            <input id="jrm-project" type="text" placeholder="Website, plugin, automation or something new" value={values.project} onChange={set("project")} />)}
                        {field("message", "Message",
                            <textarea ref={refs.message} id="jrm-message" placeholder="What would you like to make better?" value={values.message} onChange={set("message")} aria-invalid={!!errors.message} />)}

                        <p className={`jrm-status${state === "error" ? " is-error" : ""}`} aria-live="polite">
                            {state === "error" && (
                                <>
                                    {serverError} You can also email me directly at{" "}
                                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                                </>
                            )}
                        </p>

                        <div className="jrm-actions">
                            <p className="jrm-note">Goes straight to my inbox.</p>
                            <button className="jr-btn jr-btn-sun" type="submit" disabled={state === "sending"}>
                                {state === "sending" ? "Sending" : "Send message"}
                                <BtnIsland />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </Modal>
    );
}
