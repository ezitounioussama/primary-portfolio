"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { TIMELINE } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Experience timeline — Aceternity "Timeline", ported to GSAP.
 *
 * Aceternity drives a gradient beam with Framer Motion's useScroll/useTransform
 * (offset ["start 10%", "end 50%"]). Here a ScrollTrigger scrub grows the beam's
 * height from 0 to the entries' height across the equivalent range
 * (start "top 10%" → end "bottom 50%"). Sticky period labels on the left, content
 * on the right — same structure as the original.
 */
export default function ExperienceTimeline() {
    const containerRef = useRef(null);
    const entriesRef = useRef(null);
    const beamRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                beamRef.current,
                { height: 0, autoAlpha: 0 },
                {
                    height: () => entriesRef.current.offsetHeight,
                    autoAlpha: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 10%",
                        end: "bottom 50%",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                },
            );

            // Fade each entry in as it enters.
            gsap.from(".timeline-entry", {
                opacity: 0,
                y: 40,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: entriesRef.current,
                    start: "top 75%",
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <section
            id="experience"
            ref={containerRef}
            className="mx-auto w-full max-w-6xl px-6 md:px-10"
        >
            <header className="py-16 md:py-24">
                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                    The journey so far
                </h2>
                <p className="mt-4 max-w-md text-muted-foreground">
                    A timeline of the roles, teams, and products I&apos;ve built
                    and led.
                </p>
            </header>

            <div ref={entriesRef} className="relative pb-16">
                {TIMELINE.map((item) => (
                    <div
                        key={`${item.period}-${item.role}`}
                        className="timeline-entry flex justify-start pt-10 md:gap-10 md:pt-32"
                    >
                        {/* Sticky period label + node */}
                        <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
                            <div className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-background md:left-2">
                                <div className="h-3 w-3 rounded-full border border-border bg-muted" />
                            </div>
                            <h3 className="hidden font-mono text-xl font-bold text-muted-foreground md:block md:pl-16 md:text-4xl">
                                {item.period}
                            </h3>
                        </div>

                        {/* Content */}
                        <div className="relative w-full pl-16 pr-2 md:pl-4">
                            <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:hidden">
                                {item.period}
                            </p>
                            <h4 className="text-xl font-semibold tracking-tight md:text-2xl">
                                {item.role}
                            </h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {item.org}
                            </p>
                            <ul className="mt-5 space-y-3">
                                {item.points.map((point) => (
                                    <li
                                        key={point}
                                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground md:text-base"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-4"
                                        />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}

                {/* Beam track (static gradient, masked) + animated fill */}
                <div className="absolute left-7 top-0 h-full w-px overflow-hidden bg-gradient-to-b from-transparent via-border to-transparent [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                    <div
                        ref={beamRef}
                        className="absolute inset-x-0 top-0 w-px rounded-full bg-gradient-to-t from-accent-5 via-accent-4 to-transparent"
                    />
                </div>
            </div>
        </section>
    );
}
