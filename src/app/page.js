import ExperienceTimeline from "@/components/experience/timeline";
import ParallaxHero from "@/components/hero/parallax-hero";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Curve from "@/components/transitions/curve";
import { PROFILE, SITE_URL, STACK, TIMELINE } from "@/lib/data";

// Structured data: helps Google + AI crawlers understand who/what this is.
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: PROFILE.name,
            jobTitle: PROFILE.role,
            description: PROFILE.summary,
            email: `mailto:${PROFILE.email}`,
            url: SITE_URL,
            image: `${SITE_URL}/opengraph-image`,
            address: {
                "@type": "PostalAddress",
                addressLocality: "Kenitra / Rabat",
                addressCountry: "MA",
            },
            sameAs: [PROFILE.github, PROFILE.linkedin, PROFILE.site],
            knowsAbout: STACK,
            worksFor: TIMELINE.filter((t) => t.period.includes("Now")).map(
                (t) => ({
                    "@type": "Organization",
                    name: t.org.split(" · ")[0],
                }),
            ),
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: PROFILE.name,
            description: PROFILE.summary,
            inLanguage: "en",
            publisher: { "@id": `${SITE_URL}/#person` },
        },
        {
            "@type": "ProfilePage",
            "@id": `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: `${PROFILE.name} — ${PROFILE.role}`,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${SITE_URL}/#person` },
        },
    ],
};

export default function Home() {
    return (
        <main>
            <script
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, no user input
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ParallaxHero />
            <Curve label="Experience" />
            <ExperienceTimeline />
            <Curve label="About" />
            <About />
            <Curve label="Contact" />
            <Contact />
        </main>
    );
}
