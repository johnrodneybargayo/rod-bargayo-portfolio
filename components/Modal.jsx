"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./Icons";

/*
 * Accessible overlay: Escape and backdrop close it, Tab stays inside,
 * focus returns to whatever opened it.
 */
export default function Modal({ open, onClose, labelledBy, dialogClass = "", closeInBar = false, children }) {
    const backdropRef = useRef(null);
    const returnTo = useRef(null);

    useEffect(() => {
        if (!open) return;
        returnTo.current = document.activeElement;
        const backdrop = backdropRef.current;

        const focusTimer = setTimeout(() => {
            const first = backdrop.querySelector("input, textarea, button:not(.jrm-close)") || backdrop.querySelector("button");
            if (first) first.focus();
        }, 200);

        const onKey = e => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key !== "Tab") return;
            const items = [...backdrop.querySelectorAll("button, input, textarea, select, a[href], iframe")]
                .filter(el => !el.disabled && el.offsetParent !== null);
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };

        document.addEventListener("keydown", onKey);
        return () => {
            clearTimeout(focusTimer);
            document.removeEventListener("keydown", onKey);
            const back = returnTo.current;
            if (back && document.contains(back) && typeof back.focus === "function") back.focus();
        };
    }, [open, onClose]);

    return (
        <div
            ref={backdropRef}
            className={`jrm-backdrop${open ? " is-open" : ""}`}
            aria-hidden={!open}
            inert={!open}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <section className={`jrm-dialog ${dialogClass}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
                {!closeInBar && (
                    <button className="jrm-close" type="button" onClick={onClose} aria-label="Close">
                        <Icon name="close" small />
                    </button>
                )}
                {children}
            </section>
        </div>
    );
}
