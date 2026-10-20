import localFont from "next/font/local";
import "./globals.css";

/* Font files live in app/fonts and ship with the site:
   no request to Google at build time or at runtime (SIL Open Font License). */
/* Instrument Sans: text and headings (variable weight, with a true italic) */
const sans = localFont({
    src: [
        { path: "./fonts/instrument-sans-latin-wght-normal.woff2", weight: "400 700", style: "normal" },
        { path: "./fonts/instrument-sans-latin-wght-italic.woff2", weight: "400 700", style: "italic" }
    ],
    variable: "--font-sans",
    display: "swap"
});

/* Instrument Serif italic: accent words ("I build", "that", "real.") */
const serif = localFont({
    src: "./fonts/instrument-serif-latin-400-italic.woff2",
    weight: "400",
    style: "italic",
    variable: "--font-serif",
    display: "swap"
});

/* DM Mono: code snippets only (logs, sample data) */
const mono = localFont({
    src: [
        { path: "./fonts/dm-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
        { path: "./fonts/dm-mono-latin-500-normal.woff2", weight: "500", style: "normal" }
    ],
    variable: "--font-mono",
    display: "swap"
});

const display = localFont({
    src: "./fonts/anton-latin-400-normal.woff2",
    weight: "400",
    variable: "--font-display",
    display: "swap"
});

export const metadata = {
    title: "Rod Bargayo / Freelance Web Developer",
    description:
        "John Rodney Bargayo, freelance web developer in the Philippines. Websites and web apps on WordPress, Shopify, Squarespace, Framer and React, plus custom plugins and automation.",
    openGraph: {
        title: "Rod Bargayo / Freelance Web Developer",
        description: "Websites, web apps, custom plugins and automation.",
        type: "website"
    }
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#eef6fb"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable} ${display.variable}`}>
            <body>{children}</body>
        </html>
    );
}
