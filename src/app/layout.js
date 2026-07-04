import { Geist, Geist_Mono } from "next/font/google";
import FloatingDock from "@/components/nav/floating-dock";
import SmoothScroll from "@/components/smooth-scroll";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Oussama Ezitouni — Fullstack Engineer",
    description:
        "Fullstack engineer building fast, expressive web experiences with Next.js and GSAP.",
};

// Runs before paint: applies the saved theme (or system preference) by toggling
// the `.dark` class, so there's no light/dark flash on load. Matches the
// AnimatedThemeToggler contract (localStorage "theme" + `.dark` on <html>).
const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.classList.toggle("dark", t === "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            style={{ "--font-sans": "var(--font-geist-sans)" }}
        >
            <body className="min-h-full">
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, no user input — blocking theme script to prevent FOUC */}
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
                <SmoothScroll>{children}</SmoothScroll>
                <FloatingDock />
                <AnimatedThemeToggler
                    variant="circle"
                    aria-label="Toggle color theme"
                    className="fixed right-6 top-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 text-foreground shadow-lg backdrop-blur-xl transition-colors hover:bg-foreground/10 [&>svg]:h-5 [&>svg]:w-5"
                />
            </body>
        </html>
    );
}
