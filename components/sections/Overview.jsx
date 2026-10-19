import { BtnIsland, Icon } from "../Icons";
import SafeImg from "../SafeImg";

export default function Overview({ go }) {
    return (
        <div className="jrh-grid">
            <article className="jr-card jrh-hero jr-reveal jr-d1">
                <span className="jrh-badge">
                    <span className="jr-status-dot" aria-hidden="true" />
                    Freelance web developer, Philippines
                </span>

                <div>
                    <h1 className="jrh-heading">
                        <span className="jrh-row jrh-row-1"><span className="jrh-row-inner"><span className="jrh-lead">I build</span>digital</span></span>
                        <span className="jrh-row jrh-row-2"><span className="jrh-row-inner">experiences</span></span>
                        <span className="jrh-row jrh-row-3"><span className="jrh-row-inner"><span className="jrh-lead">that</span><span className="jrh-pill">work.</span></span></span>
                    </h1>
                    <p className="jrh-copy">
                        Websites and web apps on WordPress, Shopify, Framer and React, plus the plugins and automation behind them.
                    </p>
                    <div className="jrh-actions">
                        <button className="jr-btn jr-btn-sun" type="button" onClick={() => go(2)}>
                            View work
                            <BtnIsland />
                        </button>
                        <button className="jr-btn jr-btn-ghost" type="button" onClick={() => go(3)}>
                            Try plugin demos
                            <BtnIsland icon="arrow-right" />
                        </button>
                    </div>
                </div>
            </article>

            <button className="jr-card jrh-visual jr-reveal jr-d2" type="button" onClick={() => go(2)} aria-label="Go to selected work">
                <SafeImg src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1100&q=80" alt="Creative digital interface design" />
                <span className="jrh-visual-shade" />
                <span className="jrh-visual-body">
                    <span>
                        <span className="jr-label" style={{ color: "#cdeef5" }}>Design to build</span>
                        <h2>Ideas into<br />interfaces.</h2>
                    </span>
                    <span className="jr-round"><Icon name="arrow" small /></span>
                </span>
            </button>

            <article className="jr-card jrh-scope jr-reveal jr-d3">
                <span className="jr-label">Track record</span>
                <div>
                    <h2>20+ <span>projects shipped</span></h2>
                    <p>Across six platforms, every one fully responsive.</p>
                    <div className="jrh-steps">
                        <span>Discover</span>
                        <span>Build</span>
                        <span>Launch</span>
                    </div>
                </div>
            </article>
        </div>
    );
}
