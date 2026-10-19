"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PAGES = {
    guide: { title: "CRM setup guide", secs: ["Connect your domain", "Import your contacts", "Build your first pipeline", "Automate follow-ups", "Track results"] },
    pricing: { title: "Pricing", secs: ["Plans at a glance", "What every plan includes", "Compare features", "Frequently asked questions", "Still deciding?"] },
    about: { title: "About us", secs: ["Our story", "The team", "How we work", "Clients we help", "Join us"] }
};

export default function StickyDemo({ visible }) {
    const [page, setPage] = useState("guide");
    const [enabled, setEnabled] = useState({ guide: true, pricing: true, about: false });
    const [link, setLink] = useState("https://api.leadconnectorhq.com/widget/booking/demo");
    const [after, setAfter] = useState(2);
    const [passed, setPassed] = useState(false);
    const scrollRef = useRef(null);

    /* the card appears once the chosen section has reached the top of the page */
    const measure = useCallback(() => {
        const scroller = scrollRef.current;
        if (!scroller || !scroller.offsetParent) return;
        const trigger = scroller.querySelector(`[data-sec="${after}"]`);
        setPassed(!!trigger && scroller.scrollTop >= trigger.offsetTop - 12);
    }, [after]);

    /* layout only exists while the panel is visible, so re-measure then */
    useEffect(() => {
        if (!visible) return;
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
        measure();
    }, [visible, page, after, measure]);

    const on = enabled[page] && passed;
    const hint = !enabled[page]
        ? "This page is switched off in settings, so the card never shows."
        : on
            ? "Card is showing. It stays pinned while the visitor reads."
            : `Scroll to section ${after} to see the card appear.`;

    return (
        <div className="jrl-cols jrl-cols-flip">
            <div className="jrl-box">
                <h4>Settings</h4>
                <p className="jrl-small">Show the booking card on these pages:</p>
                <div className="sb-pages">
                    {Object.entries(PAGES).map(([key, p]) => (
                        <label key={key}>
                            <input
                                type="checkbox"
                                checked={enabled[key]}
                                onChange={e => setEnabled(s => ({ ...s, [key]: e.target.checked }))}
                            />{" "}
                            {p.title}
                        </label>
                    ))}
                </div>
                <label className="sb-field">Booking link
                    <input type="url" value={link} onChange={e => setLink(e.target.value)} />
                </label>
                <label className="sb-field">Appear after section
                    <select value={after} onChange={e => setAfter(Number(e.target.value))}>
                        {[1, 2, 3].map(n => <option key={n} value={n}>Section {n}</option>)}
                    </select>
                </label>
            </div>

            <div className="sb-preview">
                <div className="sb-tabs">
                    {Object.entries(PAGES).map(([key, p]) => (
                        <button key={key} type="button" className={key === page ? "is-active" : ""} onClick={() => setPage(key)}>{p.title}</button>
                    ))}
                </div>
                <div className="sb-frame">
                    <div className="sb-scroll" ref={scrollRef} onScroll={measure}>
                        <article className="sb-article">
                            <h5>{PAGES[page].title}</h5>
                            {PAGES[page].secs.map((s, i) => (
                                <div key={s} className={`sb-sec${i === after - 1 ? " is-trigger" : ""}`} data-sec={i + 1}>
                                    <b>{i + 1}. {s}</b>
                                    Sample copy for the {s.toLowerCase()} section of this page. The booking card watches the reader&apos;s
                                    position and slides in once they reach the section chosen in settings, then stays pinned while they keep reading.
                                </div>
                            ))}
                        </article>
                    </div>
                    <aside className={`sb-card${on ? " is-on" : ""}`} aria-hidden={!on}>
                        <strong>Book a free strategy call</strong>
                        <span>30 minutes with the team</span>
                        <span className="sb-days" aria-hidden="true"><i /><i className="on" /><i /><i className="on" /><i /></span>
                        <a href={link || "#"} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1}>Pick a time</a>
                    </aside>
                </div>
                <p className="jrl-small">{hint}</p>
            </div>
        </div>
    );
}
