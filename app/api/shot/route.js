/* Screenshot proxy for the project preview pop-up.
   GET /api/shot?i=<source index>&url=<project url>
   Fetches the screenshot from the service (lib/data.js shotUpstream) and serves it
   from this site, so the pop-up can read its pixels and crop sideways overflow.
   Only project URLs listed in lib/data.js are accepted, so this can't be used as
   an open proxy. Responses are cached at Vercel's edge for a day. */

import { FEATURED, MORE_WORK, shotUpstream } from "@/lib/data";

export const runtime = "nodejs";
/* full-page captures can take a while the first time */
export const maxDuration = 60;

const ALLOWED = new Set([...FEATURED, ...MORE_WORK].map(p => p.url));

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || "";
    const i = Number(searchParams.get("i") || 0);

    if (!ALLOWED.has(url)) return new Response("Not allowed", { status: 400 });
    const sources = shotUpstream(url);
    if (!Number.isInteger(i) || i < 0 || i >= sources.length) return new Response("Bad source", { status: 400 });

    try {
        const res = await fetch(sources[i], {
            redirect: "follow",
            headers: { "user-agent": "Mozilla/5.0 (compatible; RodBargayoPortfolio/2.1; +https://github.com/johnrodneybargayo)" },
            signal: AbortSignal.timeout(55000)
        });
        const type = res.headers.get("content-type") || "";
        if (!res.ok || !type.startsWith("image/")) return new Response("Screenshot unavailable", { status: 502 });
        return new Response(res.body, {
            headers: {
                "content-type": type,
                "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"
            }
        });
    } catch {
        return new Response("Screenshot unavailable", { status: 502 });
    }
}
