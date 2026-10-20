import { Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { FEATURED, MORE_WORK, favicon, hostOf, mshot, shot } from "@/lib/data";

const SKILLS = [
    { icon: "code", label: ["WordPress", "Development"] },
    { icon: "plug", label: ["Custom Plugins", "& Integrations"] },
    { icon: "brush", label: ["UI/UX &", "Responsive Design"] },
    { icon: "layers", label: ["Performance", "& Optimization"] }
];

/* One case-study card. The whole card is clickable through the single
   action button's stretched hit area, so there are no nested controls. */
function ProjectCard({ p, featured, index, openProject }) {
    const tags = p.stack.split(" / ");
    return (
        <article className={`jrw-card${featured ? " jrw-feature" : ""} jr-reveal jr-d${index + 2}`}>
            <div className="jrw-media">
                <SafeImg srcs={[shot(p.url), mshot(p.url)]} alt={`Screenshot of the ${p.title} website`} loading="lazy" />
                <span className="jrw-badge">{p.kicker}</span>
            </div>

            <div className="jrw-body">
                <div className="jrw-text">
                    {!featured && p.blurb && <span className="jrw-kicker">{p.kicker}</span>}
                    <h3>{p.title}</h3>
                    {featured && <p>{p.summary}</p>}
                    {!featured && p.blurb && <p>{p.blurb}</p>}
                    {(featured || !p.blurb) && (
                        <ul className="jrw-tags" aria-label="Built with">
                            {tags.map(t => <li key={t}>{t}</li>)}
                        </ul>
                    )}
                </div>

                <button
                    type="button"
                    className={featured ? "jrw-action jrw-action-pill" : "jrw-action jr-round"}
                    aria-label={featured ? `View project: ${p.title}` : `View ${p.title} project`}
                    onClick={() => openProject(p)}
                >
                    {featured && "View project"}
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
                        Built to solve.<br />
                        <em>Designed <span className="jrw-swash">to work.</span></em>
                    </h2>
                    <p>Clean, modern, and functional web experiences, built with WordPress and modern technologies.</p>
                </div>

                <ul className="jrw-skills">
                    {SKILLS.map(s => (
                        <li key={s.icon}>
                            <span className="jrw-skill-icon"><Icon name={s.icon} /></span>
                            <span>{s.label[0]}<br />{s.label[1]}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="jrw-grid">
                <ProjectCard p={feature} featured index={0} openProject={openProject} />
                {rest.map((p, i) => <ProjectCard key={p.key} p={p} index={i + 1} openProject={openProject} />)}

                <section className="jrw-index jr-reveal jr-d5" aria-labelledby="jrw-more">
                    <div className="jrw-index-head">
                        <h3 id="jrw-more">More work</h3>
                        <span className="jr-label">{MORE_WORK.length} live projects <Icon name="arrow-right" small /></span>
                    </div>
                    <ul className="jrw-list">
                        {MORE_WORK.map(w => (
                            <li key={w.url}>
                                <a
                                    href={w.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => {
                                        /* plain click opens the preview; Ctrl/Cmd/middle click still opens the site */
                                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                                        e.preventDefault();
                                        openProject({ ...w, tags: [w.kicker.toUpperCase()] });
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
