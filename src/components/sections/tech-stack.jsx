"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { TECH_CATEGORIES, TECH_STACK } from "@/lib/data";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const IRIDESCENT =
    "conic-gradient(from 0deg, #ff5f9e, #a78bfa, #38bdf8, #34d399, #fbbf24, #fb7185, #ff5f9e)";

/**
 * Tech stack — glassy icon tiles over a glowing dome (reference:
 * red1-for-hek.vercel.app), pushed further with GSAP:
 *
 * - Tiles pop in with a center-out stagger (ScrollTrigger).
 * - The whole wall tilts in 3D toward the cursor (quickTo rotationX/Y),
 *   with per-tile CSS hover lift on a separate inner node so the two
 *   transforms never fight.
 * - Category chips (JavaScript / PHP / Data Science / …) dim non-matching
 *   tiles in place — no reflow, the wall keeps its shape.
 * - Idle: tiles breathe on a slow randomized bob. All skipped under
 *   prefers-reduced-motion.
 */
export default function TechStack() {
    const sectionRef = useRef(null);
    const wallRef = useRef(null);
    const filterRef = useRef(null); // contextSafe filter fn
    const [active, setActive] = useState("all");

    useGSAP(
        (_ctx, contextSafe) => {
            const reduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;
            const tiles = gsap.utils.toArray(".tech-tile", sectionRef.current);

            // Filter: dim + shrink non-matching tiles in place.
            filterRef.current = contextSafe((key) => {
                for (const tile of tiles) {
                    const match =
                        key === "all" || tile.dataset.category === key;
                    gsap.to(tile, {
                        opacity: match ? 1 : 0.15,
                        scale: match ? 1 : 0.82,
                        duration: 0.45,
                        ease: "power3.out",
                        overwrite: "auto",
                    });
                }
            });

            if (reduced) return;

            // Center-out entrance.
            gsap.from(tiles, {
                opacity: 0,
                scale: 0.4,
                y: 40,
                duration: 0.7,
                ease: "back.out(1.6)",
                stagger: { each: 0.018, from: "center", grid: "auto" },
                scrollTrigger: {
                    trigger: wallRef.current,
                    start: "top 75%",
                },
            });

            // Glow dome swells in behind the wall.
            gsap.from(".tech-dome", {
                opacity: 0,
                scale: 0.5,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: wallRef.current,
                    start: "top 75%",
                },
            });

            // Idle breathing: randomized bob per tile (transform-only).
            for (const tile of tiles) {
                gsap.to(tile.firstElementChild, {
                    y: gsap.utils.random(-4, -9),
                    duration: gsap.utils.random(2.2, 3.6),
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: gsap.utils.random(0, 2),
                });
            }

            // 3D tilt toward the cursor.
            const rotX = gsap.quickTo(wallRef.current, "rotationX", {
                duration: 0.8,
                ease: "power3.out",
            });
            const rotY = gsap.quickTo(wallRef.current, "rotationY", {
                duration: 0.8,
                ease: "power3.out",
            });
            const onMove = contextSafe((e) => {
                const rect = sectionRef.current.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width - 0.5;
                const ny = (e.clientY - rect.top) / rect.height - 0.5;
                rotY(nx * 10);
                rotX(-ny * 10);
            });
            const onLeave = contextSafe(() => {
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

    const pick = (key) => {
        setActive(key);
        filterRef.current?.(key);
    };

    return (
        <section
            id="stack"
            ref={sectionRef}
            className="relative mx-auto max-w-6xl overflow-hidden px-6 py-24 md:py-32"
        >
            <header className="mb-10 text-center">
                <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
                    Tech <span className="font-serif italic">stack</span>
                </h2>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                    The tools I reach for — across the JavaScript and PHP
                    worlds, data science, and the infrastructure underneath.
                </p>
            </header>

            {/* Category filter chips */}
            <div className="mb-14 flex flex-wrap justify-center gap-2">
                {[{ key: "all", label: "All" }, ...TECH_CATEGORIES].map((c) => (
                    <button
                        key={c.key}
                        type="button"
                        onClick={() => pick(c.key)}
                        className={cn(
                            "rounded-full border px-4 py-1.5 font-mono text-xs transition-colors",
                            active === c.key
                                ? "border-foreground bg-foreground text-background"
                                : "border-border bg-foreground/5 text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Tilting wall */}
            <div className="[perspective:1200px]">
                <div
                    ref={wallRef}
                    className="relative mx-auto max-w-4xl [transform-style:preserve-3d]"
                >
                    {/* Glow dome */}
                    <div
                        aria-hidden="true"
                        className="tech-dome pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[110%] -translate-x-1/2 rounded-[50%] opacity-30 blur-3xl dark:opacity-40"
                        style={{ background: IRIDESCENT }}
                    />

                    <ul className="relative flex flex-wrap justify-center gap-3">
                        {TECH_STACK.map((t) => (
                            <li
                                key={t.name}
                                data-category={t.category}
                                className="tech-tile"
                            >
                                {/* Inner node owns hover lift so it never fights GSAP transforms */}
                                <div className="group flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background/40 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-foreground/30 hover:bg-foreground/10 hover:shadow-xl">
                                    {/* biome-ignore lint/performance/noImgElement: tiny external CDN brand icons; next/image adds no value here */}
                                    <img
                                        src={`https://cdn.simpleicons.org/${t.icon}`}
                                        alt=""
                                        width={32}
                                        height={32}
                                        loading="lazy"
                                        className="h-8 w-8 opacity-80 grayscale-25 transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                                    />
                                    <span className="px-1 text-center font-mono text-[10px] leading-tight text-muted-foreground transition-colors group-hover:text-foreground">
                                        {t.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
