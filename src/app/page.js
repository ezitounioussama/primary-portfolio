import ExperienceTimeline from "@/components/experience/timeline";
import ParallaxHero from "@/components/hero/parallax-hero";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Curve from "@/components/transitions/curve";

export default function Home() {
    return (
        <main>
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
