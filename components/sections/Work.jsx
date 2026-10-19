import { Icon } from "../Icons";
import SafeImg from "../SafeImg";
import { FEATURED, MORE_WORK, favicon, hostOf, mshot, shot } from "@/lib/data";

export default function Work({ openProject }) {
    return (
        <>
            <div className="jr-section-head jr-reveal jr-d1">
                <h2 className="jr-title">Built to solve. <em>Designed to work.</em></h2>
            </div>

            <div className="jrw-grid">
                {FEATURED.map((p, i) => (
                    <button
                        key={p.key}
                        type="button"
                        className={`jr-card jrw-card${i === 0 ? " jrw-feature" : ""} jr-reveal jr-d${i + 2}`}
                        onClick={() => openProject(p)}
                    >
                        <SafeImg srcs={[shot(p.url), mshot(p.url)]} alt={`${p.title} website`} loading="lazy" />
                        <span className="jrw-shade" />
                        <span className="jr-round"><Icon name="arrow" small /></span>
                        <span className="jrw-body">
                            <span className="jr-label">{p.kicker}</span>
                            <h3>{p.title}</h3>
                            {i === 0 && <p>{p.summary}</p>}
                            <span className="jrw-stack" style={{ display: "block" }}>{p.stack}</span>
                        </span>
                    </button>
                ))}

                <div className="jr-card jrw-index jr-reveal jr-d5">
                    <div className="jrw-index-head">
                        <h3>More work</h3>
                        <span className="jr-label">{MORE_WORK.length} live projects</span>
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
                                    <SafeImg src={favicon(hostOf(w.url))} alt="" loading="lazy" width={28} height={28} />
                                    <span className="jrw-item-text"><strong>{w.title}</strong><span>{w.kicker}</span></span>
                                    <Icon name="arrow" small />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
