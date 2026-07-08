"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, PROFILE } from "@/lib/data";

gsap.registerPlugin(useGSAP);

const IRIDESCENT =
    "conic-gradient(from 0deg, #ff5f9e, #a78bfa, #38bdf8, #34d399, #fbbf24, #fb7185, #ff5f9e)";

/**
 * 3D mouse-parallax hero (inspired by the ARKON DIGITAL / awwwards reference).
 *
 * A holographic orb (animated conic-gradient blobs) sits over a reflective
 * ground with editorial corner labels. On pointer move, GSAP quickTo shifts each
 * [data-depth] layer by its depth and tilts the whole scene (rotateX/Y) for a 3D
 * feel. Disabled under prefers-reduced-motion.
 *
 * Note: CSS centering (`-translate-x-1/2`, `-translate-y-1/2`) lives on static
 * wrapper elements; GSAP animates x/y on separate inner [data-depth] nodes so the
 * two transforms never fight.
 */
export default function ParallaxHero() {
    const sectionRef = useRef(null);
    const sceneRef = useRef(null);

    useGSAP(
        (_ctx, contextSafe) => {
            const reduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            // Entrance.
            gsap.from(".hero-rise", {
                yPercent: 120,
                opacity: 0,
                duration: 1.1,
                stagger: 0.08,
                ease: "power4.out",
            });
            gsap.from(".hero-fade", {
                opacity: 0,
                duration: 1.2,
                stagger: 0.06,
                delay: 0.3,
                ease: "power2.out",
            });
            gsap.from(".orb-scale", {
                scale: 0.6,
                opacity: 0,
                duration: 1.4,
                ease: "power3.out",
            });

            if (reduced) return;

            // Endless holographic swirl.
            gsap.to(".orb-swirl-a", {
                rotate: 360,
                duration: 16,
                repeat: -1,
                ease: "none",
            });
            gsap.to(".orb-swirl-b", {
                rotate: -360,
                duration: 24,
                repeat: -1,
                ease: "none",
            });
            // Idle bob.
            gsap.to(".orb-float", {
                yPercent: -5,
                duration: 4,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
            });

            // Per-layer parallax setters.
            const layers = gsap.utils.toArray(
                "[data-depth]",
                sectionRef.current,
            );
            const setters = layers.map((el) => ({
                depth: Number(el.dataset.depth) || 0,
                xTo: gsap.quickTo(el, "x", {
                    duration: 0.9,
                    ease: "power3.out",
                }),
                yTo: gsap.quickTo(el, "y", {
                    duration: 0.9,
                    ease: "power3.out",
                }),
            }));
            const rotX = gsap.quickTo(sceneRef.current, "rotationX", {
                duration: 0.9,
                ease: "power3.out",
            });
            const rotY = gsap.quickTo(sceneRef.current, "rotationY", {
                duration: 0.9,
                ease: "power3.out",
            });

            const onMove = contextSafe((e) => {
                const nx = e.clientX / window.innerWidth - 0.5; // -0.5 .. 0.5
                const ny = e.clientY / window.innerHeight - 0.5;
                for (const { xTo, yTo, depth } of setters) {
                    xTo(-nx * depth);
                    yTo(-ny * depth);
                }
                rotY(nx * 6);
                rotX(-ny * 6);
            });
            const onLeave = contextSafe(() => {
                for (const { xTo, yTo } of setters) {
                    xTo(0);
                    yTo(0);
                }
                rotX(0);
                rotY(0);
            });

            const section = sectionRef.current;
            section.addEventListener("pointermove", onMove);
            section.addEventListener("pointerleave", onLeave);
            return () => {
                section.removeEventListener("pointermove", onMove);
                section.removeEventListener("pointerleave", onLeave);
            };
        },
        { scope: sectionRef },
    );

    return (
        <section
            id="home"
            ref={sectionRef}
            className="relative h-screen w-full overflow-hidden bg-background [perspective:1200px]"
        >
            {/* Ground + vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_40%,color-mix(in_oklch,var(--foreground)_8%,transparent)_100%)]" />

            {/* Parallax scene (gets tilted) */}
            <div
                ref={sceneRef}
                className="absolute inset-0 [transform-style:preserve-3d]"
            >
                {/* Orb */}
                <div className="absolute left-1/2 top-[26%] -translate-x-1/2">
                    <div data-depth="40">
                        <div className="orb-float orb-scale relative h-[46vw] max-h-[520px] min-h-[240px] w-[46vw] min-w-[240px] max-w-[520px]">
                            <div
                                className="absolute inset-0 rounded-full opacity-90 blur-2xl"
                                style={{ background: IRIDESCENT }}
                            />
                            <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_0_120px_-10px_rgba(167,139,250,0.5)]">
                                <div
                                    className="orb-swirl-a absolute inset-[-30%] rounded-full blur-2xl"
                                    style={{ background: IRIDESCENT }}
                                />
                                <div
                                    className="orb-swirl-b absolute inset-[-10%] rounded-full opacity-70 mix-blend-screen blur-3xl"
                                    style={{ background: IRIDESCENT }}
                                />
                                {/* Glossy specular highlight */}
                                <div className="absolute inset-0 rounded-full bg-[radial-gradient(50%_45%_at_35%_28%,rgba(255,255,255,0.85),transparent_60%)]" />
                                {/* Rim shading for sphere volume */}
                                <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-40px_80px_-30px_rgba(0,0,0,0.6),inset_20px_20px_60px_-40px_rgba(255,255,255,0.6)]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reflection on the ground */}
                <div className="absolute left-1/2 top-[72%] -translate-x-1/2">
                    <div data-depth="24" aria-hidden="true">
                        <div
                            className="h-[26vw] max-h-[300px] w-[46vw] min-w-[240px] max-w-[520px] scale-y-[-1] rounded-[50%] opacity-25 blur-2xl"
                            style={{ background: IRIDESCENT }}
                        />
                    </div>
                </div>
            </div>

            {/* Headline (over the orb) */}
            <div className="pointer-events-none absolute inset-0 flex items-center">
                <div data-depth="18" className="px-6 md:px-12">
                    <h1 className="leading-[0.82]">
                        <span className="hero-rise block font-serif text-6xl italic text-foreground sm:text-7xl md:text-8xl">
                            Full-stack
                        </span>
                        <span className="hero-rise block text-6xl font-semibold uppercase tracking-tight text-foreground sm:text-8xl md:text-[9rem]">
                            Engineer.
                        </span>
                    </h1>
                </div>
            </div>

            {/* Top bar */}
            <header className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 p-6 font-mono text-xs md:p-8">
                <div className="hero-fade" data-depth="8">
                    <p className="font-sans text-sm font-semibold uppercase leading-tight tracking-wide">
                        Oussama
                        <br />
                        Ezitouni
                    </p>
                </div>
                <div
                    className="hero-fade hidden text-muted-foreground sm:block"
                    data-depth="6"
                >
                    <p className="mb-1">Available for freelance:</p>
                    <a
                        href={`mailto:${PROFILE.email}`}
                        className="pointer-events-auto text-foreground underline underline-offset-4"
                    >
                        {PROFILE.email}
                    </a>
                    <p className="mt-2 text-foreground/80">
                        React · Next.js · GSAP
                    </p>
                    <p className="text-muted-foreground">
                        Node · Symfony · Laravel
                    </p>
                </div>
                <nav
                    className="hero-fade hidden flex-col items-end gap-1 md:flex"
                    data-depth="6"
                    aria-label="Hero"
                >
                    {NAV_ITEMS.filter((n) => !n.external).map((n) => (
                        <a
                            key={n.href}
                            href={n.href}
                            className="pointer-events-auto text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {n.label}
                        </a>
                    ))}
                </nav>
            </header>

            {/* Right intro paragraph */}
            <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 md:right-12 md:block">
                <p
                    data-depth="12"
                    className="hero-fade max-w-60 font-mono text-sm leading-relaxed text-muted-foreground"
                >
                    I&apos;m a Morocco-based{" "}
                    <span className="text-foreground">
                        senior full-stack engineer
                    </span>{" "}
                    and DevOps architect. I started in the backend and grew into{" "}
                    <span className="text-foreground">
                        creating fast, expressive 3D web experiences
                    </span>{" "}
                    on the frontend.
                </p>
            </div>

            {/* Bottom bar */}
            <footer className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 font-mono text-xs text-muted-foreground md:p-8">
                <div className="hero-fade" data-depth="8">
                    <p className="uppercase tracking-wide">Local time</p>
                    <Clock />
                </div>
                <nav
                    className="hero-fade hidden gap-6 sm:flex"
                    data-depth="6"
                    aria-label="Social"
                >
                    <a
                        href={PROFILE.github}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-foreground"
                    >
                        GitHub
                    </a>
                    <a
                        href={PROFILE.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-foreground"
                    >
                        LinkedIn
                    </a>
                </nav>
                <div className="hero-fade text-right" data-depth="8">
                    <p>© {new Date().getFullYear()}</p>
                    <p className="uppercase tracking-wide text-foreground">
                        Oussama Ezitouni
                    </p>
                </div>
            </footer>
        </section>
    );
}

// Live local clock; rendered client-side only to avoid hydration mismatch.
function Clock() {
    const [time, setTime] = useState("");
    useEffect(() => {
        const fmt = () =>
            new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
        setTime(fmt());
        const id = setInterval(() => setTime(fmt()), 10000);
        return () => clearInterval(id);
    }, []);
    return <p className="text-foreground">{time || "—"}</p>;
}
