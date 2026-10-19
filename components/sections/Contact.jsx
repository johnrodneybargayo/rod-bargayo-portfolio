import { BtnIsland, Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { SITE } from "@/lib/data";

const OPTIONS = [
    { href: `mailto:${SITE.email}`, icon: "mail", title: "Email", detail: SITE.email },
    { href: SITE.linkedin, icon: "linkedin", title: "LinkedIn", detail: "in/rodbargayo", external: true },
    { href: SITE.phoneHref, icon: "phone", title: "Call or text", detail: SITE.phone }
];

export default function Contact({ openContact }) {
    return (
        <div className="jrc-grid">
            <article className="jr-card jrc-main jr-reveal jr-d1">
                <div>
                    <span className="jr-label">Have a good problem to solve?</span>
                    <h2 style={{ marginTop: 18 }}>Let&apos;s make it<br /><em>real.</em></h2>
                    <p>Whether you need a new website, a custom WordPress solution or a better-connected system, let&apos;s work out the right approach.</p>
                    <button className="jr-btn jr-btn-sun" type="button" onClick={() => openContact()}>
                        Let&apos;s talk
                        <BtnIsland />
                    </button>
                </div>
                <div className="jrc-sign">
                    <span className="jrc-person">
                        <SafeImg src={SITE.photo} alt={SITE.fullName} width={44} height={44} loading="lazy" />
                        <span><strong>{SITE.fullName}</strong>Freelance web developer, Philippines</span>
                    </span>
                    <span className="jrc-social">
                        <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" small /></a>
                        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" small /></a>
                    </span>
                </div>
            </article>

            <div className="jrc-options">
                {OPTIONS.map((o, i) => (
                    <a
                        key={o.title}
                        href={o.href}
                        className={`jr-card jrc-option jr-reveal jr-d${i + 2}`}
                        {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                        <span className="jrc-option-left">
                            <span className="jrc-option-icon"><Icon name={o.icon} /></span>
                            <span><h3>{o.title}</h3><p>{o.detail}</p></span>
                        </span>
                        <span className="jr-round"><Icon name="arrow" small /></span>
                    </a>
                ))}
            </div>
        </div>
    );
}
