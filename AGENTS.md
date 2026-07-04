<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Primary Portfolio — fullstack Next.js portfolio

A personal portfolio site built as a **fullstack Next.js App Router** app. The
front is animation-heavy and editorial; the back is Next.js Route Handlers /
Server Actions (contact form, CMS-ish content, etc.). Motion and scroll
choreography are first-class product features here, not decoration — treat them
with the same care as the data layer.

## Stack

| Concern            | Choice                                          | Notes |
| ------------------ | ----------------------------------------------- | ----- |
| Framework          | Next.js `16.2.10`, App Router, RSC              | Read `node_modules/next/dist/docs/01-app/` before touching routing, data, caching, metadata. |
| Language           | **JavaScript**, not TypeScript                  | `jsconfig.json` with `@/*` → `src/*`. `components.json` has `"tsx": false`. Do not introduce `.ts`/`.tsx`. |
| React              | `19.2.4`                                        | Server Components by default; add `"use client"` only where hooks/GSAP need it. |
| Styling            | Tailwind CSS **v4**                             | Config lives in `src/app/globals.css` via `@import "tailwindcss"` + `@theme`. There is no `tailwind.config.js`. |
| UI primitives      | shadcn/ui — style `radix-nova`, base `radix`    | `bunx --bun shadcn@latest add <name>` → `src/components/ui/`. |
| Effects registry   | Magic UI — registry `@magicui`                  | `bunx --bun shadcn@latest add @magicui/<name>`. |
| Animation          | **GSAP** — `gsap` + `@gsap/react` + `ScrollTrigger` | The animation engine. Follow the GSAP skills (`useGSAP`, `scope`, cleanup, SSR-safe). The Aceternity / Olivier Larose references use Framer Motion — port the *visual idea* to GSAP, do not add `motion`. |
| Smooth scroll      | `lenis`                                         | Wired into GSAP's ticker in `components/smooth-scroll.jsx`; ScrollTrigger stays in sync. Drives parallax + scroll-linked effects. |
| Icons              | `lucide-react`                                  | Set by the Nova preset. |
| Utils              | `cn()` in `src/lib/utils.js`                    | `clsx` + `tailwind-merge`. Always compose classes through `cn`. |
| Fonts              | Geist Sans + Geist Mono + Instrument Serif via `next/font/google` | `--font-geist-sans` / `--font-geist-mono` / `--font-instrument`. `font-serif` (Instrument Serif, has italic) is the display accent used in the hero. |
| Lint / format      | Biome `2.2.0`                                   | `bun run lint` (`biome check`), `bun run format`. |
| Package manager    | **Bun** (`bun.lock`)                            | Use `bun` / `bunx --bun`. Do not add `package-lock.json` / `pnpm-lock.yaml`. |

## Commands

```bash
bun dev              # next dev
bun run build        # next build
bun run start        # next start
bun run lint         # biome check
bun run format       # biome format --write
bunx --bun shadcn@latest add <component>     # shadcn/ui
bunx --bun shadcn@latest add @magicui/<c>    # Magic UI
```

## Project layout

```
src/
  app/
    layout.js              # root layout — dark, Geist fonts, wraps <SmoothScroll> + <FloatingDock>
    page.js                # home — composition (Hero → Curve → Experience → About → Contact)
    actions.js             # "use server" — submitContact Server Action
    globals.css            # Tailwind v4 + shadcn tokens (@theme) + accent-1..5 + Lenis baseline
  components/
    smooth-scroll.jsx        # Lenis ↔ GSAP ticker ↔ ScrollTrigger provider (client)
    nav/floating-dock.jsx    # magnify-on-hover dock (GSAP quickTo)
    hero/parallax-hero.jsx   # 3D mouse-parallax holographic orb + editorial chrome
    transitions/curve.jsx    # velocity-reactive bezier divider between sections
    experience/timeline.jsx  # Aceternity Timeline (scroll-beam) ported to GSAP
    sections/about.jsx       # parallax + word-by-word reveal
    sections/contact.jsx     # contact form (useActionState → submitContact)
    ui/                      # shadcn primitives (animated-theme-toggler, …)
  lib/
    utils.js               # cn()
    data.js                # PROFILE, NAV_ITEMS, STACK, TIMELINE (all resume content)
```

