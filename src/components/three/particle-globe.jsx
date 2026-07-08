"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import {
    AdditiveBlending,
    BufferGeometry,
    CanvasTexture,
    Color,
    Float32BufferAttribute,
    Fog,
    Group,
    NormalBlending,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    WebGLRenderer,
} from "three";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Palette sampled from the site accents — violet/blue planet with warm sparks.
const DOT_COLORS = ["#a78bfa", "#38bdf8", "#7c7cf0", "#ff5f9e", "#34d399"];
const DOT_WEIGHTS = [0.42, 0.3, 0.18, 0.06, 0.04]; // violet/blue dominant

function pickColor() {
    let r = Math.random();
    for (let i = 0; i < DOT_COLORS.length; i++) {
        r -= DOT_WEIGHTS[i];
        if (r <= 0) return new Color(DOT_COLORS[i]);
    }
    return new Color(DOT_COLORS[0]);
}

// Fibonacci sphere: evenly distributed dotted planet (the ARKON look).
function buildSphere(count, radius) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        positions[i * 3] = Math.cos(theta) * r * radius;
        positions[i * 3 + 1] = y * radius;
        positions[i * 3 + 2] = Math.sin(theta) * r * radius;
        const c = pickColor();
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return geo;
}

// Tilted particle ring around the planet (Saturn-style band).
function buildRing(count, inner, outer) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Bias density toward the inner edge for a crisp rim.
        const r = inner + (outer - inner) * Math.random() ** 1.6;
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.02; // near-flat band
        positions[i * 3 + 2] = Math.sin(angle) * r;
        const c = pickColor();
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return geo;
}

// Sparse dust shell around the planet.
function buildHalo(count, inner, outer) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const dir = [
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
        ];
        const len = Math.hypot(dir[0], dir[1], dir[2]) || 1;
        const r = inner + Math.random() * (outer - inner);
        positions[i * 3] = (dir[0] / len) * r;
        positions[i * 3 + 1] = (dir[1] / len) * r;
        positions[i * 3 + 2] = (dir[2] / len) * r;
        const c = pickColor();
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return geo;
}

// Soft round sprite so points render as glowing dots, not squares.
function makeDotTexture() {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
    );
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.8)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
}

/**
 * Dotted 3D particle planet (Three.js), ARKON-style. Fills its (absolutely
 * positioned) wrapper and choreographs itself against `triggerRef`'s section:
 * sweeps in huge from the bottom-right, settles as a rotating backdrop, and
 * drifts as you scroll through — all scrubbed. Idle spin runs on gsap.ticker
 * and pauses when the section leaves the viewport. Theme-aware blending;
 * static single frame under prefers-reduced-motion.
 */
