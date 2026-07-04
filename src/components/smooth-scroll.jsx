"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Global smooth-scroll provider.
 *
 * Wires Lenis into GSAP's ticker so ScrollTrigger and Lenis share a single
 * rAF loop (the integration recommended by both projects). All scroll-linked
 * animations elsewhere in the app use plain ScrollTrigger and stay in sync.
 *
 * Honors prefers-reduced-motion by skipping Lenis entirely (native scroll).
 */
export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null);

    useGSAP(() => {
        const reduced =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced) {
            ScrollTrigger.refresh();
            return;
        }

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        // Keep ScrollTrigger updated on every Lenis scroll.
        lenis.on("scroll", ScrollTrigger.update);

        // Drive Lenis from GSAP's ticker (single rAF loop, no lag smoothing).
        const raf = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        // Recalculate triggers once fonts/images settle.
        ScrollTrigger.refresh();

        return () => {
            gsap.ticker.remove(raf);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, {});

    return children;
}
