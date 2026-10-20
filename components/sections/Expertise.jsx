"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { FEATURED, favicon, mshot, shot } from "@/lib/data";

/* Tool logos come from each product's own site icon (same service as the More work list) */
const TOOLS = {
    wordpress: { name: "WordPress", domain: "wordpress.org" },
    shopify: { name: "Shopify", domain: "shopify.com" },
    squarespace: { name: "Squarespace", domain: "squarespace.com" },
    framer: { name: "Framer", domain: "framer.com" },
    react: { name: "React", domain: "react.dev" },
    next: { name: "Next.js", domain: "nextjs.org" },
    php: { name: "PHP", domain: "php.net" },
    tailwind: { name: "Tailwind", domain: "tailwindcss.com" },
    vercel: { name: "Vercel", domain: "vercel.com" },
    woo: { name: "WooCommerce", domain: "woocommerce.com" },
    gtm: { name: "Tag Manager", domain: "tagmanager.google.com" },
    ga4: { name: "GA4", domain: "analytics.google.com" },
    ads: { name: "Google Ads", domain: "ads.google.com" },
    hostinger: { name: "Hostinger", domain: "hostinger.com" },
    brevo: { name: "Brevo", domain: "brevo.com" },
    zapier: { name: "Zapier", domain: "zapier.com" },
    mautic: { name: "Mautic", domain: "mautic.org" },
    figma: { name: "Figma", domain: "figma.com" },
    canva: { name: "Canva", domain: "canva.com" },
    substack: { name: "Substack", domain: "substack.com" },
    linktree: { name: "Linktree", domain: "linktr.ee" },
    chatbots: { name: "Chatbots", icon: "message" },
    kajabi: { name: "Kajabi", domain: "kajabi.com" },
    stripe: { name: "Stripe", domain: "stripe.com" },
    paypal: { name: "PayPal", domain: "paypal.com" },
    kajabipay: { name: "Kajabi Payments", domain: "kajabi.com" },
    shopifypay: { name: "Shopify Payments", domain: "shopify.com" },
    hitpay: { name: "HitPay", domain: "hitpayapp.com" },
    paymongo: { name: "PayMongo", domain: "paymongo.com" },
    payoneer: { name: "Payoneer", domain: "payoneer.com" }
};

function Logos({ ids, light = false }) {
    return (
        <ul className={`jre-logos${light ? " is-light" : ""}`} aria-label="Tools">
            {ids.map(id => (
                <li key={id}>
                    {TOOLS[id].domain
                        ? <SafeImg src={favicon(TOOLS[id].domain)} alt="" width={16} height={16} loading="lazy" />
                        : <Icon name={TOOLS[id].icon} small />}
                    {TOOLS[id].name}
                </li>
            ))}
        </ul>
    );
}

const COLLAGE = FEATURED.map(p => ({ key: p.key, srcs: [shot(p.url), mshot(p.url)] }));

const SERVICES = [
    {
        key: "plugins",
        icon: "plug",
        title: "Plugins and web apps",
        copy: "Custom features your off-the-shelf tools can't do.",
        points: [
            "Custom WordPress plugins, like Podify's client portal with credits and its referral program",
            "React and Next.js apps styled with Tailwind, deployed on Vercel",
            "Admin screens your team can use without a developer"
        ],
        tools: ["wordpress", "php", "react", "next", "tailwind", "vercel"],
        demos: true
    },
    {
        key: "commerce",
        icon: "cart",
        title: "Commerce and payments",
        copy: "Stores and billing that just work for customers.",
        points: [
            "Shopify, WooCommerce and Kajabi store setup and customization",
            "Subscriptions, credits and member billing",
            "Payment gateway setup with checkout testing before launch",
            "Local and international payments, including HitPay and PayMongo for the Philippines"
        ],
        tools: ["shopify", "woo", "kajabi"],
        payments: ["stripe", "paypal", "kajabipay", "shopifypay", "hitpay", "paymongo", "payoneer"]
    },
    {
        key: "tracking",
        icon: "chart",
        title: "Tracking and dashboards",
        copy: "Know which pages and ads bring in leads.",
        points: [
            "Tag Manager containers with clean, named events",
            "GA4 conversions and Google Ads conversion tracking",
            "Focused admin dashboards for the numbers that matter"
        ],
        tools: ["gtm", "ga4", "ads"]
    },
    {
        key: "care",
        icon: "shield",
        title: "Care and infrastructure",
        copy: "Your site stays fast, safe and online after launch.",
        points: [
            "VPS hosting and Vercel deploys",
            "Security hardening, updates and backups",
            "Dependable long-term support and fixes"
        ],
        tools: ["vercel", "hostinger", "wordpress"]
    }
];

