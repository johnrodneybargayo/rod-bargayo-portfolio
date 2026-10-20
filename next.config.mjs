/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    /* Project screenshots come from microlink.io / WordPress mShots at full size.
       Vercel's image optimizer resizes and compresses them to the size shown. */
    images: {
        formats: ["image/avif", "image/webp"],
        maximumRedirects: 3,
        minimumCacheTTL: 60 * 60 * 24 * 7,
        remotePatterns: [
            { protocol: "https", hostname: "**.microlink.io" },
            { protocol: "https", hostname: "s0.wp.com" }
        ]
    },
    async headers() {
        return [
            {
                source: "/:file(.*\\.(?:webp|avif))",
                headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }]
            },
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
                ]
            }
        ];
    }
};

export default nextConfig;
