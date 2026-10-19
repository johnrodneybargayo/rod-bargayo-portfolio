/* One inline sprite, referenced everywhere with <Icon name="..." /> */

export function IconSprite() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
            <symbol id="i-home" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9" /><path d="M9 21v-7h6v7" /></symbol>
            <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></symbol>
            <symbol id="i-work" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="3" /><path d="M8 7V4h8v3" /><path d="M3 12h18" /><path d="M10 12v2h4v-2" /></symbol>
            <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2z" /></symbol>
            <symbol id="i-message" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /></symbol>
            <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></symbol>
            <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M4 12h16" /><path d="m13 5 7 7-7 7" /></symbol>
            <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></symbol>
            <symbol id="i-code" viewBox="0 0 24 24"><path d="m8 8-5 4 5 4" /><path d="m16 8 5 4-5 4" /><path d="m14 4-4 16" /></symbol>
            <symbol id="i-plug" viewBox="0 0 24 24"><path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M6 8h12v4a6 6 0 0 1-12 0z" /></symbol>
            <symbol id="i-zap" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 10-12h-7z" /></symbol>
            <symbol id="i-cart" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></symbol>
            <symbol id="i-chart" viewBox="0 0 24 24"><path d="M3 3v18h18" /><path d="m8 14 4-4 4 3 5-7" /></symbol>
            <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /><path d="m9 12 2 2 4-4" /></symbol>
            <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" /></symbol>
            <symbol id="i-linkedin" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7" /><path d="M8 7v.01" /><path d="M12 17v-7h4v7" /><path d="M12 13a3 3 0 0 1 4-3" /></symbol>
            <symbol id="i-facebook" viewBox="0 0 24 24"><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" /></symbol>
            <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5v.01" /></symbol>
            <symbol id="i-phone" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></symbol>
        </svg>
    );
}

export function Icon({ name, small = false, className = "" }) {
    return (
        <svg className={`jr-icon${small ? " jr-icon-sm" : ""}${className ? " " + className : ""}`} aria-hidden="true" focusable="false">
            <use href={`#i-${name}`} />
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
