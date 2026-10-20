"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { ImageGate } from "./ImageGate";

/*
 * <img> that tries each source in `srcs` in order and hides itself if all fail,
 * so alt text never prints over a card.
 *
 * `fit` = the width (px) to deliver remote screenshots at. Those sources
 * (microlink.io, mShots) are full-size captures, so they're sent through
 * Next's image optimizer first (resized + AVIF/WebP); the raw URL stays as
 * a fallback if the optimizer can't fetch it.
 */
const ALLOWED = /^https:\/\/([a-z0-9-]+\.)*microlink\.io[/?]|^https:\/\/s0\.wp\.com\//;
const optimized = (url, w) => `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;

export default function SafeImg({ srcs, src, fit, alt = "", className = "", ...rest }) {
    const base = srcs || [src];
    const list = fit ? base.flatMap(u => (ALLOWED.test(u) ? [optimized(u, fit), u] : [u])) : base;
    const show = useContext(ImageGate);
    const [i, setI] = useState(0);
    const ref = useRef(null);
    const failed = i >= list.length;

    /* an image that failed before hydration never fires onError in React */
    useEffect(() => {
        const img = ref.current;
        if (img && img.complete && img.naturalWidth === 0 && img.getAttribute("src")) setI(n => n + 1);
    }, [show]);

    return (
        <img
            ref={ref}
            src={failed || !show ? undefined : list[i]}
            alt={alt}
            decoding="async"
            className={`${className}${failed ? " is-broken" : ""}`.trim()}
            onError={() => setI(n => n + 1)}
            {...rest}
        />
    );
}
