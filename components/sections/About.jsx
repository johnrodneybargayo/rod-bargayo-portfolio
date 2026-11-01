"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { ImageGate } from "../ImageGate";
import { Icon } from "../Icons";
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
                    <span className="jra-block">Profit</span>
                    <span className="jra-swash jra-swash-1" aria-hidden="true" />
                </span>
                <span className="jra-line jra-line-right">
                    <span className="jra-italic">Build</span>
                    <span className="jra-block jra-block-cobalt">Growth</span>
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
                        <p className="jra-kicker">Why work with me</p>
                        <h3>I think like an <em>owner.</em></h3>
                        <p>
                            I&apos;m Rod, co-founder of Aura Creo in Cebu. I run a business too, so I judge every website
                            by what it brings in: leads, sales and hours saved. Developer and marketer, in one person.
                        </p>
                        <button className="jr-btn jra-cta" type="button" onClick={() => openContact()}>
                            Let&apos;s talk
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
                                <strong>Trusted by growing businesses</strong>
                                Podify, Dr. Laura Berman, LHR and Go Online Now
                            </div>
                        </div>
                    </div>
                </div>

                <div aria-hidden="true" />

                <div className="jra-right">
                    <ul className="jra-features jr-reveal jr-d3">
                        <li><span className="jra-feat-icon"><Icon name="chart" /></span>Results you<br />can measure</li>
                        <li><span className="jra-feat-icon"><Icon name="message" /></span>Plain English,<br />no jargon</li>
                        <li><span className="jra-feat-icon"><Icon name="shield" /></span>Support<br />after launch</li>
                    </ul>

                    <div className="jra-exp jr-reveal jr-d4">
                        <div className="jra-exp-core">
                            <div className="jra-exp-top">
                                <h4>Background</h4>
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
