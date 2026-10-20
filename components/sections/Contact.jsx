import { BtnIsland, Icon } from "../Icons";
import { SITE } from "@/lib/data";

const OPTIONS = [
    { href: `mailto:${SITE.email}`, icon: "mail", title: "Email", detail: <>{SITE.email.split("@")[0]}@<wbr />{SITE.email.split("@")[1]}</>, note: "Typically replies within one business day" },
    { href: SITE.linkedin, icon: "linkedin", title: "LinkedIn", detail: "in/rodbargayo", external: true },
    { href: SITE.phoneHref, icon: "phone", title: "Call or text", detail: SITE.phone }
];

const SOCIAL = [
    { href: SITE.linkedin, icon: "linkedin", label: "LinkedIn" },
    { href: SITE.github, icon: "github", label: "GitHub" },
    { href: SITE.facebook, icon: "facebook", label: "Facebook" },
    { href: SITE.instagram, icon: "instagram", label: "Instagram" }
];

export default function Contact({ openContact }) {
    return (
        <div className="jrc-grid">
            <article className="jrc-main jr-reveal jr-d1">
                <span className="jrc-deco" aria-hidden="true">
                    <span className="jrc-arc jrc-arc-1" />
                    <span className="jrc-arc jrc-arc-2" />
                    <span className="jrc-arc jrc-arc-3" />
                    <span className="jrc-line jrc-line-navy" />
                    <span className="jrc-line jrc-line-sun" />
                </span>

                <div className="jrc-body">
                    <span className="jrc-kicker">Have a good problem to solve?</span>
                    <h2>Let&apos;s make it <em>real.</em></h2>
                    <p>Whether you need a new website, a custom WordPress solution or a better-performing web system, let&apos;s work out the right approach.</p>
                    <button className="jr-btn jr-btn-sun" type="button" onClick={() => openContact()}>
                        Let&apos;s talk
                        <BtnIsland icon="arrow-right" />
                    </button>
                </div>

                <div className="jrc-sign">
                    <span className="jrc-person">
                        <img src={SITE.avatar} alt="" width={56} height={56} loading="lazy" />
                        <span><strong>{SITE.fullName}</strong>Freelance web developer, Philippines</span>
                    </span>
                    <span className="jrc-social">
                        {SOCIAL.map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                <Icon name={s.icon} small />
                            </a>
                        ))}
                    </span>
                </div>
            </article>

            <div className="jrc-options">
                {OPTIONS.map((o, i) => (
                    <a
                        key={o.title}
                        href={o.href}
                        className={`jrc-option jr-reveal jr-d${i + 2}`}
                        {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                        <span className="jrc-option-icon"><Icon name={o.icon} /></span>
                        <span className="jrc-option-text">
                            <strong>{o.title}</strong>
                            <span className="jrc-option-detail">{o.detail}</span>
                            {o.note && <span className="jrc-option-note">{o.note}</span>}
                        </span>
                        <span className="jrc-option-go"><Icon name="arrow-right" small /></span>
                    </a>
                ))}
            </div>
        </div>
    );
}
