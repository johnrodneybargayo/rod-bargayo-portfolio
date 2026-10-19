"use client";

import { useRef, useState } from "react";
import { Icon } from "../Icons";
import PortalDemo from "../demos/PortalDemo";
import ReferralsDemo from "../demos/ReferralsDemo";
import EslDemo from "../demos/EslDemo";
import StickyDemo from "../demos/StickyDemo";
import GateDemo from "../demos/GateDemo";

const TABS = [
    { id: "portal", title: "Client Portal", sub: "Credits, deliverables, Stripe + ClickUp", icon: "chart", Demo: PortalDemo },
    { id: "refer", title: "Referrals and Affiliates", sub: "Links, commissions, monthly payouts", icon: "user", Demo: ReferralsDemo },
    { id: "esl", title: "ESL Lesson Scheduler", sub: "Bookings with a credit ledger", icon: "grid", Demo: EslDemo },
    { id: "sticky", title: "Sticky Booking Calendar", sub: "GoHighLevel card on chosen pages", icon: "zap", Demo: StickyDemo },
    { id: "gate", title: "Resource Access Gate", sub: "Email-only access, lead export", icon: "shield", Demo: GateDemo }
];

export default function Demos() {
    const [active, setActive] = useState(0);
    /* bumping a demo's key remounts it, which is the reset */
    const [resets, setResets] = useState(() => TABS.map(() => 0));
    const tabRefs = useRef([]);

    const select = (i, focus) => {
        setActive(i);
        if (focus) tabRefs.current[i]?.focus();
    };

    const onTabKey = (e, i) => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        e.stopPropagation(); /* keep the section pager from reacting */
        select((i + keys[e.key] + TABS.length) % TABS.length, true);
    };

    const reset = () => {
        /* the gate demo remembers its visitor in browser storage; forget it on reset */
        if (TABS[active].id === "gate") {
            try { localStorage.removeItem("rb-demo-gate"); } catch {}
        }
        setResets(r => r.map((n, k) => (k === active ? n + 1 : n)));
    };

    return (
        <>
            <div className="jr-section-head jr-reveal jr-d1">
                <h2 className="jr-title">Plugins I&apos;ve built. <em>Try them here.</em></h2>
            </div>

            <div className="jrl-grid">
                <div className="jrl-side jr-reveal jr-d2">
                    <div className="jrl-tabs" role="tablist" aria-label="Plugin demos">
                        {TABS.map((t, i) => (
                            <button
                                key={t.id}
                                ref={el => { tabRefs.current[i] = el; }}
                                className={`jrl-tab${i === active ? " is-active" : ""}`}
                                role="tab"
                                id={`jrl-tab-${t.id}`}
                                aria-selected={i === active}
                                aria-controls={`jrl-panel-${t.id}`}
                                tabIndex={i === active ? 0 : -1}
                                onClick={() => select(i)}
                                onKeyDown={e => onTabKey(e, i)}
                            >
                                <span className="jrl-tab-icon"><Icon name={t.icon} /></span>
                                <span className="jrl-tab-text"><strong>{t.title}</strong><span>{t.sub}</span></span>
                            </button>
                        ))}
                    </div>
                    <p className="jrl-note">Demo versions with sample data. Nothing here charges a card or sends an email.</p>
                </div>

                <div className="jr-card jrl-window jr-reveal jr-d3">
                    <div className="jrl-bar">
                        <span className="jrl-bar-title">{TABS[active].title}</span>
                        <span className="jrl-bar-badge">Live demo</span>
                        <button className="jrl-reset" type="button" onClick={reset}>Reset demo</button>
                    </div>
                    <div className="jrl-body">
                        {TABS.map(({ id, Demo }, i) => (
                            <div
                                key={id}
                                className={`jrl-panel${i === active ? " is-active" : ""}`}
                                id={`jrl-panel-${id}`}
                                role="tabpanel"
                                aria-labelledby={`jrl-tab-${id}`}
                                hidden={i !== active}
                            >
                                {/* demos stay mounted so their state survives tab switches */}
                                <Demo key={resets[i]} visible={i === active} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