/* Sample automations. Lead flow = what this site's own contact form runs;
   resource access = a typical Zapier to Kajabi lead-magnet setup. */
const FLOWS = [
    {
        key: "lead",
        tab: "Website lead to Brevo",
        payload: '{ "name": "Alex Tan", "email": "alex@example.com", "subscribe": true }',
        done: "Done: lead delivered and saved in 5 steps",
        steps: [
            { key: "form", title: "Website form", detail: "A visitor sends a message", icon: "message" },
            { key: "api", title: "API route", detail: "Blocks spam, checks the fields", logo: "nextjs.org", icon: "code" },
            { key: "mail", title: "Brevo email", detail: "Message lands in your inbox", logo: "brevo.com", icon: "mail" },
            { key: "list", title: "Brevo list", detail: "Opted-in visitors are saved", logo: "brevo.com", icon: "user" },
            { key: "campaign", title: "Email campaign", detail: "Your newsletter reaches them", icon: "mail" }
        ]
    },
    {
        key: "kajabi",
        tab: "Resource access to Kajabi",
        payload: '{ "name": "Alex Tan", "email": "alex@example.com", "resource": "Free guide" }',
        done: "Done: contact created and resource unlocked in 5 steps",
        steps: [
            { key: "form", title: "Resource access form", detail: "A visitor asks for the free resource", icon: "message" },
            { key: "zap", title: "Zapier trigger", detail: "Catches the new form entry", logo: "zapier.com", icon: "zap" },
            { key: "contact", title: "Kajabi contact", detail: "Creates or updates the contact", logo: "kajabi.com", icon: "user" },
            { key: "offer", title: "Kajabi offer", detail: "Tags them and grants access", logo: "kajabi.com", icon: "shield" },
            { key: "email", title: "Access email", detail: "Login link sent right away", icon: "mail" }
        ]
    }
];

function AutomationDemo() {
    const [which, setWhich] = useState(0);
    const [step, setStep] = useState(-1); /* -1 idle, 0..n running, n = finished */
    const timer = useRef(null);
    const flow = FLOWS[which];
    const total = flow.steps.length;
    const running = step >= 0 && step < total;

    useEffect(() => () => clearTimeout(timer.current), []);

    const pick = i => { clearTimeout(timer.current); setStep(-1); setWhich(i); };

    const run = () => {
        clearTimeout(timer.current);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStep(total); return; }
        let i = 0;
        setStep(0);
        const tick = () => {
            i += 1;
            setStep(i);
            if (i < total) timer.current = setTimeout(tick, 650);
        };
        timer.current = setTimeout(tick, 650);
    };

    const status = step < 0 ? "Ready to run" : running ? `Running step ${step + 1} of ${total}` : flow.done;

    return (
        <div className="jre-flow-wrap">
            <div className="jre-flow-tabs" role="group" aria-label="Sample automations">
                {FLOWS.map((f, i) => (
                    <button key={f.key} type="button" aria-pressed={i === which} className={i === which ? "is-on" : ""} onClick={() => pick(i)}>
                        {f.tab}
                    </button>
                ))}
            </div>

            <div className="jre-flow-top">
                <span className="jre-flow-tag">Sample automation</span>
                <code className="jre-flow-payload" aria-label="Sample test data">{flow.payload}</code>
                <button type="button" className="jre-run" onClick={run} disabled={running}>
                    <Icon name="zap" small /> {step < 0 ? "Run sample" : running ? "Running" : "Run again"}
                </button>
            </div>

            <ol className="jre-flow" key={flow.key}>
                {flow.steps.map((f, i) => {
                    const state = step < 0 ? "" : i < step || step === total ? " is-done" : i === step ? " is-active" : "";
                    return (
                        <li key={f.key} className={`jre-node${state}`}>
                            <span className="jre-node-icon">
                                <Icon name={f.icon} />
                                {f.logo && <SafeImg src={favicon(f.logo)} alt="" width={20} height={20} />}
                            </span>
                            <strong>{f.title}</strong>
                            <span>{f.detail}</span>
                        </li>
                    );
                })}
            </ol>

            <p className="jre-flow-status" aria-live="polite">{status}</p>
        </div>
    );
}

