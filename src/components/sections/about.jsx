"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gauge, GraduationCap, Layers } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { ABOUT, PROFILE } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const VALUE_ICONS = { layers: Layers, gauge: Gauge, graduation: GraduationCap };

const IRIDESCENT =
    "conic-gradient(from 0deg, #ff5f9e, #a78bfa, #38bdf8, #34d399, #fbbf24, #fb7185, #ff5f9e)";

/**
 * About — Sean Halpin-style personal intro, in this site's holographic
 * language, with the 3D as a feature:
 *
 * - Portrait is a holographic trading card: 3D tilt toward the cursor
 *   (quickTo rotationX/Y under perspective), a glare sweep that follows the
 *   pointer, an iridescent ring, and orbit chips floating at different
 *   parallax depths around it.
 * - Headline words reveal on scroll (scrub); inline highlights carry accents.
 * - Stats count up once when scrolled into view.
 * - Value cards tilt individually on hover.
 * All motion honors prefers-reduced-motion.
 */
export default function About() {
    const rootRef = useRef(null);
    const cardRef = useRef(null);
    const glareRef = useRef(null);

    useGSAP(
        (_ctx, contextSafe) => {
            const reduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            // Word-by-word reveal of the bio (scrubbed). Dim state is opacity
            // 0 (not 0.1x): axe skips non-rendered text, so the pre-reveal
            // state can't fail color-contrast; screen readers still read it.
            gsap.from(".about-word", {
                opacity: 0,
                stagger: 0.04,
                ease: "none",
                scrollTrigger: {
                    trigger: ".about-bio",
                    start: "top 80%",
                    end: "top 35%",
                    scrub: true,
                },
            });

            // Greeting + intro rise in.
            gsap.from(".about-rise", {
                y: 50,
                opacity: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
            });

            // Stats count up once. The SSR DOM carries the REAL values (so
            // crawlers/no-JS readers never see zeros); the tween rewinds from
            // 0 back to the target purely as progressive enhancement.
            const counters = gsap.utils.toArray(
                ".about-count",
                rootRef.current,
            );
            if (!reduced) {
                for (const el of counters) {
                    const target = Number(el.dataset.value) || 0;
                    const state = { n: target };
                    gsap.from(state, {
                        n: 0,
                        duration: 1.6,
                        ease: "power2.out",
                        snap: { n: 1 },
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            once: true,
                        },
                        onUpdate: () => {
                            el.textContent = `${Math.round(state.n)}${el.dataset.suffix || ""}`;
                        },
                    });
                }
            }

            if (reduced) return;

            // Orbit chips idle-float at their own pace.
            for (const chip of gsap.utils.toArray(
                ".orbit-chip",
                rootRef.current,
            )) {
                gsap.to(chip, {
                    y: gsap.utils.random(-10, -18),
                    duration: gsap.utils.random(2.4, 3.8),
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: gsap.utils.random(0, 1.5),
                });
            }

            // Holographic card: tilt + glare + orbit parallax.
            const card = cardRef.current;
            const rotX = gsap.quickTo(card, "rotationX", {
                duration: 0.7,
                ease: "power3.out",
            });
            const rotY = gsap.quickTo(card, "rotationY", {
                duration: 0.7,
                ease: "power3.out",
            });
            const glareX = gsap.quickTo(glareRef.current, "xPercent", {
                duration: 0.7,
                ease: "power3.out",
            });
            const glareY = gsap.quickTo(glareRef.current, "yPercent", {
                duration: 0.7,
                ease: "power3.out",
            });
            const orbitSetters = gsap.utils
                .toArray(".orbit-depth", rootRef.current)
                .map((el) => ({
                    depth: Number(el.dataset.depth) || 20,
                    xTo: gsap.quickTo(el, "x", {
                        duration: 0.8,
                        ease: "power3.out",
                    }),
                }));

            const zone = card.parentElement; // hover zone = card wrapper
            const onMove = contextSafe((e) => {
                const rect = zone.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width - 0.5;
                const ny = (e.clientY - rect.top) / rect.height - 0.5;
                rotY(nx * 14);
                rotX(-ny * 14);
                glareX(nx * 60);
                glareY(ny * 60);
                for (const { xTo, depth } of orbitSetters) xTo(-nx * depth);
            });
            const onLeave = contextSafe(() => {
                rotX(0);
                rotY(0);
                glareX(0);
                glareY(0);
                for (const { xTo } of orbitSetters) xTo(0);
            });
            zone.addEventListener("pointermove", onMove);
            zone.addEventListener("pointerleave", onLeave);

            // Value cards: individual tilt on hover.
            const cardCleanups = gsap.utils
                .toArray(".value-card", rootRef.current)
                .map((el) => {
                    const vRotX = gsap.quickTo(el, "rotationX", {
                        duration: 0.5,
                        ease: "power3.out",
                    });
                    const vRotY = gsap.quickTo(el, "rotationY", {
                        duration: 0.5,
                        ease: "power3.out",
                    });
                    const move = contextSafe((e) => {
                        const r = el.getBoundingClientRect();
                        vRotY(((e.clientX - r.left) / r.width - 0.5) * 10);
                        vRotX(-((e.clientY - r.top) / r.height - 0.5) * 10);
                    });
                    const leave = contextSafe(() => {
                        vRotX(0);
                        vRotY(0);
                    });
                    el.addEventListener("pointermove", move);
                    el.addEventListener("pointerleave", leave);
                    return () => {
                        el.removeEventListener("pointermove", move);
                        el.removeEventListener("pointerleave", leave);
                    };
                });

            return () => {
                zone.removeEventListener("pointermove", onMove);
                zone.removeEventListener("pointerleave", onLeave);
                for (const clean of cardCleanups) clean();
            };
        },
        { scope: rootRef },
    );

    const bioWords = ABOUT.bio
        .split(" ")
        .map((word, i) => ({ word, key: `${i}-${word}` }));

    return (
        <section
            id="about"
            ref={rootRef}
            className="relative mx-auto max-w-6xl px-6 py-28 md:py-40"
        >
            <div className="grid items-center gap-16 md:grid-cols-[1.2fr_1fr]">
                {/* Text column */}
                <div>
                    <p className="about-rise mb-6 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
                        About
                    </p>
                    <h2 className="about-rise text-5xl font-semibold tracking-tight md:text-7xl">
                        {ABOUT.greeting}
                    </h2>
                    <p className="about-rise mt-6 max-w-xl text-balance text-2xl font-medium leading-snug tracking-tight md:text-3xl">
                        A{" "}
                        <span className="font-serif italic text-accent-4">
                            senior full-stack engineer
                        </span>{" "}
                        at{" "}
                        <span className="underline decoration-accent-2 decoration-2 underline-offset-4">
                            Intelcia Tech
                        </span>
                        .
                    </p>

                    <p className="about-bio mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        {bioWords.map(({ word, key }) => (
                            <span key={key} className="about-word inline-block">
                                {word}&nbsp;
                            </span>
                        ))}
                    </p>

                    <div className="about-rise mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-muted-foreground">
                        <span className="relative mr-1 flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-3 opacity-60" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-3" />
                        </span>
                        <span className="whitespace-nowrap">
                            {ABOUT.availability} ·
                        </span>
                        <a
                            href={`mailto:${PROFILE.email}`}
                            className="inline-block py-1 text-foreground underline underline-offset-4 hover:text-accent-3"
                        >
                            {PROFILE.email}
                        </a>
                    </div>

                    {/* Verifiable proof + CV (crawlable external corroboration) */}
                    <div className="about-rise mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
                        <a
                            href="/cv.pdf"
                            download="Oussama-Ezitouni-CV.pdf"
                            className="inline-block rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-foreground transition-colors hover:border-accent-4 hover:text-accent-4"
                        >
                            Download CV ↓
                        </a>
                        <a
                            href={PROFILE.devto}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block py-1 underline underline-offset-4 transition-colors hover:text-foreground"
                        >
                            Writing on DEV.to
                        </a>
                        <a
                            href={PROFILE.npmPackage}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block py-1 underline underline-offset-4 transition-colors hover:text-foreground"
                        >
                            gotodev on npm
                        </a>
                    </div>
                </div>

                {/* Holographic portrait card (px keeps orbit chips inside the viewport) */}
                <div className="mx-auto px-10 [perspective:900px]">
                    <div
                        ref={cardRef}
                        className="relative w-fit [transform-style:preserve-3d]"
                    >
                        {/* Iridescent halo */}
                        <div
                            aria-hidden="true"
                            className="absolute -inset-6 rounded-[2.5rem] opacity-50 blur-2xl"
                            style={{ background: IRIDESCENT }}
                        />
                        {/* Ring + photo */}
                        <div
                            className="relative rounded-[2rem] p-[3px]"
                            style={{ background: IRIDESCENT }}
                        >
                            <div className="relative overflow-hidden rounded-[calc(2rem-3px)] bg-background">
                                <Image
                                    src="/portrait.png"
                                    alt={`Portrait of ${PROFILE.name}`}
                                    width={288}
                                    height={288}
                                    className="h-64 w-64 object-cover sm:h-72 sm:w-72"
                                    priority={false}
                                />
                                {/* Glare sweep (follows pointer) */}
                                <div
                                    ref={glareRef}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-[-40%] bg-[radial-gradient(40%_40%_at_50%_50%,rgba(255,255,255,0.35),transparent_70%)] mix-blend-overlay"
                                />
                            </div>
                        </div>

                        {/* Orbit chips at parallax depths */}
                        {ABOUT.orbit.map((chip, i) => (
                            <div
                                key={chip.label}
                                className={[
                                    "orbit-chip absolute",
                                    // corner positions around the card
                                    i === 0 && "-left-10 top-6",
                                    i === 1 && "-right-8 top-16",
                                    i === 2 && "-left-6 bottom-14",
                                    i === 3 && "-right-10 bottom-6",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                style={{ transform: "translateZ(40px)" }}
                            >
                                <span
                                    className="orbit-depth inline-block rounded-full border border-border bg-background/80 px-3 py-1.5 font-mono text-[11px] text-foreground shadow-lg backdrop-blur-md"
                                    data-depth={chip.depth}
                                >
                                    {chip.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <dl className="mt-20 grid grid-cols-2 gap-6 border-y border-border py-10 md:grid-cols-4">
                {ABOUT.stats.map((s) => (
                    <div key={s.label} className="text-center">
                        {/* SSR the real value — crawlers/no-JS must never see zeros */}
                        <dd
                            className="about-count text-4xl font-semibold tracking-tight md:text-5xl"
                            data-value={s.value}
                            data-suffix={s.suffix}
                        >
                            {s.value}
                            {s.suffix}
                        </dd>
                        <dt className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {s.label}
                        </dt>
                    </div>
                ))}
            </dl>

            {/* Values */}
            <div className="mt-16 grid gap-6 md:grid-cols-3 [perspective:1000px]">
                {ABOUT.values.map((v) => {
                    const Icon = VALUE_ICONS[v.icon] ?? Layers;
                    return (
                        <article
                            key={v.title}
                            className="value-card rounded-2xl border border-border bg-foreground/5 p-7 backdrop-blur-sm [transform-style:preserve-3d]"
                        >
                            <div
                                className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-background"
                                style={{ background: IRIDESCENT }}
                            >
                                <Icon className="h-5 w-5" strokeWidth={2} />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">
                                {v.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {v.body}
                            </p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
