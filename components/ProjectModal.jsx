"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { Icon } from "./Icons";
import { favicon, hostOf, shotSources } from "@/lib/data";

/* Is this full-page screenshot squeezed?
   A site with a marquee or slider wider than the screen can come back from the
   screenshot service extra wide: the page sits on the left and an empty strip
   (only the wide element runs through it) trails off to the right. Two signs:
   1. the rightmost column is one flat colour down almost the whole page
      (a real page's edge changes colour from section to section), and
   2. a wide band on the right matches that edge, row by row.
   Returns true when both hold and the real page is under 70% of the width. */
function isSqueezed(img) {
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    if (!W || !H) return false;
    const cw = 240;
    const ch = Math.max(1, Math.min(1600, Math.round(H * cw / W)));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let d;
    try {
        ctx.drawImage(img, 0, 0, cw, ch);
        d = ctx.getImageData(0, 0, cw, ch).data;
    } catch {
        return false; /* pixels not readable: keep the screenshot */
    }
    const near = (i, j) => Math.abs(d[i] - d[j]) + Math.abs(d[i + 1] - d[j + 1]) + Math.abs(d[i + 2] - d[j + 2]) <= 30;
    const at = (x, y) => (y * cw + x) * 4;

    /* 1: flat right edge */
    const ref = at(cw - 1, 0);
    let flat = 0;
    for (let y = 0; y < ch; y++) if (near(at(cw - 1, y), ref)) flat++;
    if (flat / ch < 0.85) return false;

    /* 2: walk left while each column still matches the right edge in 92% of rows */
    let x = cw - 2;
    for (; x >= 0; x--) {
        let match = 0;
        for (let y = 0; y < ch; y++) if (near(at(x, y), at(cw - 1, y))) match++;
        if (match / ch < 0.92) break;
    }
    return (x + 1) / cw < 0.7;
}

export default function ProjectModal({ project, onClose, onContact }) {
    /* keep the last project while the close animation runs */
    const [shown, setShown] = useState(project);
    const [view, setView] = useState("shot");
    const [srcIndex, setSrcIndex] = useState(0);
    const [ready, setReady] = useState(false);
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
        const img = e.currentTarget;
        if (img.naturalWidth < 300) { setSrcIndex(i => i + 1); return; }
        /* A squeezed full-page capture doesn't show the site at full width:
           use the first-screen capture instead, which is always taken on a
           full-width desktop screen (the later sources are never squeezed). */
        if (srcIndex === 0 && isSqueezed(img)) { setSrcIndex(1); return; }
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
