// Central content for the portfolio. Edit here; sections read from this.

// Canonical production origin (no trailing slash). Set NEXT_PUBLIC_SITE_URL in the
// environment for the real domain; the fallback is a placeholder — update it.
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://oussama-ezitouni.com";

export const PROFILE = {
    name: "Oussama Ezitouni",
    // Name variants — fed to JSON-LD alternateName + keywords so searches
    // with any ordering, spacing, or misspelling still resolve to this site.
    alternateNames: [
        // Reversed order (family name first — common in Morocco)
        "Ezitouni Oussama",
        "Zitouni Oussama",
        // No-space / handle forms (matches email + GitHub + LinkedIn handles)
        "oussamaezitouni",
        "ezitounioussama",
        // Misspellings
        "Oussama Zitouni",
        "Oussama Ezzitouni",
        "Ousama Ezitouni",
        "Usama Ezitouni",
        "Oussama El Zitouni",
    ],
    role: "Senior Full-Stack Engineer",
    tagline: "JavaScript Expert · PHP Specialist · DevOps Architect",
    location: "Kenitra / Rabat, Morocco",
    email: "ezitounioussama@gmail.com",
    site: "https://gotodev.ma",
    github: "https://github.com/ezitounioussama",
    linkedin: "https://www.linkedin.com/in/ezitounioussama",
    devto: "https://dev.to/ezitounioussama",
    twitter: "https://x.com/ezitounioussama",
    npmPackage: "https://www.npmjs.com/package/gotodev",
    summary:
        "Senior full-stack engineer with 3+ years architecting and shipping scalable web applications across enterprise and startup ecosystems — dual expertise in the JavaScript and PHP worlds, plus DevOps and cloud-native infrastructure.",
    shortSummary:
        "Senior Full-Stack Engineer in Rabat, Morocco — React, Next.js, Node.js, PHP (Symfony, PRADO) and DevOps. 3+ years shipping platforms used by millions.",
};

// Root-relative anchors (/#x, not #x) so links work from any route (e.g. 404).
export const NAV_ITEMS = [
    { label: "Home", href: "/#home", icon: "home" },
    { label: "Experience", href: "/#experience", icon: "layers" },
    { label: "About", href: "/#about", icon: "user" },
    { label: "Stack", href: "/#stack", icon: "code" },
    { label: "Contact", href: "/#contact", icon: "mail" },
    { label: "GitHub", href: PROFILE.github, icon: "github", external: true },
];

