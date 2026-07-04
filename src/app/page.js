import ExperienceTimeline from "@/components/experience/timeline";
import GeminiHero from "@/components/hero/gemini-hero";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Curve from "@/components/transitions/curve";

export default function Home() {
    return (
        <main>
            <GeminiHero />
            <Curve label="Experience" />
            <ExperienceTimeline />
            <Curve label="About" />
            <About />
            <Curve label="Contact" />
            <Contact />
        </main>
    );
}
