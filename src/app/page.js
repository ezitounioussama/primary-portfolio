import ExperienceTimeline from "@/components/experience/timeline";
import ParallaxHero from "@/components/hero/parallax-hero";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import TechStack from "@/components/sections/tech-stack";
import Curve from "@/components/transitions/curve";
import { PROFILE, SITE_URL, STACK } from "@/lib/data";

// Structured data: helps Google + AI crawlers understand who/what this is.
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: PROFILE.name,
            alternateName: PROFILE.alternateNames,
            jobTitle: PROFILE.role,
            description: PROFILE.summary,
            // Bare address string per schema.org (no mailto: prefix).
            email: PROFILE.email,
            url: SITE_URL,
            image: {
                "@type": "ImageObject",
                url: `${SITE_URL}/opengraph-image`,
                width: 1200,
                height: 630,
                encodingFormat: "image/png",
            },
            address: {
                "@type": "PostalAddress",
                addressLocality: "Rabat",
                addressCountry: "MA",
            },
            nationality: {
                "@type": "Country",
                name: "Morocco",
                identifier: "MA",
            },
            sameAs: [
                PROFILE.github,
                PROFILE.linkedin,
                PROFILE.devto,
                PROFILE.twitter,
                PROFILE.site,
            ],
            knowsAbout: STACK,
            worksFor: {
                "@type": "Organization",
                name: "Intelcia Tech",
                url: "https://www.intelcia.com",
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "Rabat",
                    addressCountry: "MA",
                },
            },
            alumniOf: [
                {
                    "@type": "CollegeOrUniversity",
                    name: "Woolf University",
                    url: "https://woolf.university",
                },
                {
                    "@type": "CollegeOrUniversity",
                    name: "Université Mohammed V",
                    url: "https://www.um5.ac.ma",
                    address: {
                        "@type": "PostalAddress",
                        addressLocality: "Rabat",
                        addressCountry: "MA",
                    },
                },
            ],
            // Kept in structured data only (not shown in the page UI).
            affiliation: {
                "@type": "Organization",
                name: "GoToDev",
                url: PROFILE.site,
            },
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
            datePublished: "2026-07-04",
            dateModified: "2026-07-17",
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
            <Curve label="Stack" />
            <TechStack />
            <Curve label="Contact" />
            <Contact />
        </main>
    );
}
