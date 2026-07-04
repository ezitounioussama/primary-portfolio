"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GitBranch, Home, Layers, Mail, User } from "lucide-react";
import { useRef } from "react";
import { NAV_ITEMS } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICONS = {
    home: Home,
    layers: Layers,
    user: User,
    mail: Mail,
    github: GitBranch,
};

const BASE = 44; // resting icon size (px)
const MAX = 78; // peak size under the cursor
const RANGE = 150; // px of horizontal influence around the cursor

/**
 * Aceternity-style floating dock, re-implemented with GSAP.
 *
 * Framer Motion's spring-per-icon is replaced with a single mousemove handler
 * that maps each item's distance from the cursor to a size, animated with a
 * per-item gsap.quickTo (GPU-friendly, one tween instance reused per frame).
 */
export default function FloatingDock() {
    const dockRef = useRef(null);
    const itemRefs = useRef([]);
    const setters = useRef([]);

    useGSAP(
        (_ctx, contextSafe) => {
            // One reusable width setter per item.
            setters.current = itemRefs.current.map((el) =>
                gsap.quickTo(el, "width", {
                    duration: 0.28,
                    ease: "power3.out",
                }),
            );
            const heightSetters = itemRefs.current.map((el) =>
                gsap.quickTo(el, "height", {
                    duration: 0.28,
                    ease: "power3.out",
                }),
            );

            const magnify = contextSafe((mouseX) => {
                itemRefs.current.forEach((el, i) => {
                    const rect = el.getBoundingClientRect();
                    const center = rect.left + rect.width / 2;
                    const dist = Math.abs(mouseX - center);
                    const t = Math.max(0, 1 - dist / RANGE); // 1 at cursor, 0 past range
                    const size = BASE + (MAX - BASE) * t;
                    setters.current[i](size);
                    heightSetters[i](size);
                });
            });

            const reset = contextSafe(() => {
                setters.current.forEach((s) => {
                    s(BASE);
                });
                heightSetters.forEach((s) => {
                    s(BASE);
                });
            });

            const dock = dockRef.current;
            const onMove = (e) => magnify(e.clientX);
            dock.addEventListener("mousemove", onMove);
            dock.addEventListener("mouseleave", reset);

            // Entrance.
            gsap.from(dock, {
                yPercent: 140,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.4,
            });

            return () => {
                dock.removeEventListener("mousemove", onMove);
                dock.removeEventListener("mouseleave", reset);
            };
        },
        { scope: dockRef },
    );

    return (
        <nav
            aria-label="Primary"
            className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center"
        >
            <ul
                ref={dockRef}
                className="pointer-events-auto flex items-end gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl"
            >
                {NAV_ITEMS.map((item, i) => {
                    const Icon = ICONS[item.icon] ?? Home;
                    return (
                        <li
                            key={item.href}
                            className="group relative flex flex-col items-center"
                        >
                            <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-border bg-background/90 px-2 py-1 text-xs text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                {item.label}
                            </span>
                            <a
                                ref={(el) => {
                                    if (el) itemRefs.current[i] = el;
                                }}
                                href={item.href}
                                target={item.external ? "_blank" : undefined}
                                rel={item.external ? "noreferrer" : undefined}
                                aria-label={item.label}
                                style={{ width: BASE, height: BASE }}
                                className={cn(
                                    "flex items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground",
                                    "transition-colors hover:bg-foreground/10 hover:text-foreground",
                                )}
                            >
                                <Icon
                                    className="h-1/2 w-1/2"
                                    strokeWidth={1.6}
                                />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