export default function ParticleGlobe({ triggerRef, className }) {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);

    useGSAP(
        () => {
            const wrap = wrapRef.current;
            const trigger = triggerRef?.current ?? wrap.parentElement;
            const reduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            const renderer = new WebGLRenderer({
                canvas: canvasRef.current,
                alpha: true,
                antialias: false,
                powerPreference: "low-power",
            });
            renderer.setClearColor(0x000000, 0);

            const scene = new Scene();
            // Depth fade: far-side dots blend toward the page background,
            // giving the sphere real volume (GitHub-globe technique).
            scene.fog = new Fog(0x0a0a0a, 2.2, 5.2);
            const camera = new PerspectiveCamera(45, 1, 0.1, 30);
            camera.position.z = 3.2;

            const isDark = () =>
                document.documentElement.classList.contains("dark");

            const dotTexture = makeDotTexture();
            const sphereMat = new PointsMaterial({
                size: 0.018,
                map: dotTexture,
                vertexColors: true,
                transparent: true,
                depthWrite: false,
                sizeAttenuation: true,
            });
            const haloMat = new PointsMaterial({
                size: 0.014,
                map: dotTexture,
                vertexColors: true,
                transparent: true,
                depthWrite: false,
                sizeAttenuation: true,
            });
            const ringMat = new PointsMaterial({
                size: 0.013,
                map: dotTexture,
                vertexColors: true,
                transparent: true,
                depthWrite: false,
                sizeAttenuation: true,
            });
            const applyTheme = () => {
                const dark = isDark();
                // Dark: additive glow. Light: normal blending with the vertex
                // colors multiplied toward deep indigo so dots stay saturated
                // and readable on white (GitHub-globe style).
                const tint = dark ? 0xffffff : 0x4c4c8a;
                for (const m of [sphereMat, haloMat, ringMat]) {
                    m.blending = dark ? AdditiveBlending : NormalBlending;
                    m.color.set(tint);
                    m.needsUpdate = true;
                }
                sphereMat.opacity = dark ? 0.85 : 0.8;
                haloMat.opacity = dark ? 0.5 : 0.45;
                ringMat.opacity = dark ? 0.7 : 0.6;
                scene.fog.color.set(dark ? 0x0a0a0a : 0xffffff);
            };
            applyTheme();
            const themeObserver = new MutationObserver(applyTheme);
            themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["class"],
            });

            const globe = new Group();
            const sphere = new Points(buildSphere(6000, 1), sphereMat);
            const halo = new Points(buildHalo(1200, 1.15, 1.9), haloMat);
            const ring = new Points(buildRing(2200, 1.35, 1.85), ringMat);
            ring.rotation.x = 0.42; // tilt the band toward the camera
            globe.add(sphere);
            globe.add(halo);
            globe.add(ring);
            // Slight axial tilt like a real planet.
            globe.rotation.z = 0.18;
            scene.add(globe);

            const resize = () => {
                const { clientWidth: w, clientHeight: h } = wrap;
                if (!w || !h) return;
                renderer.setPixelRatio(
                    Math.min(window.devicePixelRatio || 1, 1.75),
                );
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            };
            resize();
            const ro = new ResizeObserver(resize);
            ro.observe(wrap);

            if (reduced) {
                // Static backdrop: settled pose, one frame (re-rendered on
                // resize/theme only).
                globe.position.set(1.1, 0, 0);
                globe.scale.setScalar(1.5);
                const renderOnce = () => renderer.render(scene, camera);
                renderOnce();
                const staticObserver = new MutationObserver(renderOnce);
                staticObserver.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ["class"],
                });
                const roStatic = new ResizeObserver(() => {
                    resize();
                    renderOnce();
                });
                roStatic.observe(wrap);
                return () => {
                    staticObserver.disconnect();
                    roStatic.disconnect();
                    themeObserver.disconnect();
                    ro.disconnect();
                    sphere.geometry.dispose();
                    halo.geometry.dispose();
                    ring.geometry.dispose();
                    dotTexture.dispose();
                    sphereMat.dispose();
                    haloMat.dispose();
                    ringMat.dispose();
                    renderer.dispose();
                };
            }

            // Render only while the section is on screen.
            let active = false;
            const tick = () => {
                globe.rotation.y += gsap.ticker.deltaRatio(60) * 0.0016;
                halo.rotation.y -= gsap.ticker.deltaRatio(60) * 0.0008;
                ring.rotation.y += gsap.ticker.deltaRatio(60) * 0.0022;
                renderer.render(scene, camera);
            };
            ScrollTrigger.create({
                trigger,
                start: "top bottom",
                end: "bottom top",
                onToggle: (self) => {
                    if (self.isActive && !active) {
                        active = true;
                        gsap.ticker.add(tick);
                    } else if (!self.isActive && active) {
                        active = false;
                        gsap.ticker.remove(tick);
                    }
                },
            });

            // The sweep: huge from bottom-right → settled backdrop → drift off
            // upward as the section ends. Scrubbed to the section's scroll.
            globe.position.set(2.4, -1.6, 0);
            globe.scale.setScalar(2.8);
            const sweep = gsap.timeline({
                scrollTrigger: {
                    trigger,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                },
            });
            sweep
                .to(globe.position, { x: 1.15, y: 0.1, ease: "none" }, 0)
                .to(globe.scale, { x: 1.6, y: 1.6, z: 1.6, ease: "none" }, 0)
                .to(globe.rotation, { y: Math.PI * 1.1, ease: "none" }, 0)
                .to(globe.position, { x: 0.7, y: 1.1, ease: "none" }, 0.55)
                .to(
                    globe.scale,
                    { x: 1.15, y: 1.15, z: 1.15, ease: "none" },
                    0.55,
                );

            return () => {
                if (active) gsap.ticker.remove(tick);
                themeObserver.disconnect();
                ro.disconnect();
                sphere.geometry.dispose();
                halo.geometry.dispose();
                ring.geometry.dispose();
                dotTexture.dispose();
                sphereMat.dispose();
                haloMat.dispose();
                ringMat.dispose();
                renderer.dispose();
            };
        },
        { scope: wrapRef },
    );

    return (
        <div
            ref={wrapRef}
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden",
                className,
            )}
        >
            <canvas ref={canvasRef} className="h-full w-full" />
        </div>
    );
}
