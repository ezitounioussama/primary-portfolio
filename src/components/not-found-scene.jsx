"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { PROFILE } from "@/lib/data";

gsap.registerPlugin(useGSAP);

const IRIDESCENT =
    "conic-gradient(from 0deg, #ff5f9e, #a78bfa, #38bdf8, #34d399, #fbbf24, #fb7185, #ff5f9e)";

/**
 * 404 scene — same holographic-orb language as the hero (parallax layers,
 * swirling orb, editorial chrome), with a clear route back home.
 */
export default function NotFoundScene() {
    const sectionRef = useRef(null);
    const sceneRef = useRef(null);

    useGSAP(
        (_ctx, contextSafe) => {
            const reduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            gsap.from(".nf-rise", {
                yPercent: 120,
                opacity: 0,
                duration: 1,
                stagger: 0.08,
                ease: "power4.out",
            });
            gsap.from(".nf-fade", {
                opacity: 0,
                duration: 0.7,
                stagger: 0.05,
                delay: 0.1,
                ease: "power2.out",
            });
            gsap.from(".orb-scale", {
                scale: 0.6,
                opacity: 0,
                duration: 1.4,
                ease: "power3.out",
            });

            if (reduced) return;

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
            gsap.to(".orb-float", {
                yPercent: -5,
                duration: 4,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
            });

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
                const nx = e.clientX / window.innerWidth - 0.5;
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
            ref={sectionRef}
            className="relative h-screen w-full overflow-hidden bg-background [perspective:1200px]"
        >
            {/* Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_40%,color-mix(in_oklch,var(--foreground)_8%,transparent)_100%)]" />

            {/* Parallax scene */}
            <div
                ref={sceneRef}
                className="absolute inset-0 [transform-style:preserve-3d]"
            >
                {/* Orb */}
                <div className="absolute left-1/2 top-[30%] -translate-x-1/2">
                    <div data-depth="40">
                        <div className="orb-float orb-scale relative h-[38vw] max-h-[420px] min-h-[220px] w-[38vw] min-w-[220px] max-w-[420px]">
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
                                <div className="absolute inset-0 rounded-full bg-[radial-gradient(50%_45%_at_35%_28%,rgba(255,255,255,0.85),transparent_60%)]" />
                                <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-40px_80px_-30px_rgba(0,0,0,0.6),inset_20px_20px_60px_-40px_rgba(255,255,255,0.6)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copy over the orb */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div data-depth="18">
                    <p className="nf-fade mb-4 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
                        Error 404
                    </p>
                    <h1 className="leading-[0.85]">
                        <span className="nf-rise block font-serif text-6xl italic text-foreground sm:text-7xl lg:text-8xl">
                            Lost in
                        </span>
                        <span className="nf-rise block text-6xl font-semibold uppercase tracking-tight text-foreground sm:text-8xl lg:text-[9rem]">
                            orbit.
                        </span>
                    </h1>
                    <p className="nf-fade mx-auto mt-6 max-w-sm font-mono text-sm leading-relaxed text-muted-foreground">
                        This page drifted off the map. Let&apos;s get you back
                        to solid ground.
                    </p>
                    {/* CTA stays out of the GSAP fade group: always visible, even pre-JS */}
                    <Link
                        href="/"
                        className="pointer-events-auto mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Back home
                    </Link>
                </div>
            </div>

            {/* Editorial corners */}
            <header className="absolute inset-x-0 top-0 flex items-start justify-between p-6 font-mono text-xs md:p-8">
                <p
                    className="nf-fade font-sans text-sm font-semibold uppercase leading-tight tracking-wide"
                    data-depth="8"
                >
                    Oussama
                    <br />
                    Ezitouni
                </p>
                <p
                    className="nf-fade pr-14 text-muted-foreground"
                    data-depth="6"
                >
                    404 — not found
                </p>
            </header>
            <footer className="absolute inset-x-0 bottom-0 hidden items-end justify-between p-6 font-mono text-xs text-muted-foreground sm:flex md:p-8">
                <a
                    href={`mailto:${PROFILE.email}`}
                    className="nf-fade pointer-events-auto inline-block py-1.5 underline underline-offset-4 transition-colors hover:text-foreground"
                    data-depth="8"
                >
                    {PROFILE.email}
                </a>
                <p className="nf-fade" data-depth="8">
                    © {new Date().getFullYear()} Oussama Ezitouni
                </p>
            </footer>
        </section>
    );
}
