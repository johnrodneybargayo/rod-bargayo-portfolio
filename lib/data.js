/* Content in one place: edit here, not inside components */

export const SITE = {
    name: "Rod Bargayo",
    fullName: "John Rodney Bargayo",
    role: "Freelance web developer",
    email: "johnrodney.bargayo@gmail.com",
    phone: "+63 999 677 8865",
    phoneHref: "tel:+639996778865",
    linkedin: "https://www.linkedin.com/in/rodbargayo/",
    facebook: "https://www.facebook.com/lockdown15100",
    instagram: "https://www.instagram.com/juanbargayo/",
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/411068017_7561810227171334_4227971823188484885_n.jpg-OODEwjqHv6IuuC51YbGSbSRnBoyshS.jpeg",
    cutout: "/john_rodney_cutout.webp",
    portrait: "/john_rodney_overview.webp"
};

export const SECTIONS = [
    { id: "home", name: "Overview", short: "Home", icon: "home" },
    { id: "services", name: "Expertise", short: "Expertise", icon: "grid" },
    { id: "work", name: "Selected work", short: "Work", icon: "work" },
    { id: "demos", name: "Plugin demos", short: "Demos", icon: "plug" },
    { id: "about", name: "About me", short: "About", icon: "user" },
    { id: "contact", name: "Contact", short: "Contact", icon: "message" }
];

/* Screenshot helpers. Microlink is what the old Vercel site used;
   mShots is the fallback. */
export const shot = url =>
    `https://api.microlink.io?url=${url}&screenshot=true&meta=false&embed=screenshot.url`;

export const shotSources = url => [
    `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&screenshot.fullPage=true&meta=false&embed=screenshot.url`,
    `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`,
    `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=2400&vpw=1280&vph=2400`
];

export const mshot = url => `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=960`;

export const favicon = domain => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

export const hostOf = url => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
};

export const FEATURED = [
    {
        key: "podify",
        title: "Podify",
        kicker: "Podcast management platform",
        url: "https://podify.com",
        summary: "A podcast management platform, with a custom client portal and referral program built as WordPress plugins.",
        desc: "A podcast management platform. I build and maintain its WordPress side, including a custom client portal with credits and a referral and affiliate program, each as its own plugin.",
        stack: "WordPress / PHP / Custom plugins",
        tags: ["WORDPRESS", "PHP", "CUSTOM PLUGINS"]
    },
    {
        key: "lhr",
        title: "Labour Hire and Recruitment",
        kicker: "Recruitment platform",
        url: "https://labourhireandrecruitment.com.au",
        desc: "The recruitment platform for an Australian labour hire company, built during my time with LHR as a full-stack developer.",
        stack: "Full-stack build",
        blurb: "Full-stack build, modern and scalable.",
        tags: ["FULL-STACK", "RECRUITMENT"]
    },
    {
        key: "laura",
        title: "Dr. Laura Berman",
        kicker: "Community platform",
        url: "https://drlauraberman.com",
        desc: "A community platform for Dr. Laura Berman's audience. I work across her platforms on WordPress builds and the integrations that connect them.",
        stack: "WordPress / Integrations",
        tags: ["WORDPRESS", "INTEGRATIONS", "COMMUNITY"]
    }
];

export const MORE_WORK = [
    { title: "Insight Out", kicker: "Business podcast", url: "https://insightoutshow.com/" },
    { title: "Podify Launch", kicker: "Sales page", url: "https://services.podify.com/launch-sales-page/" },
    { title: "MedPersonnel", kicker: "Medical recruitment", url: "https://medpersonnel.com.au/" },
    { title: "Go Online Now", kicker: "Business platform", url: "https://goonlinenow.co/" },
    { title: "EIS Education", kicker: "Learning platform", url: "https://eiseducation.com" },
    { title: "Jay Abbasi", kicker: "Portfolio", url: "https://jayabbasi.me" },
    { title: "Bangkok Women", kicker: "Community", url: "https://bangkok-women.com/" },
    { title: "Peru Dating", kicker: "Dating platform", url: "https://perudating.com/" },
    { title: "Keystroke Quest", kicker: "Web app on Vercel", url: "https://htas2wdun2k.vercel.app/" },
    { title: "Construction demo", kicker: "Concept site on Vercel", url: "https://v7gipcjbs9bvqsav.vercel.app/" }
];

export const TRUSTED = ["podify.com", "drlauraberman.com", "labourhireandrecruitment.com.au", "goonlinenow.co"];

export const EXPERIENCE = [
    { badge: "WP", role: "WordPress Website Developer", where: "Independent, Philippines" },
    { badge: "FS", role: "Full-stack Developer", where: "LHR, Labour Hire and Recruitment" },
    { badge: "SE", role: "Software Engineer", where: "Nerubia, Inc." },
    { badge: "IT", role: "Head of Information Technology", where: "Technology leadership and systems" }
];
