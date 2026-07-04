"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { PROFILE, STACK } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            // Parallax: the big statement drifts up slower than the scroll.
            gsap.to(".about-parallax", {
                yPercent: -18,
                ease: "none",
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // Word-by-word reveal of the statement.
            gsap.from(".about-word", {
                opacity: 0.12,
                stagger: 0.04,
                ease: "none",
                scrollTrigger: {
                    trigger: ".about-statement",
                    start: "top 80%",
                    end: "top 35%",
                    scrub: true,
                },
            });

            gsap.from(".stack-chip", {
                y: 20,
                opacity: 0,
                stagger: 0.06,
                ease: "power3.out",
                scrollTrigger: { trigger: ".stack", start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    const statement = PROFILE.summary;
    // Precompute stable keys (word + position) so duplicate words stay unique.
    const words = statement
        .split(" ")
        .map((word, i) => ({ word, key: `${i}-${word}` }));

    return (
        <section
            id="about"
            ref={rootRef}
            className="relative mx-auto max-w-6xl px-6 py-28 md:py-40"
        >
            <p className="about-parallax mb-8 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
                About
            </p>
            <p className="about-statement max-w-4xl text-balance text-3xl font-medium leading-tight tracking-tight md:text-5xl md:leading-[1.1]">
                {words.map(({ word, key }) => (
                    <span key={key} className="about-word inline-block">
                        {word}&nbsp;
                    </span>
                ))}
            </p>

            <div className="stack mt-14 flex flex-wrap gap-3">
                {STACK.map((s) => (
                    <span
                        key={s}
                        className="stack-chip rounded-full border border-border bg-foreground/5 px-4 py-2 font-mono text-xs text-muted-foreground"
                    >
                        {s}
                    </span>
                ))}
            </div>
        </section>
    );
}
