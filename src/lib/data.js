// Central content for the portfolio. Edit here; sections read from this.

// Canonical production origin (no trailing slash). Set NEXT_PUBLIC_SITE_URL in the
// environment for the real domain; the fallback is a placeholder — update it.
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://oussamaezitouni.com";

export const PROFILE = {
    name: "Oussama Ezitouni",
    role: "Senior Full-Stack Engineer",
    tagline: "JavaScript Expert · PHP Specialist · DevOps Architect",
    location: "Kenitra / Rabat, Morocco",
    email: "ezitounioussama@gmail.com",
    site: "https://gotodev.ma",
    github: "https://github.com/ezitounioussama",
    linkedin: "https://www.linkedin.com/in/ezitounioussama",
    summary:
        "Senior full-stack engineer with 3+ years architecting and shipping scalable web applications across enterprise and startup ecosystems — dual expertise in the JavaScript and PHP worlds, plus DevOps and cloud-native infrastructure.",
};

export const NAV_ITEMS = [
    { label: "Home", href: "#home", icon: "home" },
    { label: "Experience", href: "#experience", icon: "layers" },
    { label: "About", href: "#about", icon: "user" },
    { label: "Contact", href: "#contact", icon: "mail" },
    { label: "GitHub", href: PROFILE.github, icon: "github", external: true },
];

// Skills surfaced as chips in the About section.
export const STACK = [
    "React 19",
    "Next.js 15",
    "TypeScript",
    "Node.js",
    "NestJS",
    "Vue.js",
    "Symfony",
    "Laravel",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "AWS",
];

// Career + education journey, rendered by the timeline section.
export const TIMELINE = [
    {
        period: "2023 — Now",
        role: "Senior Software Engineer & Technical Lead",
        org: "Intelcia Tech · Rabat",
        points: [
            "Architected React / Next.js 15 / TypeScript frontends for enterprise platforms — 40% performance gains and 10× traffic capacity.",
            "Led PHP (Symfony, PRADO) and Node.js (NestJS, Fastify) backends: REST APIs, database schemas, and microservices serving millions of users.",
            "Built Docker-based environments and GitHub Actions CI/CD to standardize deployments across distributed teams.",
            "Refactored legacy PHP/JS codebases for national-scale deployments across 50+ institutions.",
            "Drove code reviews and mentored 5+ junior engineers through structured onboarding and pair programming.",
        ],
    },
    {
        period: "2022 — Now",
        role: "Co-Founder, Lead Architect & Full-Stack Engineer",
        org: "GoToDev · gotodev.ma",
        points: [
            "Co-founded and scaled a software agency delivering 12+ web & mobile apps (React, Next.js, Vue, Node.js, Laravel, Symfony, React Native).",
            "Owned system architecture, database design (PostgreSQL, MongoDB, Redis), APIs, frontend, DevOps, and cloud deployment end to end.",
            "Built Nlivrilik — real-time last-mile logistics with GPS tracking, driver routing, and multi-role dashboards (Next.js, Node.js, PostgreSQL).",
            "Delivered Aksam Assurance, Paylik, HoussniJob, Ibn Tofail University, and Jadara Foundation.",
            "Shipped Toolkit.gotodev.ma and maintain the gotodev CLI (100+ weekly npm downloads).",
        ],
    },
    {
        period: "2023 — 2024",
        role: "Data Science Instructor",
        org: "GoMyCode · Rabat",
        points: [
            "Taught Data Science & ML (Python, Pandas, Scikit-learn, visualization, predictive modeling) to cohorts of 5–10 students.",
        ],
    },
    {
        period: "Education",
        role: "M.Sc. Computer Science · MIAGE",
        org: "Woolf University (EU) · Université Mohammed V",
        points: [
            "M.Sc. Computer Science (Bac+5) — Woolf University, EU-accredited (in progress).",
            "Licence MIAGE (Bac+3, European Bachelor) and DUT MIAGE (Bac+2).",
            "Certified JavaScript Developer (Orange), ALX Software Engineering & Data Science, Certified Hedera Blockchain Developer.",
        ],
    },
];
