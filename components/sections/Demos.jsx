"use client";

import { useRef, useState } from "react";
import { Icon } from "../Icons";
import PortalDemo from "../demos/PortalDemo";
import ReferralsDemo from "../demos/ReferralsDemo";
import EslDemo from "../demos/EslDemo";
import StickyDemo from "../demos/StickyDemo";
import GateDemo from "../demos/GateDemo";

const TABS = [
    { id: "portal", title: "Self-serve client portal", sub: "Clients prepay, reorder and track work alone", icon: "chart", Demo: PortalDemo },
    { id: "refer", title: "Referral program", sub: "Customers bring you customers", icon: "user", Demo: ReferralsDemo },
    { id: "esl", title: "Prepaid lesson booking", sub: "Students pay first, book themselves", icon: "grid", Demo: EslDemo },
    { id: "sticky", title: "Booking calendar that follows", sub: "More sales calls from your articles", icon: "zap", Demo: StickyDemo },
    { id: "gate", title: "Free guide lead capture", sub: "Turn free content into email leads", icon: "shield", Demo: GateDemo }
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
                <h2 className="jr-title">Don&apos;t take my word for it. <em>Try it yourself.</em></h2>
                <p className="jr-lede">Working versions of tools I built for real businesses. Click around as if you were their customer.</p>
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
                    <p className="jrl-note">Sample data only. Nothing here charges a card or sends an email.</p>
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
