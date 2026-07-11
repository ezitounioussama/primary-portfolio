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
    summary:
        "Senior full-stack engineer with 3+ years architecting and shipping scalable web applications across enterprise and startup ecosystems — dual expertise in the JavaScript and PHP worlds, plus DevOps and cloud-native infrastructure.",
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
    bio: "Software engineer and data scientist at heart — for the past 3 years I've been architecting enterprise platforms at Intelcia Tech that serve millions of users, and shipping freelance web, mobile, and AI products on the side. When I'm not shipping, I'm writing on DEV.to or mentoring the next wave of engineers.",
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
            body: "Mentored 5+ engineers and taught data science cohorts at GoMyCode. Knowledge shared is leverage gained.",
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
export const TIMELINE = [
    {
        period: "2023 — Now",
        tags: [
            "React",
            "Next.js 15",
            "TypeScript",
            "Symfony",
            "NestJS",
            "Docker",
            "GitHub Actions",
        ],
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
            "Shipped 12+ web & mobile apps for clients across industries (React, Next.js, Vue, Node.js, Laravel, Symfony, React Native).",
            "Owned system architecture, database design (PostgreSQL, MongoDB, Redis), APIs, frontend, DevOps, and cloud deployment end to end.",
            "Built Nlivrilik — real-time last-mile logistics with GPS tracking, driver routing, and multi-role dashboards (Next.js, Node.js, PostgreSQL).",
            "Delivered Aksam Assurance, Paylik, HoussniJob, Ibn Tofail University, and Jadara Foundation.",
            "Maintain a developer toolkit suite and CLI with 100+ weekly npm downloads.",
        ],
    },
    {
        period: "2023 — 2024",
        tags: ["Python", "Pandas", "Scikit-learn", "Data Viz"],
        role: "Data Science Instructor",
        org: "GoMyCode · Rabat",
        points: [
            "Taught Data Science & ML (Python, Pandas, Scikit-learn, visualization, predictive modeling) to cohorts of 5–10 students.",
        ],
    },
    {
        period: "Education",
        tags: ["Woolf University", "MIAGE", "ALX", "Hedera"],
        role: "M.Sc. Computer Science · MIAGE",
        org: "Woolf University (EU) · Université Mohammed V",
        points: [
            "M.Sc. Computer Science (Bac+5) — Woolf University, EU-accredited (in progress).",
            "Licence MIAGE (Bac+3, European Bachelor) and DUT MIAGE (Bac+2).",
            "Certified JavaScript Developer (Orange), ALX Software Engineering & Data Science, Certified Hedera Blockchain Developer.",
        ],
    },
];
