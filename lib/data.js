/* Content in one place: edit here, not inside components */

export const SITE = {
    name: "Rod Bargayo",
    fullName: "John Rodney Bargayo",
    role: "Websites that grow revenue",
    email: "johnrodney.bargayo@gmail.com",
    phone: "+63 999 677 8865",
    phoneHref: "tel:+639996778865",
    linkedin: "https://www.linkedin.com/in/rodbargayo/",
    facebook: "https://www.facebook.com/lockdown15100",
    instagram: "https://www.instagram.com/juanbargayo/",
    github: "https://github.com/johnrodneybargayo",
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/411068017_7561810227171334_4227971823188484885_n.jpg-OODEwjqHv6IuuC51YbGSbSRnBoyshS.jpeg",
    cutout: "/john_rodney_cutout.webp",
    portrait: "/john_rodney_overview.webp",
    portrait400: "/john_rodney_overview-400.webp",
    portrait560: "/john_rodney_overview-560.webp",
    portraitAvif: "/john_rodney_overview-400.avif 400w, /john_rodney_overview-480.avif 480w, /john_rodney_overview-560.avif 560w, /john_rodney_overview-760.avif 760w",
    portraitSizes: "(max-width: 760px) min(74vw, 290px), 380px",
    cutout480: "/john_rodney_cutout-480.webp",
    avatar: "/john_rodney_avatar.webp"
};

export const SECTIONS = [
    { id: "home", name: "Overview", short: "Home", icon: "home" },
    { id: "services", name: "Solutions", short: "Solutions", icon: "grid" },
    { id: "work", name: "Client results", short: "Results", icon: "work" },
    { id: "demos", name: "Try it live", short: "Try it", icon: "plug" },
    { id: "about", name: "Why work with me", short: "About", icon: "user" },
    { id: "contact", name: "Free growth review", short: "Contact", icon: "message" }
];

/* Screenshot helpers. Microlink is what the old Vercel site used;
   mShots is the fallback. */
export const shot = url =>
    `https://api.microlink.io?url=${url}&screenshot=true&meta=false&embed=screenshot.url`;

/* Previews are captured on a full-width desktop screen (1920 x 1080, 1x), so
   sites look the way visitors see them on a big monitor.
   Some sites have elements wider than the screen (marquees, sliders) that make
   a full-page capture come back squeezed; the pop-up detects that and moves on
   to the first-screen capture instead (see ProjectModal). */
const SHOT_WIDTH = 1920;
const SHOT_OPTS = `&viewport.width=${SHOT_WIDTH}&viewport.height=1080&viewport.deviceScaleFactor=1&styles=${encodeURIComponent("html{overflow-x:hidden!important}body{overflow-x:clip!important}")}`;

/* The screenshot services, in the order they're tried */
export const shotUpstream = url => [
    `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&screenshot.fullPage=true${SHOT_OPTS}&meta=false&embed=screenshot.url`,
    `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true${SHOT_OPTS}&meta=false&embed=screenshot.url`,
    `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1600&h=900&vpw=1920&vph=1080`
];

/* The pop-up loads screenshots through our own /api/shot route, so the browser can
   read the pixels and crop any sideways overflow (cross-site images can't be read). */
export const shotSources = url => shotUpstream(url).map((_, i) => `/api/shot?i=${i}&url=${encodeURIComponent(url)}`);

export const mshot = url => `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=960`;

export const favicon = domain => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

export const hostOf = url => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
};

/* CASE STUDIES
   Written for business owners: the problem, what I did, what it changed.
   metrics: add real numbers when you have them, e.g.
       { value: "+38%", label: "more enquiries in 90 days" }
   Cards show metrics when present; otherwise they show the result headline. */
