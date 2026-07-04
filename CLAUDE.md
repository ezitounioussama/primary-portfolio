# CLAUDE.md

Project guidance lives in **[AGENTS.md](./AGENTS.md)** — read it in full before
working in this repo. It is the single source of truth for the stack,
conventions, and the intended portfolio build.

@AGENTS.md

## Quick reminders

- **Fullstack Next.js 16 portfolio**, App Router, **JavaScript only** (no TS),
  React 19, Tailwind v4, **Bun**.
- This Next.js has breaking changes vs. training data — read
  `node_modules/next/dist/docs/01-app/` before writing routing/data/caching code.
- UI comes from **shadcn/ui** (`radix-nova`) and **Magic UI** (`@magicui`);
  add via `bunx --bun shadcn@latest add ...`, don't hand-copy.
- Animation stack is **GSAP** (`gsap` + `@gsap/react` + `ScrollTrigger`) + **Lenis**.
  Follow the GSAP skills: `useGSAP(fn, { scope })`, register plugins once, all GSAP
  client-side, cleanup via the hook. GSAP components are `"use client"` leaves; keep
  `page.js` / `layout.js` as Server Components.
- The Aceternity / Olivier Larose references are Framer Motion — port the visual
  idea to GSAP, don't add `motion`.
- Honor `prefers-reduced-motion`; compose classes with `cn()`.
- When browsing reference components (Aceternity, Olivier Larose, Lenis), use
  `/browse` and convert any TypeScript to JS before porting.
