import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import FloatingDock from "@/components/nav/floating-dock";
import SmoothScroll from "@/components/smooth-scroll";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { PROFILE, SITE_URL } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    // 'optional': never swap late — a late font repaint of the hero H1
    // re-records LCP seconds later on slow networks.
    display: "optional",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "optional",
    // Small-text font — keep it out of the critical preload graph.
    preload: false,
});

const instrumentSerif = Instrument_Serif({
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-instrument",
    subsets: ["latin"],
    display: "optional",
    preload: false,
});

const TITLE = `${PROFILE.name} — ${PROFILE.role}`;
const DESCRIPTION = PROFILE.shortSummary; // ≤160 chars for SERP snippets

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: TITLE,
        template: `%s — ${PROFILE.name}`,
    },
    description: DESCRIPTION,
    applicationName: `${PROFILE.name} — Portfolio`,
    authors: [{ name: PROFILE.name, url: SITE_URL }],
    creator: PROFILE.name,
    publisher: PROFILE.name,
    category: "technology",
    keywords: [
        "Oussama Ezitouni",
        ...PROFILE.alternateNames,
        "Senior Full-Stack Engineer",
        "Full-Stack Developer Morocco",
        "React developer",
        "Next.js developer",
        "Node.js",
        "NestJS",
        "PHP",
        "Symfony",
        "Laravel",
        "DevOps engineer",
        "Docker",
        "Kubernetes",
        "GSAP",
        "Rabat",
        "Kenitra",
        "GoToDev",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: SITE_URL,
        siteName: PROFILE.name,
        title: TITLE,
        description: DESCRIPTION,
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        creator: "@ezitounioussama",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
};

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    ],
    colorScheme: "dark light",
};

// Runs before paint: applies the saved theme (or system preference) by toggling
// the `.dark` class, so there's no light/dark flash on load. Matches the
// AnimatedThemeToggler contract (localStorage "theme" + `.dark` on <html>).
const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem("theme");
    // Dark-first design: default to dark unless the visitor explicitly chose light.
    document.documentElement.classList.toggle("dark", t !== "light");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
            style={{ "--font-sans": "var(--font-geist-sans)" }}
        >
            <body className="min-h-full">
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, no user input — blocking theme script to prevent FOUC */}
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
                <SmoothScroll>{children}</SmoothScroll>
                <FloatingDock />
                {/* Accessible name comes from the component's own sr-only text */}
                <AnimatedThemeToggler
                    variant="circle"
                    className="fixed right-6 top-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 text-foreground shadow-lg backdrop-blur-xl transition-colors hover:bg-foreground/10 [&>svg]:h-5 [&>svg]:w-5"
                />
                <Analytics />
            </body>
        </html>
    );
}
