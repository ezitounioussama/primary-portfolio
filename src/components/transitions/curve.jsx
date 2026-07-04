"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Velocity-reactive bezier curve divider (Olivier Larose style).
 *
 * A single horizontal path whose middle control point is pushed by scroll
 * velocity, then springs back to flat. Framer Motion's useSpring on the control
 * point is replaced with an elastic GSAP rebound tween that we restart on each
 * scroll update. Coordinates are raw pixels (no viewBox) so the stroke stays
 * crisp and the curve is naturally responsive to container width.
 */
export default function Curve({ label }) {
    const wrapRef = useRef(null);
    const pathRef = useRef(null);

    useGSAP(
        () => {
            const wrap = wrapRef.current;
            const path = pathRef.current;
            const state = { bulge: 0 };

            const draw = () => {
                const w = wrap.clientWidth;
                const h = wrap.clientHeight;
                const mid = h / 2;
                path.setAttribute(
                    "d",
                    `M0 ${mid} Q ${w / 2} ${mid + state.bulge} ${w} ${mid}`,
                );
            };
            draw();

            // Springs the curve back to flat after each velocity kick.
            const rebound = gsap.to(state, {
                bulge: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)",
                paused: true,
                onUpdate: draw,
            });

            const st = ScrollTrigger.create({
                trigger: wrap,
                start: "top bottom",
                end: "bottom top",
                onUpdate: (self) => {
                    state.bulge = gsap.utils.clamp(
                        -70,
                        70,
                        self.getVelocity() * 0.03,
                    );
                    draw();
                    rebound.restart();
                },
            });

            const onResize = () => draw();
            window.addEventListener("resize", onResize);

            return () => {
                window.removeEventListener("resize", onResize);
                st.kill();
            };
        },
        { scope: wrapRef },
    );

    return (
        <div
            ref={wrapRef}
            className="relative h-28 w-full overflow-visible"
            aria-hidden="true"
        >
            {label ? (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+2rem)] font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                    {label}
                </span>
            ) : null}
            <svg
                className="h-full w-full"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    ref={pathRef}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-border"
                />
            </svg>
        </div>
    );
}
