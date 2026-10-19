"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { BtnIsland, Icon } from "./Icons";
import { favicon, hostOf, shotSources } from "@/lib/data";

export default function ProjectModal({ project, onClose, onContact }) {
    /* keep the last project while the close animation runs */
    const [shown, setShown] = useState(project);
    const [view, setView] = useState("shot");
    const [srcIndex, setSrcIndex] = useState(0);
    const [ready, setReady] = useState(false);
    const shotRef = useRef(null);
    const raf = useRef(0);
    const open = !!project;

    useEffect(() => {
        if (project) {
            setShown(project);
            setView("shot");
            setSrcIndex(0);
            setReady(false);
        }
    }, [project]);

    const delay = useRef(0);

    const stopScroll = () => {
        clearTimeout(delay.current);
        cancelAnimationFrame(raf.current);
        raf.current = 0;
    };

    /* slow tour down the page once the screenshot loads */
    const startScroll = () => {
        const box = shotRef.current;
        stopScroll();
        if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const max = box.scrollHeight - box.clientHeight;
        if (max < 40) return;
        const dur = Math.min(14000, Math.max(4000, max * 3.2));
        let t0 = 0;
        const step = ts => {
            if (!t0) t0 = ts;
            const k = Math.min(1, (ts - t0) / dur);
            const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            box.scrollTop = max * ease;
            if (k < 1) raf.current = requestAnimationFrame(step);
        };
        delay.current = setTimeout(() => { raf.current = requestAnimationFrame(step); }, 700);
    };

    useEffect(() => {
        if (!open) stopScroll();
        return stopScroll;
    }, [open]);

    if (!shown) return <Modal open={false} onClose={onClose} labelledBy="jrmProjectTitle" dialogClass="jrm-dialog-project" closeInBar />;

    const sources = shotSources(shown.url);
    const exhausted = srcIndex >= sources.length;
    const host = hostOf(shown.url);

    const onLoad = e => {
        /* mShots returns a small placeholder while it renders; treat it as a miss */
        if (e.currentTarget.naturalWidth < 300) { setSrcIndex(i => i + 1); return; }
        setReady(true);
        startScroll();
    };

    return (
        <Modal open={open} onClose={onClose} labelledBy="jrmProjectTitle" dialogClass="jrm-dialog-project" closeInBar>
            <div className="jrm-bar">
                <span className="jrm-url">
                    <img src={favicon(host)} alt="" width={16} height={16} />
                    <span>{host}</span>
                </span>
                <div className="jrm-seg" role="group" aria-label="Preview mode">
                    {[["shot", "Preview"], ["live", "Live site"]].map(([v, label]) => (
                        <button key={v} type="button" className={view === v ? "is-active" : ""} aria-pressed={view === v} onClick={() => { stopScroll(); setView(v); }}>
                            {label}
                        </button>
                    ))}
                </div>
                <button className="jrm-close jrm-close-bar" type="button" onClick={onClose} aria-label="Close project preview">
                    <Icon name="close" small />
                </button>
            </div>

            <div className="jrm-viewport">
                {view === "shot" && (
                    <>
                        {!ready && !exhausted && (
                            <div className="jrm-loading" aria-hidden="true">
                                <span className="jrm-sk jrm-sk-nav" />
                                <span className="jrm-sk jrm-sk-hero" />
                                <span className="jrm-sk-row"><span className="jrm-sk" /><span className="jrm-sk" /><span className="jrm-sk" /></span>
                                <em>Capturing the live page...</em>
                            </div>
                        )}
                        {!exhausted && (
                            <div
                                className={`jrm-shot${ready ? " is-ready" : ""}`}
                                ref={shotRef}
                                tabIndex={0}
                                aria-label="Scrollable page preview"
                                onWheel={stopScroll}
                                onPointerDown={stopScroll}
                                onTouchStart={stopScroll}
                                onKeyDown={stopScroll}
                            >
                                <img
                                    key={`${shown.url}-${srcIndex}`}
                                    src={sources[srcIndex]}
                                    alt={`Full page screenshot of ${shown.title}`}
                                    onLoad={onLoad}
                                    onError={() => setSrcIndex(i => i + 1)}
                                />
                            </div>
                        )}
                        {exhausted && (
                            <div className="jrm-fallback">
                                <img src={favicon(host)} alt="" width={40} height={40} />
                                <strong>{host}</strong>
                                <span>The preview service didn&apos;t respond. The live site is one click away.</span>
                                <a className="jr-btn jr-btn-sun jr-btn-sm" href={shown.url} target="_blank" rel="noopener noreferrer">
                                    Open live site
                                    <BtnIsland />
                                </a>
                            </div>
                        )}
                    </>
                )}
                {view === "live" && (
                    <>
                        <iframe
                            src={shown.url}
                            title={`${shown.title} live site`}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            referrerPolicy="no-referrer"
                        />
                        <p className="jrm-frame-note">Some sites block being embedded. If this stays blank, use Visit live site.</p>
                    </>
                )}
            </div>

            <div className="jrm-project-body">
                <div className="jrm-project-text">
                    <span className="jr-label">{shown.kicker}</span>
                    <h2 id="jrmProjectTitle">{shown.title}</h2>
                    {shown.desc && <p className="jrm-desc">{shown.desc}</p>}
                    <div className="jrm-tags">
                        {(shown.tags || []).map(t => <span key={t}>{t}</span>)}
                    </div>
                </div>
                <div className="jrm-actions">
                    <a className="jr-btn jr-btn-ghost" href={shown.url} target="_blank" rel="noopener noreferrer">
                        Visit live site
                        <BtnIsland />
                    </a>
                    <button className="jr-btn jr-btn-sun" type="button" onClick={() => onContact(shown.title)}>
                        Let&apos;s talk
                        <BtnIsland />
                    </button>
                </div>
            </div>
        </Modal>
    );
}