All portfolio content is real (from Oussama's resume) and lives in `lib/data.js` —
edit copy there, not in components.

Keep page sections as composable components in `src/components/`. `page.js` reads
as a clear top-to-bottom composition of sections.

## The build — sections & references (implemented)

These are built with **GSAP** (the references use Framer Motion — the visual idea
was ported to GSAP, not the code). When extending, **read the reference with
`/browse` first**, then adapt to JS + Tailwind v4 + `cn()`; never paste TS verbatim.

1. **Smooth scroll (global)** — [Lenis](https://www.lenis.dev/) → `smooth-scroll.jsx`.
   Driven by GSAP's ticker; `lenis.on("scroll", ScrollTrigger.update)` keeps
   triggers in sync. Skipped under `prefers-reduced-motion` (native scroll).

2. **Navigation** — [Aceternity Floating Dock](https://ui.aceternity.com/components/floating-dock)
   → `nav/floating-dock.jsx`. Per-item `gsap.quickTo` magnifies icons by cursor distance.

3. **Hero** — 3D mouse-parallax orb, inspired by the
   [ARKON DIGITAL awwwards reference](https://www.awwwards.com/inspiration/3d-mouse-parallax-ad-personal-portfolio)
   → `hero/parallax-hero.jsx`. A holographic orb (animated conic-gradient blobs) over a
   reflective ground with editorial corner labels + script/bold headline. `pointermove`
   drives `gsap.quickTo` on each `[data-depth]` layer and tilts the scene (rotateX/Y).
   **Gotcha:** CSS centering (`-translate-x-1/2`) lives on static wrappers; GSAP animates
   x/y on separate inner `[data-depth]` nodes so the transforms don't fight. Disabled
   under `prefers-reduced-motion`. (Replaced the earlier Gemini-effect hero.)

4. **Section transitions** — [SVG Bézier curve](https://blog.olivierlarose.com/demos/svg-bezier-curve)
   → `transitions/curve.jsx`. Control point pushed by `self.getVelocity()`, springs
   back with `elastic.out`. Reused between every section in `page.js`.

5. **Experience** — [Aceternity Timeline](https://ui.aceternity.com/components/timeline)
   → `experience/timeline.jsx`. Sticky period labels; a gradient beam grows with a
   ScrollTrigger scrub (start `"top 10%"` → end `"bottom 50%"`, `invalidateOnRefresh`),
   porting Aceternity's Framer `useScroll`/`useTransform`. Driven by `lib/data.js`
   `TIMELINE`. (Replaced the earlier Olivier Larose image-slide gallery.)

### Animation conventions — GSAP skills
Follow the official **GSAP skills** (`greensock/gsap-skills`): `gsap-react`,
`gsap-scrolltrigger`, `gsap-core`, `gsap-timeline`.
- Use **`useGSAP(() => {...}, { scope: ref })`** from `@gsap/react` — never bare
  `useEffect`. It auto-reverts tweens/ScrollTriggers on unmount.
- **`gsap.registerPlugin(useGSAP, ScrollTrigger)`** once at the top of each module
  that uses them. All GSAP code runs client-side (`"use client"`) — never at SSR.
- Pass a **`scope`**; wrap event-handler-created tweens in **`contextSafe`** and
  remove listeners in the returned cleanup.
- Put ScrollTrigger on **top-level** tweens/timelines, not child tweens. Use
  **`scrub`** for scroll-linked progress; **`ease: "none"`** for any
  `containerAnimation` horizontal scroll.
- Honor `prefers-reduced-motion`; prefer transform/opacity; keep GSAP components
  leaf-level so `page.js`/`layout.js` stay Server Components.

## Theming (dark / light)

- Theme is the **`.dark` class on `<html>`** (Tailwind `@custom-variant dark`).
  Persisted in **`localStorage.theme`** (`"light"` | `"dark"`).
- A blocking inline script in `layout.js` applies the saved theme **before paint**
  — no FOUC. **Dark-first:** defaults to dark unless the visitor explicitly chose
  light. `<html>` has `suppressHydrationWarning`.
- The toggle is **`components/ui/animated-theme-toggler.jsx`** (Magic UI, added via
  `@magicui/animated-theme-toggler`), rendered fixed top-right in `layout.js`. It
  uses the **View Transitions API** (clip-path reveal) and, uncontrolled, writes
  `localStorage.theme` + toggles `.dark` — the same contract as the init script.
  Don't add another theme mechanism (e.g. `next-themes`) — they'd fight.
- Style surfaces with **theme-aware tokens** (`bg-foreground/5`, `border-border`,
  `bg-background/60`), never `bg-white/x` / `border-white/x`, so both themes read
  correctly. The `::view-transition-*(root)` reset lives in `globals.css`.

## Conventions & guardrails

- **JS only** — no TypeScript files or type annotations.
- **Tailwind v4** — theme/token changes go in `globals.css` `@theme`, never a
  `tailwind.config.js`.
- Compose classNames with `cn()`; use CSS variables from the shadcn theme for
  colors rather than hard-coded hex.
- Server Components by default; reach for `"use client"` only when a component
  needs browser APIs, state, or GSAP.
- Add shadcn/Magic UI components via the CLI (keeps `components.json` registries
  in sync) rather than hand-copying files.
- Fullstack work (Route Handlers, Server Actions, data fetching, caching): read
  the matching guide under `node_modules/next/dist/docs/01-app/` first — the API
  differs from older Next.js.

## MCP

- `.mcp.json` registers the **shadcn** MCP server. The **Magic UI** MCP is also
  available — use these to browse/install components.
