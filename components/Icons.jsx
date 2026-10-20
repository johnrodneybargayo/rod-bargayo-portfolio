/* Icons: Font Awesome (solid + brands). Only the icon shapes are imported and
   drawn as inline SVG, so there is no icon runtime or extra stylesheet to load.
   Every section uses <Icon name="..." />, so the whole site switches here. */
import {
    faHouse, faTableCellsLarge, faBriefcase, faPlug, faUser, faComments, faArrowRight, faArrowUp,
    faXmark, faCode, faBolt, faCartShopping, faChartLine, faShieldHalved, faEnvelope,
    faMobileScreenButton, faPaintbrush, faLayerGroup, faChevronRight,
    faRocket, faCircleQuestion, faHeadset, faPaperPlane, faMinus, faCommentDots
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faGithub, faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";

const ICONS = {
    home: faHouse,
    grid: faTableCellsLarge,
    work: faBriefcase,
    plug: faPlug,
    user: faUser,
    message: faComments,
    arrow: faArrowUp,
    "arrow-right": faArrowRight,
    close: faXmark,
    code: faCode,
    zap: faBolt,
    cart: faCartShopping,
    chart: faChartLine,
    shield: faShieldHalved,
    mail: faEnvelope,
    phone: faMobileScreenButton,
    brush: faPaintbrush,
    layers: faLayerGroup,
    chevron: faChevronRight,
    rocket: faRocket,
    question: faCircleQuestion,
    headset: faHeadset,
    send: faPaperPlane,
    minus: faMinus,
    dots: faCommentDots,
    linkedin: faLinkedinIn,
    github: faGithub,
    facebook: faFacebookF,
    instagram: faInstagram
};

export function Icon({ name, small = false, className = "" }) {
    const [w, h, , , path] = (ICONS[name] || faArrowRight).icon;
    const paths = Array.isArray(path) ? path : [path];
    return (
        <svg
            className={`jr-icon${small ? " jr-icon-sm" : ""}${className ? " " + className : ""}`}
            viewBox={`0 0 ${w} ${h}`}
            aria-hidden="true"
            focusable="false"
        >
            {/* "arrow" is the diagonal "go to" arrow used on cards and buttons */}
            <g transform={name === "arrow" ? `rotate(45 ${w / 2} ${h / 2})` : undefined}>
                {paths.map((d, k) => <path key={k} fill="currentColor" d={d} />)}
            </g>
        </svg>
    );
}

/* Pill CTA with the arrow in its own circle */
export function BtnIsland({ icon = "arrow" }) {
    return (
        <span className="jr-btn-island">
            <Icon name={icon} small />
        </span>
    );
}
