"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { TIMELINE } from "@/lib/data";

// Three.js is heavy and the globe is below the fold — load it after
// hydration so it never taxes first paint / TBT on mobile.
const ParticleGlobe = dynamic(
    () => import("@/components/three/particle-globe"),
    { ssr: false },
);

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Ghost numeral behind each panel: item.ghost override, else the year,
// else the first 3 letters ("Education" → "EDU").
function ghostLabel(item) {
    if (item.ghost) return item.ghost;
    const year = /^\d{4}/.exec(item.period)?.[0];
    return year ?? item.period.slice(0, 3).toUpperCase();
}

/**
 * Experience — pinned horizontal journey (Dribbble "Timeline Design" carousel
 * idea, pushed further):
 *
 * - The section pins; vertical scroll drags the track horizontally
 *   (ease "none" on the container tween — required for containerAnimation),
 *   and each era snaps into place.
 * - Multi-speed parallax: ghost year numerals drift faster than their cards
 *   (fromTo x, scrubbed via containerAnimation) while the particle globe
 *   sweeps on its own slower schedule behind everything.
 * - A dotted rail fills with a gradient as you advance; a comet rides the
 *   fill tip; year nodes + cards light up via the focus lens
 *   (containerAnimation triggers toggling `is-active`; the dimmer is a
 *   dedicated inner node so it never fights GSAP inline styles).
 * - prefers-reduced-motion: no pin, no tweens — the track becomes a native
 *   horizontally scrollable row (motion-reduce utilities restore full
 *   opacity/fill).
 */