// Skills summary (JSON-LD knowsAbout + About copy).
export const STACK = [
    "JavaScript",
    "React 19",
    "Next.js 16",
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

// Tech-stack section tiles. `icon` is a simple-icons CDN slug
// (https://cdn.simpleicons.org/<slug>) — verify a slug 200s before adding.
export const TECH_CATEGORIES = [
    { key: "js", label: "JavaScript" },
    { key: "php", label: "PHP" },
    { key: "data", label: "Data Science" },
    { key: "db", label: "Databases" },
    { key: "devops", label: "DevOps & Cloud" },
];

export const TECH_STACK = [
    // JavaScript ecosystem
    { name: "JavaScript", icon: "javascript", category: "js" },
    { name: "TypeScript", icon: "typescript", category: "js" },
    { name: "React", icon: "react", category: "js" },
    { name: "Next.js", icon: "nextdotjs", category: "js" },
    { name: "Vue.js", icon: "vuedotjs", category: "js" },
    { name: "Angular", icon: "angular", category: "js" },
    { name: "Svelte", icon: "svelte", category: "js" },
    { name: "Node.js", icon: "nodedotjs", category: "js" },
    { name: "NestJS", icon: "nestjs", category: "js" },
    { name: "Express", icon: "express", category: "js" },
    { name: "Fastify", icon: "fastify", category: "js" },
    { name: "GSAP", icon: "greensock", category: "js" },
    { name: "Tailwind", icon: "tailwindcss", category: "js" },
    { name: "GraphQL", icon: "graphql", category: "js" },
    { name: "Jest", icon: "jest", category: "js" },
    { name: "Cypress", icon: "cypress", category: "js" },
    // PHP ecosystem
    { name: "PHP", icon: "php", category: "php" },
    { name: "Symfony", icon: "symfony", category: "php" },
    { name: "PRADO", initials: "PR", category: "php" },
    { name: "Laravel", icon: "laravel", category: "php" },
    // Data science
    { name: "Python", icon: "python", category: "data" },
    { name: "Pandas", icon: "pandas", category: "data" },
    { name: "NumPy", icon: "numpy", category: "data" },
    { name: "Scikit-learn", icon: "scikitlearn", category: "data" },
    { name: "TensorFlow", icon: "tensorflow", category: "data" },
    // Databases & caching
    { name: "PostgreSQL", icon: "postgresql", category: "db" },
    { name: "MySQL", icon: "mysql", category: "db" },
    { name: "MongoDB", icon: "mongodb", category: "db" },
    { name: "Redis", icon: "redis", category: "db" },
    { name: "Elasticsearch", icon: "elasticsearch", category: "db" },
    { name: "Firebase", icon: "firebase", category: "db" },
    // DevOps & cloud
    { name: "Docker", icon: "docker", category: "devops" },
    { name: "Kubernetes", icon: "kubernetes", category: "devops" },
    { name: "GitHub Actions", icon: "githubactions", category: "devops" },
    { name: "GitLab CI", icon: "gitlab", category: "devops" },
    { name: "Jenkins", icon: "jenkins", category: "devops" },
    { name: "Nginx", icon: "nginx", category: "devops" },
    { name: "Terraform", icon: "terraform", category: "devops" },
    { name: "Prometheus", icon: "prometheus", category: "devops" },
    { name: "Grafana", icon: "grafana", category: "devops" },
    { name: "Linux", icon: "linux", category: "devops" },
    { name: "Git", icon: "git", category: "devops" },
    { name: "Bash", icon: "gnubash", category: "devops" },
];

// About section content (Halpin-style personal intro).
export const ABOUT = {
    greeting: "I'm Oussama.",
    intro: "A senior full-stack engineer at Intelcia Tech.",
    bio: "Software engineer and data scientist at heart — for the past 3 years at Intelcia Tech I've been the engineer who touches everything: architecture, backends, frontends, and the pipelines that keep them honest, on platforms serving millions of users. On the side I ship freelance products, teach an international master's cohort at Woolf University, and write about all of it on DEV.to.",
    availability: "Available for freelance",
    stats: [
        { value: 3, suffix: "+", label: "Years building" },
        { value: 12, suffix: "+", label: "Apps shipped" },
        { value: 50, suffix: "+", label: "Institutions served" },
        { value: 120, suffix: "+", label: "Public repos" },
    ],
    values: [
        {
            icon: "layers",
            title: "End-to-end ownership",
            body: "From requirements and system design to deployment and optimization — I own the full SDLC, not just a slice of it.",
        },
        {
            icon: "gauge",
            title: "Performance obsessed",
            body: "40% faster loads and 10× traffic capacity on enterprise platforms. Speed is a feature, and I treat it like one.",
        },
        {
            icon: "graduation",
            title: "Teach & multiply",
            body: "From data science cohorts at GoMyCode to master's students at Woolf University — plus 5+ engineers mentored at work. Knowledge shared is leverage gained.",
        },
    ],
    // Floating chips orbiting the portrait (label + parallax depth).
    orbit: [
        { label: "React", depth: 30 },
        { label: "PHP", depth: 22 },
        { label: "Python · ML", depth: 38 },
        { label: "DevOps", depth: 26 },
    ],
};

// Career + education journey, rendered by the timeline section.
// `ghost` overrides the big parallax numeral (defaults to the year / 3 letters).
export const TIMELINE = [
    {
        period: "2023 — Now",
        tags: ["React", "Next.js", "TypeScript", "Symfony", "PRADO", "Docker"],
        role: "Senior Software Engineer & Technical Lead",
        org: "Intelcia Tech · Rabat",
        points: [
            "The engineer teams call when it matters — I own the platform end to end: architecture, data, APIs, frontend, pipelines. Millions of users, 50+ institutions.",
            "Rebuilt enterprise frontends in React / Next.js / TypeScript — 40% faster loads, load-tested to 10× the previous traffic capacity.",
            "Modernized national-scale PHP (Symfony, PRADO) and Node.js (NestJS, Fastify) backends with zero-downtime, blue-green style rollouts.",
        ],
    },
    {
        period: "2023 — 2024",
        ghost: "MSc",
        tags: ["Software Architecture", "Web Engineering", "Mentorship"],
        role: "Instructor — International M.Sc. Computer Science",
        org: "Woolf University (EU) · Remote",
        points: [
            "Teach software engineering to an international master's cohort — the same architecture, testing, and system-design practices I use in production every day.",
            "Supervise student projects from first commit to defended thesis.",
            "Wrote the course material on modern web engineering: React, APIs, databases, and DevOps.",
        ],
    },
    {
        period: "2022 — Now",
        tags: [
            "Next.js",
            "Vue.js",
            "Laravel",
            "React Native",
            "PostgreSQL",
            "Redis",
        ],
        role: "Freelance Full-Stack Engineer",
        org: "Independent · Morocco",
        points: [
            "Shipped 12+ web & mobile products: Nlivrilik (logistics), Aksam Assurance (insurance), Paylik (fintech), HoussniJob (recruitment), Ibn Tofail University (education).",
            "Nlivrilik: real-time last-mile delivery with GPS tracking, driver routing, and multi-role dashboards (Next.js, Node.js, PostgreSQL).",
            "Every project is mine end to end: architecture, database, APIs, UI, deployment.",
            "Maintain gotodev, a developer CLI with 100+ weekly npm downloads.",
        ],
        links: [
            { label: "nlivrilik.ma", href: "https://nlivrilik.ma" },
            {
                label: "gotodev on npm",
                href: "https://www.npmjs.com/package/gotodev",
            },
        ],
    },
    {
        period: "2023 — 2024",
        ghost: "DATA",
        tags: ["Python", "Pandas", "Scikit-learn", "Data Viz"],
        role: "Data Science Instructor",
        org: "GoMyCode · Rabat",
        points: [
            "Taught Data Science & ML to cohorts of 5–10 — from their first notebook to working predictive models.",
            "Built a hands-on curriculum around real datasets, not toy examples.",
        ],
    },
    {
        period: "2022 — Now",
        ghost: "TALK",
        tags: ["Speaking", "Writing", "Hackathons"],
        role: "Talks, writing & community",
        org: "Morocco & remote",
        points: [
            "Internal engineering talks at Intelcia — from taming legacy PHP to shipping motion without killing performance.",
            "Mentor and jury at student hackathons around Rabat.",
            "Technical writer on DEV.to since 2022 — 120+ public repos on GitHub.",
        ],
    },
    {
        period: "Education",
        ghost: "EDU",
        tags: ["Woolf University", "MIAGE", "ALX", "Hedera"],
        role: "M.Sc. Computer Science · MIAGE",
        org: "Woolf University (EU) · Université Mohammed V",
        points: [
            "M.Sc. Computer Science (Bac+5) — Woolf University, EU-accredited (in progress).",
            "Licence MIAGE (European Bachelor) & DUT MIAGE — Université Mohammed V, Rabat.",
            "Certified: JavaScript (Orange), ALX Software Engineering & Data Science, Hedera Blockchain Developer.",
        ],
    },
];
