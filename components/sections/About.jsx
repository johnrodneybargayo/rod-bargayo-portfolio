"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { ImageGate } from "../ImageGate";
import { BtnIsland, Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { EXPERIENCE, SITE, TRUSTED, favicon } from "@/lib/data";

/* Portrait: transparent cutout first, then the profile photo framed as an arch, then initials */
function Portrait() {
    const show = useContext(ImageGate);
    const [stage, setStage] = useState("cutout");
    const ref = useRef(null);

    const fail = () => setStage(s => (s === "cutout" ? "photo" : "missing"));

    useEffect(() => {
        const img = ref.current;
        if (img && img.complete && img.naturalWidth === 0 && img.getAttribute("src")) fail();
    }, [show]);

    const cls = `jra-portrait${stage === "photo" ? " is-photo" : ""}${stage === "missing" ? " is-missing" : ""}`;
    return (
        <div className={cls}>
            {show && stage !== "missing" && (
                <img
                    ref={ref}
                    key={stage}
                    src={stage === "cutout" ? SITE.cutout : SITE.photo}
                    {...(stage === "cutout" ? { srcSet: `${SITE.cutout480} 480w, ${SITE.cutout} 960w`, sizes: "(max-width: 760px) 76vw, 460px", width: 960, height: 1351 } : {})}
                    alt={SITE.fullName}
                    loading="lazy"
                    decoding="async"
                    onError={fail}
                />
            )}
            <span className="jra-portrait-fallback" aria-hidden="true">RB</span>
        </div>
    );
}

export default function About({ openContact }) {
    return (
        <div className="jra-stage">
            <h2 className="jra-head">
                <span className="jra-line jra-line-left">
                    <span className="jra-italic">Think</span>
                    <span className="jra-block">Deeper</span>
                    <span className="jra-swash jra-swash-1" aria-hidden="true" />
                </span>
                <span className="jra-line jra-line-right">
                    <span className="jra-italic">Build</span>
                    <span className="jra-block jra-block-cobalt">Better</span>
                    <span className="jra-swash jra-swash-2" aria-hidden="true" />
                </span>
            </h2>

            <div className="jra-panel">
                <span className="jra-blob jra-blob-1" aria-hidden="true" />
                <span className="jra-blob jra-blob-2" aria-hidden="true" />
                <span className="jra-blob jra-blob-3" aria-hidden="true" />
                <span className="jra-blob jra-blob-4" aria-hidden="true" />

                <div className="jra-left jr-reveal jr-d2">
                    <div>
                        <p className="jra-kicker">About me</p>
                        <h3>Where craft meets <em>code.</em></h3>
                        <p>
                            I&apos;m John Rodney, a freelance web developer in Cebu. I build sites clients can run themselves:
                            clean, documented and easy to extend. Off the clock: movies, hiking and freediving.
                        </p>
                        <button className="jr-btn jra-cta" type="button" onClick={() => openContact()}>
                            Let&apos;s talk
                            <BtnIsland />
                        </button>
                    </div>

                    <div className="jra-trust">
                        <div className="jra-trust-core">
                            <div className="jra-faces" aria-hidden="true">
                                {TRUSTED.map(d => (
                                    <span key={d}><SafeImg src={favicon(d)} alt="" width={18} height={18} /></span>
                                ))}
                            </div>
                            <div className="jra-trust-copy">
                                <strong>Trusted by real teams</strong>
                                Podify, Dr. Laura Berman, LHR and Go Online Now
                            </div>
                        </div>
                    </div>
                </div>

                <div aria-hidden="true" />

                <div className="jra-right">
                    <ul className="jra-features jr-reveal jr-d3">
                        <li><span className="jra-feat-icon"><Icon name="grid" /></span>Six<br />platforms</li>
                        <li><span className="jra-feat-icon"><Icon name="code" /></span>React<br />and Next.js</li>
                        <li><span className="jra-feat-icon"><Icon name="zap" /></span>Connected<br />systems</li>
                    </ul>

                    <div className="jra-exp jr-reveal jr-d4">
                        <div className="jra-exp-core">
                            <div className="jra-exp-top">
                                <h4>Experience</h4>
                                <span className="jr-label">{EXPERIENCE.length} roles</span>
                            </div>
                            <ul className="jra-exp-list">
                                {EXPERIENCE.map(x => (
                                    <li key={x.role}>
                                        <span className="jra-exp-badge">{x.badge}</span>
                                        <div><strong>{x.role}</strong><span>{x.where}</span></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Portrait />
        </div>
    );
}
