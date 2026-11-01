"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { Icon } from "./Icons";
import { SHOT_WIDTH, favicon, hostOf, shotSources } from "@/lib/data";

export default function ProjectModal({ project, onClose, onContact }) {
    /* keep the last project while the close animation runs */
    const [shown, setShown] = useState(project);
    const [view, setView] = useState("shot");
    const [srcIndex, setSrcIndex] = useState(0);
    const [ready, setReady] = useState(false);
    /* >1 when the capture came back wider than the desktop viewport */
    const [zoom, setZoom] = useState(1);
    const shotRef = useRef(null);
    const imgRef = useRef(null);
    const raf = useRef(0);
    const open = !!project;

    useEffect(() => {
        if (project) {
            setShown(project);
            setView("shot");
            setSrcIndex(0);
            setReady(false);
            setZoom(1);
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

    /* the image can finish loading (e.g. from cache) before React's onLoad is attached;
       replay the load event so the preview still sizes and scrolls */
    useEffect(() => {
        const img = imgRef.current;
        if (open && img && img.complete && img.naturalWidth && !ready) img.dispatchEvent(new Event("load"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, shown, srcIndex]);

    if (!shown) return <Modal open={false} onClose={onClose} labelledBy="jrmProjectTitle" dialogClass="jrm-dialog-project" closeInBar />;

    const sources = shotSources(shown.url);
    const exhausted = srcIndex >= sources.length;
    const host = hostOf(shown.url);

    const onLoad = e => {
        /* mShots returns a small placeholder while it renders; treat it as a miss */
        const w = e.currentTarget.naturalWidth;
        if (w < 300) { setSrcIndex(i => i + 1); return; }
        /* Backup for sites whose wide elements still stretched the capture:
           show only the first 1280px (the real page width) at full preview width.
           The mShots fallback is already resized to 1280, so it's left alone. */
        const isMicrolink = e.currentTarget.src.includes("microlink");
        setZoom(isMicrolink && w > SHOT_WIDTH * 1.15 ? w / SHOT_WIDTH : 1);
        setReady(true);
        /* wait for the new width to lay out before measuring the scroll length */
        requestAnimationFrame(() => requestAnimationFrame(startScroll));
    };

    /* full case study (challenge, what I built, impact) when the project has one */
    const isCase = !!shown.challenge;

    return (
        <Modal open={open} onClose={onClose} labelledBy="jrmProjectTitle" dialogClass={`jrm-dialog-project${isCase ? " jrcs-dialog" : ""}`} closeInBar>
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
                                    ref={imgRef}
                                    key={`${shown.url}-${srcIndex}`}
                                    src={sources[srcIndex]}
                                    alt={`Full page screenshot of ${shown.title}`}
                                    style={zoom > 1 ? { width: `${zoom * 100}%`, maxWidth: "none" } : undefined}
                                    onLoad={onLoad}
                                    onError={() => { setZoom(1); setSrcIndex(i => i + 1); }}
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
                    {isCase && <p className="jrcs-modal-result">{shown.result}</p>}
                    {!isCase && shown.desc && <p className="jrm-desc">{shown.desc}</p>}
                    {!isCase && (
                        <div className="jrm-tags">
                            {(shown.tags || []).map(t => <span key={t}>{t}</span>)}
                        </div>
                    )}
                </div>
                <div className="jrm-actions">
                    <a className="jr-btn jr-btn-ghost" href={shown.url} target="_blank" rel="noopener noreferrer">
                        Visit live site
                    </a>
                    <button className="jr-btn jr-btn-sun" type="button" onClick={() => onContact(`Results like ${shown.title}`)}>
                        I want results like this
                    </button>
                </div>

                {isCase && (
                    <div className="jrcs-story">
                        {shown.metrics?.length > 0 && (
                            <ul className="jrcs-metrics jrcs-metrics-modal" aria-label="Results">
                                {shown.metrics.map(m => <li key={m.label}><strong>{m.value}</strong><span>{m.label}</span></li>)}
                            </ul>
                        )}
                        <div className="jrcs-cols">
                            <section className="jrcs-col">
                                <span className="jrcs-step">01 / The problem</span>
                                <p>{shown.challenge}</p>
                            </section>
                            <section className="jrcs-col">
                                <span className="jrcs-step">02 / What I built</span>
                                <p>{shown.solution}</p>
                            </section>
                            <section className="jrcs-col jrcs-col-win">
                                <span className="jrcs-step">03 / What changed</span>
                                <ul className="jrcs-wins">
                                    {shown.impact.map(t => <li key={t}>{t}</li>)}
                                </ul>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
