/* Icons: Font Awesome (solid + brands), tree-shaken SVGs rendered inline.
   Every section uses <Icon name="..." />, so the whole site switches here. */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
    faHouse, faTableCellsLarge, faBriefcase, faPlug, faUser, faComments, faArrowRight, faArrowUp,
    faXmark, faCode, faBolt, faCartShopping, faChartLine, faShieldHalved, faEnvelope,
    faMobileScreenButton, faPaintbrush, faLayerGroup, faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faGithub, faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";

/* the stylesheet is imported above, so don't inject it again at runtime */
config.autoAddCss = false;

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
    linkedin: faLinkedinIn,
    github: faGithub,
    facebook: faFacebookF,
    instagram: faInstagram
};

export function Icon({ name, small = false, className = "" }) {
    const icon = ICONS[name] || faArrowRight;
    return (
        <FontAwesomeIcon
            icon={icon}
            className={`jr-icon${small ? " jr-icon-sm" : ""}${className ? " " + className : ""}`}
            /* "arrow" is the diagonal "go to" arrow used on cards and buttons */
            transform={name === "arrow" ? { rotate: 45 } : undefined}
            aria-hidden="true"
        />
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
