"use client";

import { useEffect, useRef, useState } from "react";

/* Briefly highlight a number when it changes */
export function useBump(value) {
    const [on, setOn] = useState(false);
    const first = useRef(true);
    useEffect(() => {
        if (first.current) { first.current = false; return; }
        setOn(true);
        const t = setTimeout(() => setOn(false), 700);
        return () => clearTimeout(t);
    }, [value]);
    return on ? "is-bump" : "";
}

export const clock = () =>
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

let seq = 0;
export const uid = () => `d${Date.now().toString(36)}${(seq++).toString(36)}`;
