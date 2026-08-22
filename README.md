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

`.claude/verify.mjs` is a 33-check regression suite that drives real headless
Chrome over CDP. It needs no npm packages — Node 22's built-in `WebSocket` and
`fetch` do the work.

```bash
npm run build
npx next start -p 3000
node .claude/verify.mjs
```

It covers fonts, metadata, project links, the lazy-loaded reel, image
dimensions, scroll motion, keyboard focus, tap-target sizes, and horizontal
overflow at 1440 / 390 / 320px.

`.claude/shot.mjs` captures desktop and mobile screenshots the same way.

Both hardcode the Windows Chrome path at the top — change `CHROME` if you run
them elsewhere.

## Structure

```
src/
  app/
    layout.tsx      fonts, metadata, JSON-LD
    globals.css     Tailwind 4 theme + editorial type scale
    page.tsx        section composition
  components/       Hero · Projects · About · PhotoMarquee · Reel · Contact
  lib/content.ts    all copy, project data, video ids, photo list
public/images/      project screenshots, personal photos, OG card
```

All copy and project data lives in `src/lib/content.ts` — edit there, not in
the components.

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

## Deploy

Auto-detected by Vercel — no configuration needed.

```bash
vercel
```
