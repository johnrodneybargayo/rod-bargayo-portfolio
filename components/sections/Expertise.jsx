import { Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { mshot, shot } from "@/lib/data";

const CARDS = [
    {
        icon: "plug",
        title: "Plugins and web apps",
        copy: "WordPress plugins, plus React and Next.js apps with Tailwind, deployed on Vercel."
    },
    {
        icon: "zap",
        title: "Automation and APIs",
        copy: "Connect platforms and move data between the tools you already use.",
        media: [shot("https://goonlinenow.co/"), mshot("https://goonlinenow.co/")],
        alt: "Go Online Now platform"
    },
    {
        icon: "cart",
        title: "Commerce and payments",
        copy: "Shopify and WooCommerce stores, subscriptions, credits and payment gateways."
    },
    {
        icon: "chart",
        title: "Tracking and dashboards",
        copy: "GTM, GA4 and Ads conversion setups, plus focused admin dashboards.",
        media: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"],
        alt: "Analytics charts on a laptop"
    },
    {
        icon: "shield",
        title: "Care and infrastructure",
        copy: "VPS hosting, Vercel deploys, security hardening, backups and dependable long-term support.",
        media: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1100&q=80"],
        alt: "Server racks in a data center",
        wide: true
    }
];

export default function Expertise() {
    return (
        <>
            <div className="jr-section-head jr-reveal jr-d1">
                <h2 className="jr-title">The right tools. <em>Real outcomes.</em></h2>
                <p className="jr-lede">Practical engineering and purposeful design, built around the way your business actually works.</p>
            </div>

            <div className="jre-grid">
                <article className="jr-card jre-card jre-featured jr-reveal jr-d2">
                    <SafeImg className="jre-bg" srcs={[shot("https://drlauraberman.com"), mshot("https://drlauraberman.com")]} alt="" loading="lazy" />
                    <span className="jre-icon"><Icon name="code" /></span>
                    <h3>Websites that load fast and convert.</h3>
                    <p>Custom builds on the platform that fits the business, tuned for speed, SEO and conversion.</p>
                    <div className="jre-chips">
                        {["WordPress", "Shopify", "Squarespace", "Framer", "React", "Next.js"].map(c => <span key={c}>{c}</span>)}
                    </div>
                </article>

                {CARDS.map((c, i) => {
                    const cls = ["jr-card", "jre-card", c.media && "jre-media", c.wide && "jre-wide jre-media-side", "jr-reveal", `jr-d${i + 3}`].filter(Boolean).join(" ");
                    return (
                        <article key={c.title} className={cls}>
                            {c.media && <SafeImg className="jre-media-img" srcs={c.media} alt={c.alt} loading="lazy" />}
                            <span className="jre-icon"><Icon name={c.icon} /></span>
                            <h3>{c.title}</h3>
                            <p>{c.copy}</p>
                        </article>
                    );
                })}
            </div>
        </>
    );
}