export const FEATURED = [
    {
        key: "podify",
        title: "Podify",
        kicker: "Podcast production agency",
        url: "https://podify.com",
        result: "Turned one-off orders into prepaid, recurring revenue.",
        challenge: "Selling done-for-you podcast services meant quotes, invoices and status updates over email. Every reorder needed another conversation, and the team's time went into admin instead of production.",
        solution: "A branded client portal. Clients buy prepaid credit packs or a monthly plan, spend credits on services, and watch every episode move through production in real time. A referral and affiliate program on top rewards customers and partners who bring in new clients.",
        impact: [
            "Cash collected upfront through prepaid credits and monthly plans",
            "Clients reorder on their own, any time, without a sales call",
            "Status-update emails replaced by a live progress tracker",
            "Happy customers now bring in new customers, paid only when they buy"
        ],
        metrics: [],
        tags: ["CLIENT PORTAL", "SUBSCRIPTIONS", "REFERRALS"]
    },
    {
        key: "king",
        title: "King Operating",
        kicker: "Oil and gas investment",
        url: "https://kingoperating.com",
        result: "Ad spend now judged by investor leads, not clicks.",
        challenge: "Ads were running and investor enquiry forms were live, but the tracking was misconfigured, so form submissions weren't counted as conversions. There was no reliable way to tell which campaigns produced real investor leads.",
        solution: "Audited and repaired the tracking so every enquiry form is recorded as a conversion, and built focused campaign landing pages without the distractions of the main site menu.",
        impact: [
            "Every investor enquiry recorded as a conversion",
            "Budget can move to the campaigns that bring in leads",
            "Campaign pages built to do one job: get the enquiry"
        ],
        metrics: [],
        tags: ["CONVERSION TRACKING", "LANDING PAGES"]
    },
    {
        key: "laura",
        title: "Dr. Laura Berman",
        kicker: "Wellness education brand",
        url: "https://drlauraberman.com",
        result: "Free content now builds an email list that sells programs.",
        challenge: "Free resources drew a large audience, but that attention needed to turn into contacts the team could follow up with and invite into paid programs and events.",
        solution: "A one-step email gate on the free resources: visitors enter their email once, get instant access, and are recognised on every return visit with no password. Leads go into the team's course platform, backed by email sequences for community events.",
        impact: [
            "Every free-resource visitor becomes a named lead",
            "No passwords, so fewer people abandon the form",
            "A growing list to promote paid programs and events to"
        ],
        metrics: [],
        tags: ["LEAD CAPTURE", "EMAIL MARKETING"]
    }
];

/* Shorter wins, shown as a list. kicker = industry, outcome = what it does for the business. */
export const MORE_WORK = [
    { title: "Go Online Now", kicker: "Business coaching platform", outcome: "Booking calendar follows the reader, so a sales call is always one click away", url: "https://goonlinenow.co/" },
    { title: "Podify Launch", kicker: "Sales page", outcome: "A single page built to sell a podcast launch package", url: "https://services.podify.com/podcast-launch/" },
    { title: "Fair Seafood", kicker: "Seafood retail, South Australia", outcome: "Online shop with seasonal catch subscriptions and cooking school bookings", url: "https://fairseafood.com.au/" },
    { title: "EPFA", kicker: "Horse racing, sports science", outcome: "Subscription web app for logging training and analysing gallop data", url: "https://epfa.au/" },
    { title: "Real Deal Sports Tours", kicker: "Sports travel", outcome: "Tour pages that turn fans into bookings and enquiries", url: "https://realdealsportstours.com.au/" },
    { title: "Acuiti", kicker: "Software and digital agency", outcome: "Agency site built to book calls and bring in enquiries", url: "https://acuiti.au/" },
    { title: "Unido", kicker: "Crypto fintech", outcome: "Product site for a digital asset custody platform", url: "https://unido.us/" },
    { title: "EmpireOne CX", kicker: "Business process outsourcing", outcome: "Service site that drives consultation calls", url: "https://empireonecx.com/" },
    { title: "Catalina Media", kicker: "Parish communications ministry", outcome: "Members portal for membership, formation and service records", url: "https://catalina-media-members.vercel.app/" },
    { title: "Naomi Christiina", kicker: "Personal brand", outcome: "Personal brand website", url: "https://naomichristiina.com/" },
    { title: "Insight Out", kicker: "Business podcast", outcome: "Show website built to grow the audience", url: "https://insightoutshow.com/" },
    { title: "EIS Education", kicker: "Education provider", outcome: "Learning website, hosted and maintained", url: "https://eiseducation.com" },
    { title: "Bangkok Women", kicker: "Online community", outcome: "Membership community site", url: "https://bangkok-women.com/" },
    { title: "Peru Dating", kicker: "Dating platform", outcome: "Member sign-up platform", url: "https://perudating.com/" },
    { title: "Jay Abbasi", kicker: "Personal brand", outcome: "Personal brand website", url: "https://jayabbasi.me" },
    { title: "Construction demo", kicker: "Construction company", outcome: "Concept site built to win quote requests", url: "https://v7gipcjbs9bvqsav.vercel.app/" }
];

export const TRUSTED = ["podify.com", "drlauraberman.com", "labourhireandrecruitment.com.au", "goonlinenow.co"];

export const EXPERIENCE = [
    { badge: "AC", role: "Co-Founder and COO", where: "Aura Creo, digital agency" },
    { badge: "GO", role: "Developer and Marketer", where: "Go Online Now-Connect" },
    { badge: "FS", role: "Full-stack Developer", where: "LHR, Labour Hire and Recruitment" },
    { badge: "SE", role: "Software Engineer", where: "Nerubia, Inc." }
];