export default function ExperienceTimeline() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const fillRef = useRef(null);

    useGSAP(
        () => {
            const reduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;
            if (reduced) return; // CSS fallback: native horizontal scroll

            const track = trackRef.current;
            const distance = () =>
                Math.max(0, track.scrollWidth - window.innerWidth);

            // Container tween: vertical scroll → horizontal travel. Pin the
            // section, animate the inner track (never the pinned element).
            const scrollTween = gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${distance()}`,
                    snap: {
                        snapTo: 1 / (TIMELINE.length - 1),
                        duration: 0.45,
                        delay: 0.05,
                        ease: "power1.inOut",
                        // Nearest, not directional: tiny scrolls must not
                        // auto-advance a whole panel (feels like hijacking).
                        directional: false,
                    },
                    invalidateOnRefresh: true,
                },
            });

            // Progress rail fill (same scroll range, scrubbed).
            gsap.fromTo(
                fillRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: () => `+=${distance()}`,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                },
            );

            for (const panel of gsap.utils.toArray(".tl-panel", track)) {
                // Card entrance as the panel rides in from the right.
                gsap.from(panel.querySelector(".tl-card"), {
                    y: 70,
                    opacity: 0,
                    filter: "blur(8px)",
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        containerAnimation: scrollTween,
                        trigger: panel,
                        start: "left 88%",
                        once: true,
                    },
                });

                // Ghost numeral parallax: drifts opposite/faster than cards.
                gsap.fromTo(
                    panel.querySelector(".tl-ghost"),
                    { x: 110, rotationY: 32, transformPerspective: 700 },
                    {
                        x: -110,
                        rotationY: -32,
                        ease: "none",
                        scrollTrigger: {
                            containerAnimation: scrollTween,
                            trigger: panel,
                            start: "left right",
                            end: "right left",
                            scrub: true,
                        },
                    },
                );

                // Focus lens: bright while crossing the center zone.
                ScrollTrigger.create({
                    containerAnimation: scrollTween,
                    trigger: panel,
                    start: "left 65%",
                    end: "right 35%",
                    toggleClass: { targets: panel, className: "is-active" },
                });
            }
        },
        { scope: sectionRef },
    );

    return (
        <section id="experience" ref={sectionRef} className="relative w-full">
            {/* Dotted 3D particle planet — deep background layer */}
            <ParticleGlobe triggerRef={sectionRef} />

            {/* Legibility veil between planet and content */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(90%_70%_at_40%_50%,var(--background)_0%,transparent_72%)] opacity-45 dark:opacity-30"
            />

            {/* Pinned stage */}
            <div className="relative z-10 flex h-screen flex-col overflow-hidden">
                <header className="mx-auto w-full max-w-6xl flex-none px-6 pt-12 pb-3 md:px-10 md:pt-20 md:pb-6">
                    <h2 className="text-3xl font-semibold tracking-tight md:text-6xl">
                        The journey so far
                    </h2>
                    <p className="mt-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Scroll to travel
                        <span aria-hidden="true" className="inline-block">
                            ⟶
                        </span>
                    </p>
                </header>

                {/* Track centered in the remaining height (header never clips) */}
                <div className="flex min-h-0 flex-1 items-center motion-reduce:overflow-x-auto">
                    <div ref={trackRef} className="relative w-max">
                        {/* Rail: dotted base + gradient fill + comet tip */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-0 top-9 border-t-2 border-dashed border-border"
                        />
                        <div
                            ref={fillRef}
                            aria-hidden="true"
                            className="absolute left-0 top-9 h-[2px] w-full origin-left -translate-y-px scale-x-0 bg-gradient-to-r from-accent-5 via-accent-4 to-accent-3 shadow-[0_0_16px_-2px_var(--accent-4)] motion-reduce:scale-x-100"
                        >
                            <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-4 shadow-[0_0_14px_3px_var(--accent-4)]" />
                        </div>

                        <div className="flex gap-10 px-[8vw] md:gap-20 md:px-[16vw]">
                            {TIMELINE.map((item) => (
                                <article
                                    key={`${item.period}-${item.role}`}
                                    className="tl-panel group relative w-[82vw] max-w-xl shrink-0 pt-14 sm:w-[70vw] md:w-[34rem] md:pt-24"
                                >
                                    {/* Ghost numeral (parallax layer) */}
                                    <span
                                        aria-hidden="true"
                                        className="tl-ghost pointer-events-none absolute -top-8 left-0 select-none font-mono text-[4.5rem] font-bold leading-none tracking-tighter text-foreground opacity-[0.06] transition-opacity duration-500 md:text-[9rem] group-[.is-active]:opacity-[0.12]"
                                    >
                                        {ghostLabel(item)}
                                    </span>

                                    {/* Node on the rail */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-9 flex h-8 w-8 -translate-x-1 -translate-y-1/2 items-center justify-center rounded-full bg-background"
                                    >
                                        <span className="h-3 w-3 rounded-full border border-border bg-muted transition-all duration-500 group-[.is-active]:scale-125 group-[.is-active]:border-accent-4 group-[.is-active]:bg-accent-4 group-[.is-active]:shadow-[0_0_14px_var(--accent-4)]" />
                                    </span>

                                    {/* Period tag near the node */}
                                    <p className="absolute left-8 top-9 -translate-y-1/2 font-mono text-sm font-bold text-muted-foreground transition-colors duration-500 group-[.is-active]:text-foreground md:text-base">
                                        {item.period}
                                    </p>

                                    {/* Glass card */}
                                    <div className="tl-card rounded-2xl border border-border bg-background/50 p-4 backdrop-blur-md transition-[border-color,box-shadow] duration-500 md:p-8 group-[.is-active]:border-accent-4/40 group-[.is-active]:shadow-[0_0_48px_-20px_var(--accent-4)]">
                                        {/* Focus-lens dimmer (CSS-only, separate from GSAP) */}
                                        <div className="opacity-50 transition-opacity duration-500 group-[.is-active]:opacity-100 motion-reduce:opacity-100">
                                            <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                                                {item.role}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {item.org}
                                            </p>
                                            <ul className="mt-4 space-y-2 md:mt-5 md:space-y-2.5">
                                                {item.points.map((point) => (
                                                    <li
                                                        key={point}
                                                        className="flex gap-2.5 text-[13px] leading-snug text-muted-foreground md:gap-3 md:text-sm md:leading-relaxed"
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-4"
                                                        />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {item.links ? (
                                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                                                    {item.links.map((l) => (
                                                        <a
                                                            key={l.href}
                                                            href={l.href}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="font-mono text-[11px] text-accent-4 underline underline-offset-4 transition-colors hover:text-foreground"
                                                        >
                                                            {l.label} ↗
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : null}
                                            {item.tags ? (
                                                <div className="mt-4 flex flex-wrap gap-1.5 md:mt-5 md:gap-2">
                                                    {item.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-border bg-foreground/5 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground md:px-3 md:py-1 md:text-[11px]"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
