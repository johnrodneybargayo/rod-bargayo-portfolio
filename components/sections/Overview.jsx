import { Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { SITE, mshot, shot } from "@/lib/data";

/* Result teaser card: a real client site, linked to the case study */
const RESULT_SHOT = "https://podify.com";

export default function Overview({ go, openContact }) {
    return (
        <div className="jrh-grid">
            <article className="jr-card jrh-hero jr-reveal jr-d1">
                <span className="jrh-rings" aria-hidden="true" />

                <div className="jrh-content">
                    <span className="jrh-badge">
                        <span className="jr-status-dot" aria-hidden="true" />
                        For business owners who want results
                    </span>

                    <div>
                        <h1 className="jrh-heading">
                            <span className="jrh-row jrh-row-1"><span className="jrh-row-inner"><span className="jrh-lead">More</span>leads.</span></span>
                            <span className="jrh-row jrh-row-2"><span className="jrh-row-inner">More sales.</span></span>
                            <span className="jrh-row jrh-row-3"><span className="jrh-row-inner"><span className="jrh-lead">Less</span><span className="jrh-pill">admin.</span></span></span>
                        </h1>
                        <p className="jrh-copy">
                            I build websites, online checkouts and automations that bring in customers, take payments while you sleep and cut the admin that eats your week.
                        </p>
                        <div className="jrh-actions">
                            <button className="jr-btn jr-btn-sun" type="button" onClick={() => go(2)}>
                                See client results
                            </button>
                            <button className="jr-btn jr-btn-ghost" type="button" onClick={() => openContact("Free growth review")}>
                                Get a free growth review
                            </button>
                        </div>
                    </div>
                </div>

                <div className="jrh-portrait">
                    {/* the page's largest image: AVIF first (smallest), WebP fallback, sized per screen */}
                    <picture>
                        <source type="image/avif" srcSet={SITE.portraitAvif} sizes={SITE.portraitSizes} />
                        <img
                        src={SITE.portrait}
                        srcSet={`${SITE.portrait400} 400w, ${SITE.portrait560} 560w, ${SITE.portrait} 760w`}
                        sizes={SITE.portraitSizes}
                        alt={`Portrait of ${SITE.fullName}`}
                        width={760}
                        height={1434}
                        fetchPriority="high"
                        loading="eager"
                        />
                    </picture>
                </div>
            </article>

            <button className="jr-card jrh-visual jr-reveal jr-d2" type="button" onClick={() => go(2)} >
                <SafeImg srcs={[shot(RESULT_SHOT), mshot(RESULT_SHOT)]} fit={640} alt="" loading="lazy" />
                <span className="jrh-visual-shade" />
                <span className="jrh-visual-body">
                    <span>
                        <span className="jr-label" style={{ color: "#cdeef5" }}>Client result / Podify</span>
                        <h2>One-off orders into<br />recurring revenue.</h2>
                    </span>
                    <span className="jr-round"><Icon name="arrow" small /></span>
                </span>
            </button>

            <article className="jr-card jrh-scope jr-reveal jr-d3">
                <span className="jr-label">How I work</span>
                <div>
                    <h2>Profit <span>first. Website second.</span></h2>
                    <p>Every project starts with one question: where is your business losing customers, time or money?</p>
                    <div className="jrh-steps">
                        <span>Find the leak</span>
                        <span>Fix it</span>
                        <span>Measure it</span>
                    </div>
                </div>
            </article>
        </div>
    );
}
