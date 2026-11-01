import { Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { FEATURED, MORE_WORK, favicon, hostOf, mshot, shot } from "@/lib/data";

/* What business owners come to me for: outcomes, not tools */
const OUTCOMES = [
    { icon: "message", label: ["More leads", "and enquiries"] },
    { icon: "cart", label: ["Faster, upfront", "payments"] },
    { icon: "chart", label: ["Ad spend that", "pays back"] },
    { icon: "zap", label: ["Hours of admin", "saved weekly"] }
];

/* Real numbers, shown only when filled in (see FEATURED in lib/data.js) */
function Metrics({ items }) {
    if (!items || !items.length) return null;
    return (
        <ul className="jrcs-metrics" aria-label="Results">
            {items.map(m => (
                <li key={m.label}><strong>{m.value}</strong><span>{m.label}</span></li>
            ))}
        </ul>
    );
}

/* One case study card. The whole card is clickable through the single
   action button's stretched hit area, so there are no nested controls. */
function CaseCard({ p, featured, index, openProject }) {
    return (
        <article className={`jrw-card${featured ? " jrw-feature" : ""} jr-reveal jr-d${index + 2}`}>
            <div className="jrw-media">
                <SafeImg srcs={[shot(p.url), mshot(p.url)]} fit={featured ? 1080 : 640} alt={`Screenshot of the ${p.title} website`} loading="lazy" />
                <span className="jrw-badge">{p.kicker}</span>
            </div>

            <div className="jrw-body">
                <div className="jrw-text">
                    {!featured && <span className="jrw-kicker">{p.title}</span>}
                    <h3>{featured ? p.title : p.result}</h3>
                    {featured && <p className="jrcs-result">{p.result}</p>}
                    {featured && (
                        <>
                            <Metrics items={p.metrics} />
                            {!p.metrics?.length && (
                                <ul className="jrcs-wins">
                                    {p.impact.slice(0, 3).map(t => <li key={t}>{t}</li>)}
                                </ul>
                            )}
                        </>
                    )}
                </div>

                <button
                    type="button"
                    className={featured ? "jrw-action jrw-action-pill" : "jrw-action jr-round"}
                    aria-label={`Read the ${p.title} case study`}
                    onClick={() => openProject(p)}
                >
                    {featured && "Read the case study"}
                    <Icon name="arrow-right" small />
                </button>
            </div>
        </article>
    );
}

export default function Work({ openProject }) {
    const [feature, ...rest] = FEATURED;
    return (
        <>
            <div className="jrw-hero jr-reveal jr-d1">
                <div className="jrw-intro">
                    <h2 className="jrw-title">
                        Real businesses.<br />
                        <em>Real <span className="jrw-swash">results.</span></em>
                    </h2>
                    <p>What each business was struggling with, what I built, and what changed for their bottom line.</p>
                </div>

                <ul className="jrw-skills">
                    {OUTCOMES.map(s => (
                        <li key={s.icon}>
                            <span className="jrw-skill-icon"><Icon name={s.icon} /></span>
                            <span>{s.label[0]}<br />{s.label[1]}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="jrw-grid">
                <CaseCard p={feature} featured index={0} openProject={openProject} />
                {rest.map((p, i) => <CaseCard key={p.key} p={p} index={i + 1} openProject={openProject} />)}

                <section className="jrw-index jr-reveal jr-d5" aria-labelledby="jrw-more">
                    <div className="jrw-index-head">
                        <h3 id="jrw-more">More businesses I&apos;ve helped</h3>
                        <span className="jr-label">{MORE_WORK.length} live sites <Icon name="arrow-right" small /></span>
                    </div>
                    <ul className="jrw-list">
                        {MORE_WORK.map(w => (
                            <li key={w.url}>
                                <a
                                    href={w.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={w.outcome}
                                    onClick={e => {
                                        /* plain click opens the preview; Ctrl/Cmd/middle click still opens the site */
                                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                                        e.preventDefault();
                                        openProject({ ...w, desc: w.outcome, tags: [w.kicker.toUpperCase()] });
                                    }}
                                >
                                    <span className="jrw-logo" data-initial={w.title[0]}>
                                        <SafeImg src={favicon(hostOf(w.url))} alt="" loading="lazy" width={22} height={22} />
                                    </span>
                                    <span className="jrw-item-text"><strong>{w.title}</strong><span>{w.kicker}</span></span>
                                    <Icon name="chevron" small />
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </>
    );
}