function Points({ items }) {
    return (
        <ul className="jre-points">
            {items.map(p => <li key={p}>{p}</li>)}
        </ul>
    );
}

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
                        <ul className="jre-points jre-points-light">
                            <li>Custom themes and layouts, not a reskinned template</li>
                            <li>Fast pages: optimized images, caching and clean code</li>
                            <li>SEO basics and analytics in place on launch day</li>
                            <li>Figma and Canva designs turned into real, responsive pages</li>
                            <li>Creator setups: Substack newsletters and Linktree pages</li>
                            <li>Handover notes so your team can edit content</li>
                        </ul>
                        <Logos ids={["wordpress", "shopify", "squarespace", "framer", "react", "next", "figma", "canva", "substack", "linktree"]} light />
                        <button type="button" className="jre-link jre-link-light" onClick={() => go(2)}>
                            View work <Icon name="arrow-right" small />
                        </button>
                    </div>
                </article>

                {SERVICES.map((s, i) => (
                    <article key={s.key} className={`jre-card jre-service jre-s-${s.key} jr-reveal jr-d${i + 3}`}>
                        <div className="jre-service-head">
                            <span className="jre-icon"><Icon name={s.icon} /></span>
                            <div>
                                <h3>{s.title}</h3>
                                <p>{s.copy}</p>
                            </div>
                        </div>
                        <Points items={s.points} />
                        {s.payments && (
                            <div className="jre-pay">
                                <span className="jre-pay-label">Payment options</span>
                                <Logos ids={s.payments} />
                            </div>
                        )}
                        <Logos ids={s.tools} />
                        {s.demos && (
                            <button type="button" className="jre-link" onClick={() => go(3)}>
                                Try the plugin demos <Icon name="arrow-right" small />
                            </button>
                        )}
                    </article>
                ))}

                <article className="jre-card jre-automation jr-reveal jr-d5">
                    <div className="jre-automation-intro">
                        <div className="jre-service-head">
                            <span className="jre-icon"><Icon name="zap" /></span>
                            <div>
                                <h3>Automation and APIs</h3>
                                <p>Connect platforms and move data between the tools you already use.</p>
                            </div>
                        </div>
                        <Points items={[
                            "Connect forms, email, CRM and spreadsheets with Zapier or direct APIs",
                            "Resource access and contact forms wired into Kajabi through Zapier",
                            "Email marketing automation in Mautic and Brevo",
                            "Chatbot systems that answer questions and capture leads",
                            "Every flow documented, so you know what runs where"
                        ]} />
                        <Logos ids={["zapier", "kajabi", "mautic", "brevo", "chatbots", "next"]} />
                    </div>
                    <AutomationDemo />
                </article>
            </div>
        </>
    );
}
