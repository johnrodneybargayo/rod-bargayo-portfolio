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

/* Each card is a business problem and what fixing it does for you.
   Tools are left out on purpose: owners buy outcomes, not stacks. */
const SERVICES = [
    {
        key: "portals",
        icon: "plug",
        title: "Let clients serve themselves",
        copy: "Clients order, pay and track work without emailing you.",
        points: [
            "Clients buy packages or prepaid credits and reorder without a sales call",
            "A live progress tracker replaces “any update?” emails",
            "Online booking where lessons or sessions are paid before they happen"
        ],
        demos: true
    },
    {
        key: "commerce",
        icon: "cart",
        title: "Get paid faster",
        copy: "A checkout your customers trust, on any device.",
        points: [
            "Online store or one-page checkout, tested before launch",
            "Monthly plans and prepaid packages for predictable income",
            "Cards and PayPal worldwide, plus GCash and local banks in the Philippines"
        ],
        payments: ["stripe", "paypal", "kajabipay", "shopifypay", "hitpay", "paymongo", "payoneer"]
    },
    {
        key: "tracking",
        icon: "chart",
        title: "Know what makes you money",
        copy: "See which ads and pages bring in paying customers.",
        points: [
            "Every enquiry, booking and sale traced back to where it came from",
            "Stop paying for ads that don't convert",
            "A simple dashboard with only the numbers that matter"
        ]
    },
    {
        key: "referrals",
        icon: "user",
        title: "Turn customers into your sales team",
        copy: "Referral and affiliate programs that pay for themselves.",
        points: [
            "Every customer and partner gets a tracked referral link",
            "Commission is paid only when a referral actually buys",
            "Monthly payout reports, no spreadsheets"
        ],
        demos: true
    }
];

/* Sample automations, in plain language. Lead flow = what this site's own contact form runs;
   free guide = a typical lead-magnet setup. */
const FLOWS = [
    {
        key: "lead",
        tab: "New enquiry to follow-up",
        payload: "Sample: Alex from Tan Dental asks for a quote at 11pm",
        done: "Done: enquiry answered, saved and followed up, while you slept",
        steps: [
            { key: "form", title: "Website form", detail: "A customer asks for a quote", icon: "message" },
            { key: "api", title: "Spam check", detail: "Junk and bots filtered out", icon: "shield" },
            { key: "mail", title: "Lands in your inbox", detail: "With every detail you need to reply", icon: "mail" },
            { key: "list", title: "Saved to your list", detail: "Never lost in a busy inbox", icon: "user" },
            { key: "campaign", title: "Automatic follow-up", detail: "Your next offer reaches them", icon: "zap" }
        ]
    },
    {
        key: "kajabi",
        tab: "Free guide to email list",
        payload: "Sample: Alex downloads your free guide",
        done: "Done: a new lead you can sell to, with zero manual work",
        steps: [
            { key: "form", title: "Free guide form", detail: "A visitor asks for your guide", icon: "message" },
            { key: "zap", title: "Captured instantly", detail: "No copy and paste by your team", icon: "zap" },
            { key: "contact", title: "New contact", detail: "Added to your email marketing", icon: "user" },
            { key: "offer", title: "Access granted", detail: "The guide unlocks right away", icon: "shield" },
            { key: "email", title: "Welcome sequence", detail: "Emails that lead to your paid offer", icon: "mail" }
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
                <span className="jre-flow-payload">{flow.payload}</span>
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
                <h2 className="jre-title">Every fix has one job. <em><span className="jre-swash">More profit.</span></em></h2>
                <p>Pick the problem that costs you the most. Each solution below is already working for a real business.</p>
            </div>

            <div className="jre-grid">
                <article className="jre-card jre-featured jr-reveal jr-d2">
                    <div className="jre-collage" aria-hidden="true">
                        {COLLAGE.map(c => <SafeImg key={c.key} srcs={c.srcs} fit={640} alt="" loading="lazy" />)}
                    </div>
                    <span className="jre-icon jre-icon-sun"><Icon name="zap" /></span>
                    <div className="jre-featured-body">
                        <h3>A website that turns visitors into customers.</h3>
                        <p>Most sites look fine and sell nothing. Yours should answer questions, build trust and ask for the sale on every page.</p>
                        <ul className="jre-points jre-points-light">
                            <li>A clear offer and a next step above the fold</li>
                            <li>Enquiry or booking within one click, on every page</li>
                            <li>Pages that load fast, so you don't lose people on mobile</li>
                            <li>Found on Google for the searches your buyers make</li>
                            <li>You can edit it yourself, no developer needed</li>
                            <li>Looked after after launch: fast, secure and backed up</li>
                        </ul>
                        <button type="button" className="jre-link jre-link-light" onClick={() => go(2)}>
                            See client results <Icon name="arrow-right" small />
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
                                <span className="jre-pay-label">Your customers can pay with</span>
                                <Logos ids={s.payments} />
                            </div>
                        )}
                        {s.demos && (
                            <button type="button" className="jre-link" onClick={() => go(3)}>
                                Try it live <Icon name="arrow-right" small />
                            </button>
                        )}
                    </article>
                ))}

                <article className="jre-card jre-automation jr-reveal jr-d5">
                    <div className="jre-automation-intro">
                        <div className="jre-service-head">
                            <span className="jre-icon"><Icon name="zap" /></span>
                            <div>
                                <h3>Stop doing admin by hand</h3>
                                <p>Your tools talk to each other, so no lead slips through the cracks.</p>
                            </div>
                        </div>
                        <Points items={[
                            "New enquiries get an instant reply, even at midnight",
                            "Free-guide sign-ups go straight into your email marketing",
                            "A chat assistant answers common questions and captures leads 24/7",
                            "Hours of copy-paste admin handed to the system, every week",
                            "Every step documented, so you're never stuck with a black box"
                        ]} />
                    </div>
                    <AutomationDemo />
                </article>
            </div>
        </>
    );
}
