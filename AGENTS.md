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
| 3D                 | `three`                                         | Used sparingly for real-3D set pieces (`components/three/particle-globe.jsx`). Render loops run on `gsap.ticker`, gated to viewport visibility; dispose geometries/materials/renderer in the `useGSAP` cleanup. |
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
    layout.js              # root layout — metadata + viewport, fonts, theme init, chrome
    page.js                # home — section composition + JSON-LD structured data
    actions.js             # "use server" — submitContact Server Action
    globals.css            # Tailwind v4 + shadcn tokens (@theme) + accent-1..5 + Lenis baseline
    favicon.ico            # site icon (from gotodev.ma)
    opengraph-image.js     # dynamic OG/Twitter card (next/og ImageResponse, 1200x630)
    sitemap.js             # /sitemap.xml
    robots.js              # /robots.txt (allows Googlebot + AI crawlers, links sitemap)
  components/
    smooth-scroll.jsx        # Lenis ↔ GSAP ticker ↔ ScrollTrigger provider (client)
    nav/floating-dock.jsx    # magnify-on-hover dock (GSAP quickTo)
    hero/parallax-hero.jsx   # 3D mouse-parallax holographic orb + editorial chrome
    transitions/curve.jsx    # velocity-reactive bezier divider between sections
    experience/timeline.jsx  # Aceternity Timeline (scroll-beam) ported to GSAP + particle-globe backdrop
    three/particle-globe.jsx # Three.js dotted planet — scroll-scrubbed sweep (ARKON-style)
    sections/about.jsx       # Halpin-style intro — 3D holographic portrait card, count-up stats, value cards
    sections/tech-stack.jsx  # glassy icon wall — 3D tilt, center-out entrance, category filter
    sections/contact.jsx     # contact form (useActionState → submitContact)
    ui/                      # shadcn primitives (animated-theme-toggler, …)
  lib/
    utils.js               # cn()
    data.js                # SITE_URL, PROFILE, NAV_ITEMS, STACK, TECH_STACK, TIMELINE (all resume content)
public/
    llms.txt               # /llms.txt — structured site summary for AI agents
```

All portfolio content is real (from Oussama's resume) and lives in `lib/data.js` —
edit copy there, not in components.

## SEO & metadata

- **`SITE_URL`** in `lib/data.js` is the canonical origin — reads
  `NEXT_PUBLIC_SITE_URL`, falls back to a **placeholder** (`oussamaezitouni.com`).
  **Set the env var to the real deploy domain** before shipping; it feeds
  `metadataBase`, canonical, OG/Twitter URLs, sitemap, robots, and JSON-LD.
- Root **`metadata`** + **`viewport`** live in `layout.js` (title template,
  description, keywords, authors, OG, Twitter, `robots.googleBot`, icons,
  themeColor). Per-page metadata: add a `metadata` export (or `generateMetadata`)
  to that route; the title `template` appends `— Oussama Ezitouni`.
- **JSON-LD** (`Person` + `WebSite` + `ProfilePage`) is injected in `page.js` from
  `lib/data.js` — update the data, not hand-written schema.
- **OG image** is generated at build by `opengraph-image.js` (`next/og`). Satori
  supports only linear/radial gradients — **no `conic-gradient`** there.
- Regenerate/verify: `bun run build` emits `/opengraph-image`, `/sitemap.xml`,
  `/robots.txt`; `/llms.txt` and `/favicon.ico` are static.

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
   Behind it, `three/particle-globe.jsx` renders an ARKON-style dotted particle
   planet (Fibonacci sphere + halo dust + tilted Saturn-style ring band, soft
   radial sprite so dots aren't squares) that sweeps in huge from the
   bottom-right and rotates/drifts on a scrubbed timeline across the whole
   section. **Scene fog** (color = page background per theme) depth-fades the
   far side — the GitHub-globe volume trick. Idle spin runs on `gsap.ticker`,
   added/removed by a viewport-visibility ScrollTrigger; theme handling via a
   `.dark`-class MutationObserver: dark = additive glow blending, light =
   normal blending with the material `color` multiplier set to deep indigo
   (`0x4c4c8a`) so dots stay saturated on white. Static single frame under
   `prefers-reduced-motion`.
   DOM side: a radial **legibility veil** sits between canvas and content.
   Entries are **glass cards** that reveal individually on arrival (rise +
   blur→sharp; bullets/tags cascade). A **focus lens** keeps the entry in the
   reading zone lit: each `.timeline-entry` gets `is-active` toggled by a
   ScrollTrigger (start `top 60%` / end `bottom 25%`) and children style via
   `group-[.is-active]:` variants (glowing accent node, scaled period label,
   accent card border/glow). The dimmer is a **dedicated inner node**
   (CSS-only opacity) so it never fights GSAP's inline entrance styles on
   `.timeline-card`. The 2px beam carries a glowing **comet** on its tip.
   Per-role `tags` chips come from `TIMELINE[].tags` in `lib/data.js`.
   **Gotcha:** the canvas lives in an absolute `overflow-hidden` wrapper
   *sibling* to the content — the section itself must NOT get
   `overflow-hidden` or the sticky labels break.

6. **About** — personal intro (reference: seanhalpin.xyz/about)
   → `sections/about.jsx`. "I'm Oussama." greeting with inline accent highlights;
   the portrait (`public/portrait.png`, 288px — keep display ≤ native size) is a
   **holographic trading card**: iridescent ring + halo, cursor-tracking 3D tilt,
   glare sweep (`xPercent/yPercent` on an oversized radial overlay), and orbit
   chips floating at `data-depth` parallax. Stats count up once (`snap`, `once`);
   value cards tilt individually. Content in `lib/data.js` `ABOUT`.

7. **Tech stack** — glassy icon wall (reference: red1-for-hek.vercel.app)
   → `sections/tech-stack.jsx`. Tiles from `lib/data.js` `TECH_STACK` with brand
   icons off the simple-icons CDN (`https://cdn.simpleicons.org/<slug>` — verify a
   slug 200s before adding; AWS is not available). Center-out `back.out` entrance,
   3D wall tilt toward the cursor (`quickTo` rotationX/Y under `[perspective]`),
   randomized idle bob, and category chips (JS / PHP / Data / DB / DevOps) that dim
   non-matching tiles **in place** (opacity+scale tween, no reflow). Hover lift
   lives on an inner node (CSS) so it never fights GSAP transforms on the tile.

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
