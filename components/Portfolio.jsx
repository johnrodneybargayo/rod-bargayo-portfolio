"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, SITE } from "@/lib/data";
import { Icon, IconSprite, BtnIsland } from "./Icons";
import Overview from "./sections/Overview";
import Expertise from "./sections/Expertise";
import Work from "./sections/Work";
import Demos from "./sections/Demos";
import About from "./sections/About";
import Contact from "./sections/Contact";
import ContactModal from "./ContactModal";
import ProjectModal from "./ProjectModal";

const DURATION = 1000;

/* One full-viewport section with its pager */
function Section({ index, active, go, children }) {
    const s = SECTIONS[index];
    const next = (index + 1) % SECTIONS.length;
    return (
        <section className={`jr-section${active ? " is-active" : ""}`} id={s.id} aria-label={s.name} inert={!active} aria-hidden={!active}>
            <div className="jr-section-scroll">{children}</div>
            <div className="jr-pager">
                <div className="jr-pager-bars" aria-label="Sections">
                    {SECTIONS.map((sec, k) => (
                        <button key={sec.id} type="button" className={k === index ? "is-active" : ""} aria-label={sec.name} onClick={() => go(k)} />
                    ))}
                </div>
                <button type="button" className="jr-pager-next jr-mono" onClick={() => go(next)}>
                    {next === 0 ? "Back to" : "Next"} <strong>{SECTIONS[next].name}</strong>
                    <Icon name="arrow-right" small />
                </button>
            </div>
        </section>
    );
}

