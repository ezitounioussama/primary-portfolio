"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import ParticleGlobe from "@/components/three/particle-globe";
import { TIMELINE } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Experience timeline — Aceternity "Timeline" DNA, reworked to respond
 * continuously to scroll:
 *
 * - Gradient beam grows with a scrub; a glowing comet rides its tip.
 * - Each entry reveals individually as it arrives (blur → sharp card,
 *   bullets stagger in) instead of everything at once.
 * - Focus lens: the entry in the reading zone is full-strength (bright node,
 *   glowing card border, brightened period label); the rest sit dimmed.
 *   Dimming lives on a dedicated inner node (CSS transition via
 *   group-[.is-active]) so it never fights GSAP's inline entrance styles.
 * - Sticky period labels; ARKON particle planet behind everything.
 */
export default function ExperienceTimeline() {
    const containerRef = useRef(null);
    const entriesRef = useRef(null);
    const beamRef = useRef(null);

    useGSAP(
        () => {
            // Beam fill, scrubbed across the section (Aceternity's
            // useScroll ["start 10%", "end 50%"] equivalent).
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

            for (const entry of gsap.utils.toArray(
                ".timeline-entry",
                entriesRef.current,
            )) {
                // Card reveals as *this* entry arrives: rise + blur → sharp.
                gsap.from(entry.querySelector(".timeline-card"), {
                    y: 64,
                    opacity: 0,
                    filter: "blur(10px)",
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: entry,
                        start: "top 80%",
                        once: true,
                    },
                });

                // Bullets + tags cascade in just after the card.
                gsap.from(entry.querySelectorAll("li, .timeline-tag"), {
                    x: 28,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: entry,
                        start: "top 70%",
                        once: true,
                    },
                });

                // Focus lens: generous zone so one entry is almost always lit.
                ScrollTrigger.create({
                    trigger: entry,
                    start: "top 60%",
                    end: "bottom 25%",
                    toggleClass: { targets: entry, className: "is-active" },
                });
            }
        },
        { scope: containerRef },
    );

    return (
        <section id="experience" ref={containerRef} className="relative w-full">
            {/* Dotted 3D particle planet — sweeps in from the hero, rotates with scroll */}
            <ParticleGlobe triggerRef={containerRef} />

            {/* Legibility veil: softens particles behind the reading column */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(90%_70%_at_35%_45%,var(--background)_0%,transparent_70%)] opacity-45 dark:opacity-30"
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
                <header className="py-16 md:py-24">
                    <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                        The journey so far
                    </h2>
                    <p className="mt-4 max-w-md text-muted-foreground">
                        A timeline of the roles, teams, and products I&apos;ve
                        built and led.
                    </p>
                </header>

                <div ref={entriesRef} className="relative pb-16">
                    {TIMELINE.map((item) => (
                        <div
                            key={`${item.period}-${item.role}`}
                            className="timeline-entry group flex justify-start pt-10 md:gap-10 md:pt-24"
                        >
                            {/* Sticky period label + node */}
                            <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
                                <div className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-background md:left-2">
                                    <div className="h-3 w-3 rounded-full border border-border bg-muted transition-all duration-500 group-[.is-active]:scale-125 group-[.is-active]:border-accent-4 group-[.is-active]:bg-accent-4 group-[.is-active]:shadow-[0_0_14px_var(--accent-4)]" />
                                </div>
                                <p className="hidden origin-left font-mono text-xl font-bold text-muted-foreground transition-all duration-500 md:block md:pl-16 md:text-4xl group-[.is-active]:scale-105 group-[.is-active]:text-foreground">
                                    {item.period}
                                </p>
                            </div>

                            {/* Glass card (GSAP animates this node's entrance) */}
                            <div className="relative w-full pl-16 pr-2 md:pl-4">
                                <div className="timeline-card rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-500 md:p-8 group-[.is-active]:border-accent-4/40 group-[.is-active]:shadow-[0_0_48px_-20px_var(--accent-4)]">
                                    {/* Focus-lens dimmer (CSS-only, separate from GSAP) */}
                                    <div className="opacity-50 transition-opacity duration-500 group-[.is-active]:opacity-100">
                                        <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:hidden">
                                            {item.period}
                                        </p>
                                        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                                            {item.role}
                                        </h3>
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
                                        {item.tags ? (
                                            <div className="mt-6 flex flex-wrap gap-2">
                                                {item.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="timeline-tag rounded-full border border-border bg-foreground/5 px-3 py-1 font-mono text-[11px] text-muted-foreground"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Beam track (static gradient, masked) + animated fill + comet tip */}
                    <div className="absolute left-7 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-border to-transparent [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                        <div
                            ref={beamRef}
                            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-accent-5 via-accent-4 to-transparent shadow-[0_0_16px_-2px_var(--accent-4)]"
                        >
                            {/* Comet riding the beam tip */}
                            <span
                                aria-hidden="true"
                                className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent-4 shadow-[0_0_14px_3px_var(--accent-4)]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
