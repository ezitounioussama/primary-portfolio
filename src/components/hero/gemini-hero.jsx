"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Five ribbons that share a converging region — the "gemini" mechanism.
// pathLength="1" (set on each <path>) makes the draw resolution-independent:
// strokeDashoffset goes 1 → 0 to draw, regardless of the real path length.
const PATHS = [
    {
        d: "M0 250 C 380 250 460 120 720 120 S 1060 250 1440 250",
        color: "var(--accent-1)",
    },
    {
        d: "M0 320 C 380 320 460 240 720 240 S 1060 320 1440 320",
        color: "var(--accent-2)",
    },
    {
        d: "M0 390 C 380 390 460 390 720 390 S 1060 390 1440 390",
        color: "var(--accent-3)",
    },
    {
        d: "M0 460 C 380 460 460 540 720 540 S 1060 460 1440 460",
        color: "var(--accent-4)",
    },
    {
        d: "M0 530 C 380 530 460 660 720 660 S 1060 530 1440 530",
        color: "var(--accent-5)",
    },
];

export default function GeminiHero() {
    const sectionRef = useRef(null);
    const pinRef = useRef(null);
    const titleRef = useRef(null);
    const svgRef = useRef(null);

    useGSAP(
        () => {
            const paths = svgRef.current.querySelectorAll("path[data-ribbon]");
            gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=1800",
                    scrub: 1,
                    pin: pinRef.current,
                    anticipatePin: 1,
                },
            });

            // Draw the ribbons as you scroll through the pinned range.
            tl.to(
                paths,
                { strokeDashoffset: 0, stagger: 0.06, ease: "none" },
                0,
            );

            // Title recedes / fades as the ribbons take over (parallax feel).
            tl.to(
                titleRef.current,
                {
                    yPercent: -30,
                    opacity: 0.12,
                    filter: "blur(4px)",
                    ease: "none",
                },
                0,
            );

            // Intro on load.
            gsap.from(titleRef.current.children, {
                yPercent: 120,
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                ease: "power4.out",
            });
        },
        { scope: sectionRef },
    );

    return (
        <section id="home" ref={sectionRef} className="relative h-[280vh]">
            <div
                ref={pinRef}
                className="relative flex h-screen w-full items-center justify-center overflow-hidden"
            >
                {/* Ribbons */}
                <svg
                    ref={svgRef}
                    viewBox="0 0 1440 780"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                >
                    {PATHS.map((p) => (
                        <path
                            key={p.d}
                            data-ribbon
                            d={p.d}
                            pathLength="1"
                            stroke={p.color}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{
                                filter: `drop-shadow(0 0 12px ${p.color})`,
                            }}
                        />
                    ))}
                </svg>

                {/* Title */}
                <div
                    ref={titleRef}
                    className="relative z-10 px-6 text-center will-change-transform"
                >
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
                        Oussama Ezitouni — Senior Full-Stack Engineer
                    </p>
                    <h1 className="mx-auto max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
                        Architecting
                        <br />
                        scalable web
                        <br />
                        platforms
                    </h1>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    scroll
                </div>
            </div>
        </section>
    );
}
