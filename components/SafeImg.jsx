"use client";

import { useEffect, useRef, useState } from "react";

/*
 * <img> that tries each source in `srcs` in order and hides itself if all fail,
 * so alt text never prints over a card. Plain <img> on purpose: these are live
 * screenshots from third-party services, not assets next/image can optimise.
 */
export default function SafeImg({ srcs, src, alt = "", className = "", ...rest }) {
    const list = srcs || [src];
    const [i, setI] = useState(0);
    const ref = useRef(null);
    const failed = i >= list.length;

    /* an image that failed before hydration never fires onError in React */
    useEffect(() => {
        const img = ref.current;
        if (img && img.complete && img.naturalWidth === 0 && img.getAttribute("src")) setI(n => n + 1);
    }, []);

    return (
        <img
            ref={ref}
            src={failed ? undefined : list[i]}
            alt={alt}
            className={`${className}${failed ? " is-broken" : ""}`.trim()}
            onError={() => setI(n => n + 1)}
            {...rest}
        />
    );
}
