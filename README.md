# Marco Quantrill — Portfolio

Personal site and project portfolio. Editorial-brutalist design: oversized
Anton display type, stark paper/ink palette with a single vermilion accent,
hard rules, and full-bleed imagery that breaks the grid.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion

## Develop

```bash
npm install
npm run dev
```

## Verify

`.claude/verify.mjs` is a 36-check regression suite that drives real headless
Chrome over CDP. It needs no npm packages — Node 22's built-in `WebSocket` and
`fetch` do the work.

```bash
npm run build
npx next start -p 3000
node .claude/verify.mjs http://localhost:3000/en
node .claude/verify.mjs http://localhost:3000/es
```

It covers fonts, metadata, project links, the lazy-loaded reel, image
dimensions, scroll motion, keyboard focus, tap-target sizes, and horizontal
overflow at 1440 / 390 / 320px. Every selector in it is language-agnostic on
purpose, so the same suite runs against either locale unchanged.

`.claude/shot.mjs [outDir] [url]` captures desktop and mobile screenshots the
same way.

Both hardcode the Windows Chrome path at the top — change `CHROME` if you run
them elsewhere.

## Structure

```
src/
  app/
    [lang]/
      layout.tsx    fonts, per-locale metadata, hreflang, JSON-LD
      page.tsx      section composition, loads the dictionary
    globals.css     Tailwind 4 theme + editorial type scale
  components/       Hero · Projects · About · PhotoMarquee · Reel · Contact
  lib/
    content.ts      names, links, project data, video ids, photo list
    i18n/           config.ts, en.ts, es.ts
  proxy.ts          sends / to a locale based on Accept-Language
public/images/      project screenshots, personal photos, OG card
```

Anything that reads the same in both languages, meaning names, links,
dimensions and product names, lives in `src/lib/content.ts`. Every sentence
lives in `src/lib/i18n/en.ts` and `es.ts`, keyed back to the ids used in
`content.ts`. Edit those two places, not the components.

## Languages

The site is published once per locale at `/en` and `/es`, both prerendered at
build time. `src/proxy.ts` reads `Accept-Language` and sends `/` to whichever
one fits, defaulting to English, so every link already in the wild keeps
working.

The switch in the hero meta bar is a plain link to the other locale rather
than a toggle. There is no client state, no stored preference and no extra
JavaScript. The two pages are separate static documents, each with its own
`<html lang>`, canonical URL and hreflang set, which is what makes the Spanish
version findable in search rather than merely reachable.

Adding a third language means listing it in `locales` in
`src/lib/i18n/config.ts`, writing its dictionary, and adding it to `LOCALES` in
`src/proxy.ts`. The `Dictionary` type turns a missing key into a build error
rather than a blank space on the page.

## The flag asset

`assets/personal-flag.svg` is the source: a 1.1MB colour auto-trace (1903
paths, 1656 near-identical fills, no viewBox). It lives outside `public/` on
purpose so it is never deployed - vector buys nothing for a mark shown at
40px, and it would have been larger than every other image on the site
combined.

`.claude/rasterize-flag.mjs` renders it down to the served asset: injects a
viewBox, rasterises via headless Chrome off a `file://` URL, flood-fills the
tracer's background to transparent so the swallow-tail fly reads against the
paper, and writes a 400px WebP (~27KB).

```bash
node .claude/rasterize-flag.mjs   # then re-run the PIL resize step
```

`[lang]/page.tsx` picks the first of `flagCandidates` that exists on disk, so
removing the asset simply removes the flag - no request, no broken image.

## Two things worth knowing

**Font variables must stay on `<html>`, not `<body>`.** The `@theme` font
stacks are `var(--font-anton)`-style references resolved on `:root`. A custom
property that fails substitution at `:root` inherits down as an empty string
rather than re-resolving further in the tree, so moving those classNames to
`<body>` silently drops every webfont to a system fallback.

**`@theme` is declared `static`.** Tailwind 4 tree-shakes theme variables it
doesn't see used in class names. The font stacks are only referenced from
custom utilities in `globals.css`, so without `static` they get pruned.

`verify.mjs` guards both.

## The social card

`public/images/og-image.jpg` is generated, not hand-made. `.claude/make-og.mjs`
renders it at 1200x630 through headless Chrome using the site's real webfonts,
so the card and the page never drift apart.

```bash
node .claude/make-og.mjs
```

Re-run it after changing the name, tagline or flag.

## Deploy

Auto-detected by Vercel — no configuration needed.

```bash
vercel
```

Absolute URLs for OG tags and JSON-LD come from `siteUrl` in `layout.tsx`,
which reads `NEXT_PUBLIC_SITE_URL`, then Vercel's own
`VERCEL_PROJECT_PRODUCTION_URL`, then falls back to localhost. Deploys are
correct with no configuration; set `NEXT_PUBLIC_SITE_URL` in the Vercel
dashboard once a custom domain points at the project.
