import { Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { FEATURED, mshot, shot } from "@/lib/data";

const TECH = ["WordPress", "Shopify", "Squarespace", "Framer", "React", "Next.js"];

/* Featured card collage: real sites I built (the same three as Selected work) */
const COLLAGE = FEATURED.map(p => ({ key: p.key, title: p.title, srcs: [shot(p.url), mshot(p.url)] }));

/* Simple brand-colored diagrams for services that have no shareable screenshot.
   They illustrate the kind of work; they are not presented as client UI. */
function FlowArt() {
    return (
        <svg className="jre-art" viewBox="0 0 320 120" aria-hidden="true" focusable="false">
            <path d="M58 60 C110 60 110 28 160 28 M58 60 C110 60 110 92 160 92 M184 28 C230 28 230 60 262 60 M184 92 C230 92 230 60 262 60" fill="none" stroke="#9fd2ee" strokeWidth="2" strokeDasharray="5 6" />
            <circle cx="40" cy="60" r="20" fill="#ffffff" stroke="#c8e8f8" />
            <path d="M33 60h14M40 53v14" stroke="#2453a6" strokeWidth="2.4" strokeLinecap="round" />
            <rect x="152" y="12" width="40" height="32" rx="10" fill="#ffffff" stroke="#c8e8f8" />
            <path d="M163 28h18M163 22h12M163 34h8" stroke="#2453a6" strokeWidth="2" strokeLinecap="round" />
            <rect x="152" y="76" width="40" height="32" rx="10" fill="#ffffff" stroke="#c8e8f8" />
            <path d="M162 98l7-8 6 5 8-10" fill="none" stroke="#00a9b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="280" cy="60" r="20" fill="#f5d84b" />
            <path d="M282 49l-9 13h7l-1 9 9-13h-7z" fill="#102a57" />
        </svg>
    );
}

function StackArt() {
    return (
        <svg className="jre-art" viewBox="0 0 320 120" aria-hidden="true" focusable="false">
            {[14, 50, 86].map((y, i) => (
                <g key={y}>
                    <rect x="24" y={y} width="196" height="26" rx="8" fill="#ffffff" stroke="#c8e8f8" />
                    <circle cx="42" cy={y + 13} r="4" fill={i === 1 ? "#f5d84b" : "#00b8c4"} />
                    <rect x="56" y={y + 10} width={[92, 70, 104][i]} height="6" rx="3" fill="#d9ecf8" />
                    <rect x="186" y={y + 9} width="20" height="8" rx="4" fill="#e8f4fc" />
                </g>
            ))}
            <path d="M264 22l32 12v24c0 20-14 32-32 40-18-8-32-20-32-40V34z" fill="#ffffff" stroke="#c8e8f8" />
            <path d="M252 58l9 9 17-18" fill="none" stroke="#2453a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const COMPACT = [
    { icon: "plug", title: "Plugins and web apps", copy: "WordPress plugins, plus React and Next.js apps with Tailwind, deployed on Vercel.", demos: true },
    { icon: "cart", title: "Commerce and payments", copy: "Shopify and WooCommerce stores, subscriptions, credits and payment gateways." },
    { icon: "chart", title: "Tracking and dashboards", copy: "GTM, GA4 and Ads conversion setups, plus focused admin dashboards." }
];

const VISUAL = [
    { icon: "zap", title: "Automation and APIs", copy: "Connect platforms and move data between the tools you already use.", Art: FlowArt },
    { icon: "shield", title: "Care and infrastructure", copy: "VPS hosting, Vercel deploys, security hardening, backups and dependable long-term support.", Art: StackArt }
];

export default function Expertise({ go }) {
    return (
        <>
            <div className="jre-head jr-reveal jr-d1">
                <h2 className="jre-title">The right tools. <em><span className="jre-swash">Real outcomes.</span></em></h2>
                <p>Practical engineering and purposeful design, built around the way your business actually works.</p>
            </div>

            <div className="jre-grid">
                <article className="jre-card jre-featured jr-reveal jr-d2">
                    <div className="jre-collage" aria-hidden="true">
                        {COLLAGE.map(c => <SafeImg key={c.key} srcs={c.srcs} alt="" loading="lazy" />)}
                    </div>
                    <span className="jre-icon jre-icon-sun"><Icon name="code" /></span>
                    <div className="jre-featured-body">
                        <h3>Websites that load fast and convert.</h3>
                        <p>Custom builds on the platform that fits the business, tuned for speed, SEO and conversion.</p>
                        <ul className="jre-chips" aria-label="Platforms">
                            {TECH.map(t => <li key={t}>{t}</li>)}
                        </ul>
                        <button type="button" className="jre-link jre-link-light" onClick={() => go(2)}>
                            View work <Icon name="arrow-right" small />
                        </button>
                    </div>
                </article>

                {COMPACT.map((c, i) => (
                    <article key={c.title} className={`jre-card jre-compact jre-c${i + 1} jr-reveal jr-d${i + 3}`}>
                        <span className="jre-icon"><Icon name={c.icon} /></span>
                        <div>
                            <h3>{c.title}</h3>
                            <p>{c.copy}</p>
                            {c.demos && (
                                <button type="button" className="jre-link" onClick={() => go(3)}>
                                    Try the plugin demos <Icon name="arrow-right" small />
                                </button>
                            )}
                        </div>
                    </article>
                ))}

                {VISUAL.map(({ Art, ...c }, i) => (
                    <article key={c.title} className={`jre-card jre-visual jre-v${i + 1} jr-reveal jr-d${i + 3}`}>
                        <div className="jre-art-wrap"><Art /></div>
                        <div className="jre-visual-body">
                            <span className="jre-icon"><Icon name={c.icon} /></span>
                            <h3>{c.title}</h3>
                            <p>{c.copy}</p>
                        </div>
                    </article>
                ))}
            </div>
        </>
    );
}