export default function Portfolio() {
    const [index, setIndex] = useState(0);
    const [instant, setInstant] = useState(false);
    const [contact, setContact] = useState({ open: false, project: "" });
    const [project, setProject] = useState(null);
    /* curtain that sweeps across while the track slides; shows where you're going */
    const [wipe, setWipe] = useState(null);

    const indexRef = useRef(0);
    const busy = useRef(false);
    const wheelLock = useRef(false);
    const stageRef = useRef(null);
    const reduced = useRef(false);

    const go = useCallback(i => {
        if (!Number.isInteger(i) || i < 0 || i >= SECTIONS.length || i === indexRef.current || busy.current) return;
        busy.current = true;
        if (!reduced.current) setWipe({ n: Date.now(), dir: i > indexRef.current ? "next" : "prev", num: i + 1, label: SECTIONS[i].name });
        indexRef.current = i;
        setIndex(i);
        const scroller = document.querySelectorAll(".jr-section-scroll")[i];
        if (scroller) scroller.scrollTop = 0;
        setTimeout(() => { busy.current = false; }, reduced.current ? 0 : DURATION + 40);
        /* sandboxed previews block history writes; ignore there */
        try { history.replaceState(null, "", "#" + SECTIONS[i].id); } catch {}
    }, []);

    /* deep link on first load, without the slide animation */
    useEffect(() => {
        reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const start = SECTIONS.findIndex(s => s.id === location.hash.slice(1));
        if (start > 0) {
            setInstant(true);
            indexRef.current = start;
            setIndex(start);
            requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
        }
        const onHash = () => {
            const i = SECTIONS.findIndex(s => s.id === location.hash.slice(1));
            if (i >= 0) go(i);
        };
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, [go]);

    const modalOpen = contact.open || !!project;

    /* keyboard: arrows, Home, End */
    useEffect(() => {
        const onKey = e => {
            if (modalOpen || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            const t = e.target;
            if (t instanceof HTMLElement && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) return;
            const i = indexRef.current;
            const map = { ArrowRight: Math.min(i + 1, SECTIONS.length - 1), ArrowLeft: Math.max(i - 1, 0), Home: 0, End: SECTIONS.length - 1 };
            if (e.key in map) { e.preventDefault(); go(map[e.key]); }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [go, modalOpen]);

    /* wheel and swipe paging; inner scroll areas scroll first */
    useEffect(() => {
        const stage = stageRef.current;

        const onWheel = e => {
            const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            if (Math.abs(delta) < 24) return;
            if (e.deltaY !== 0) {
                let node = e.target;
                while (node && node !== stage) {
                    if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(node).overflowY)) {
                        const canDown = node.scrollTop + node.clientHeight < node.scrollHeight - 2;
                        const canUp = node.scrollTop > 0;
                        if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) return;
                    }
                    node = node.parentElement;
                }
            }
            e.preventDefault();
            if (wheelLock.current || busy.current) return;
            wheelLock.current = true;
            const i = indexRef.current;
            go(delta > 0 ? Math.min(i + 1, SECTIONS.length - 1) : Math.max(i - 1, 0));
            setTimeout(() => { wheelLock.current = false; }, 850);
        };

        let sx = 0, sy = 0, st = 0;
        const onStart = e => {
            if (e.touches.length !== 1) return;
            sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
        };
        const onEnd = e => {
            if (e.changedTouches.length !== 1) return;
            const dx = e.changedTouches[0].clientX - sx;
            const dy = e.changedTouches[0].clientY - sy;
            if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.3 || Date.now() - st > 900) return;
            /* sideways swipes inside a horizontally scrolling strip are not page swipes */
            if (e.target.closest && e.target.closest(".jrl-tabs, .sb-frame")) return;
            const i = indexRef.current;
            go(dx < 0 ? Math.min(i + 1, SECTIONS.length - 1) : Math.max(i - 1, 0));
        };

        /* the browser scrolls this box sideways to reveal #anchors; only the transform may move sections */
        const pin = () => {
            if (stage.scrollLeft || stage.scrollTop) { stage.scrollLeft = 0; stage.scrollTop = 0; }
        };
        pin();

        stage.addEventListener("scroll", pin, { passive: true });
        stage.addEventListener("wheel", onWheel, { passive: false });
        stage.addEventListener("touchstart", onStart, { passive: true });
        stage.addEventListener("touchend", onEnd, { passive: true });
        return () => {
            stage.removeEventListener("scroll", pin);
            stage.removeEventListener("wheel", onWheel);
            stage.removeEventListener("touchstart", onStart);
            stage.removeEventListener("touchend", onEnd);
        };
    }, [go]);

    const openContact = useCallback((projectName = "") => setContact({ open: true, project: projectName }), []);
    const closeContact = useCallback(() => setContact(c => ({ ...c, open: false })), []);
    const openProject = useCallback(p => setProject(p), []);
    const closeProject = useCallback(() => setProject(null), []);

    const sectionProps = { go, openContact, openProject };

    return (
        <>
            <IconSprite />
            <div className="jr-app">
                {/* SIDEBAR */}
                <aside className="jr-sidebar">
                    <a href="#home" className="jr-brand" onClick={e => { e.preventDefault(); go(0); }} aria-label={`${SITE.name} home`}>
                        <span className="jr-brand-mark">RB</span>
                        <span className="jr-brand-name">Rod <span>Bargayo</span></span>
                    </a>

                    <nav className="jr-nav" aria-label="Main navigation">
                        {SECTIONS.map((s, i) => (
                            <button key={s.id} type="button" className={`jr-nav-item${i === index ? " is-active" : ""}`} aria-current={i === index ? "page" : undefined} onClick={() => go(i)}>
                                <Icon name={s.icon} />
                                <span className="jr-nav-label">{s.name}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="jr-sidebar-bottom">
                        <div className="jr-availability">
                            <div className="jr-availability-top">
                                <span className="jr-status-dot" aria-hidden="true" />
                                Open for new projects
                            </div>
                            <p>Have a challenge in mind? Let&apos;s turn it into something useful.</p>
                            <button className="jr-availability-link" type="button" onClick={() => openContact()}>
                                Let&apos;s talk
                                <Icon name="arrow" small />
                            </button>
                        </div>
                        <div className="jr-sidebar-footer">
                            <span>&copy; {new Date().getFullYear()} {SITE.name}</span>
                            <span className="jr-mono">PH / GMT+8</span>
                        </div>
                    </div>
                </aside>

                {/* WORKSPACE */}
                <main className="jr-workspace">
                    <header className="jr-topbar">
                        <div className="jr-breadcrumb">
                            <span>{SITE.name}</span>
                            <span className="jr-breadcrumb-sep">/</span>
                            <strong>{SECTIONS[index].name}</strong>
                        </div>
                        <div className="jr-topbar-right">
                            <span className="jr-topbar-role">{SITE.role[0].toUpperCase() + SITE.role.slice(1)}</span>
                            <button className="jr-btn jr-btn-sun jr-btn-sm" type="button" onClick={() => openContact()}>
                                Let&apos;s talk
                                <BtnIsland />
                            </button>
                        </div>
                    </header>

                    <div className="jr-stage" ref={stageRef}>
                        <div
                            className="jr-track"
                            style={{ transform: `translate3d(-${index * 100}%,0,0)`, transition: instant ? "none" : undefined }}
                        >
                            <Section index={0} active={index === 0} go={go}><Overview {...sectionProps} /></Section>
                            <Section index={1} active={index === 1} go={go}><Expertise {...sectionProps} /></Section>
                            <Section index={2} active={index === 2} go={go}><Work {...sectionProps} /></Section>
                            <Section index={3} active={index === 3} go={go}><Demos /></Section>
                            <Section index={4} active={index === 4} go={go}><About {...sectionProps} /></Section>
                            <Section index={5} active={index === 5} go={go}><Contact {...sectionProps} /></Section>
                        </div>
                        {wipe && (
                            <div key={wipe.n} className={`jr-wipe is-${wipe.dir}`} aria-hidden="true" onAnimationEnd={e => { if (e.target === e.currentTarget) setWipe(null); }}>
                                <span className="jr-wipe-num">{String(wipe.num).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}</span>
                                <span className="jr-wipe-label">{wipe.label}</span>
                            </div>
                        )}
                    </div>
                </main>

                {/* MOBILE NAV */}
                <nav className="jr-mobile-nav" aria-label="Mobile navigation">
                    {SECTIONS.map((s, i) => (
                        <button key={s.id} type="button" className={i === index ? "is-active" : ""} aria-current={i === index ? "page" : undefined} onClick={() => go(i)}>
                            <Icon name={s.icon} />
                            <span>{s.short}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <ProjectModal project={project} onClose={closeProject} onContact={name => { closeProject(); setTimeout(() => openContact(name), 220); }} />
            <ContactModal open={contact.open} project={contact.project} onClose={closeContact} />
        </>
    );
}
