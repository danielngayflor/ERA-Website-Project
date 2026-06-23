# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Preview Server

```bash
npx serve -l 3000 .
```

Serves the site at `http://localhost:3000`. The preview server ID in Claude Code sessions is tracked in `.claude/launch.json`. After CSS edits, add a cache-busting query string (`?v=N`) to the `<link rel="stylesheet">` tag in the relevant HTML file if the preview browser caches aggressively.

## Architecture

Pure HTML5/CSS3/Vanilla JS — no build step, no framework, no package.json.

**7 pages:** `index.html`, `campaigns.html`, `regions.html`, `about.html`, `news.html`, `join.html`, `contact.html`

**`css/styles.css`** — single stylesheet for the entire site. Organized in this order:
1. Google Fonts import
2. Design tokens (CSS custom properties in `:root`)
3. Reset & base
4. Layout primitives (`.l-header`, `.l-constrain`, `.l-section`, `.l-footer`)
5. Component blocks (`.c-*` prefix)
6. Utility classes (`.u-*`, `.t-*` typography)
7. Responsive breakpoints (`@media` at the bottom)
8. Animation keyframes and scroll-reveal classes (`.js-reveal`, `.js-stagger`)

**`js/main.js`** — single script loaded on every page. Handles: mobile nav toggle, active nav link detection, contact form submit, smooth scroll, scroll-reveal via `IntersectionObserver`, stat count-up animation, and navbar shadow on scroll.

## Design Tokens

Key brand colors:
- `--color-forest: #1a3a0e` — primary dark green
- `--color-olive: #e0e69f` — accent/highlight (from ERA logo)
- `--color-terra: #b84d24` — terracotta CTA color

Fonts: `Playfair Display` (serif headlines), `Inter` (body), `Barlow Condensed` (labels/eyebrows).

Section themes applied via class on `<section>`: `.theme-forest`, `.theme-black`, `.theme-olive`, `.theme-light`, `.theme-default`.

## Animations

Scroll-reveal works by adding `.js-reveal` / `.js-reveal-left` / `.js-reveal-scale` classes to elements in `main.js` on `DOMContentLoaded`, then toggling `.is-visible` via `IntersectionObserver`. Hero content animates via CSS keyframes on page load (no JS needed). Stat count-up fires when `.c-billboard__stats` enters the viewport.

## Responsive Layout

Breakpoints: `1024px`, `768px`, `480px`. Inline two-column grids across pages use utility classes (`l-grid-2col`, `l-grid-contact`, `l-grid-article`, `l-grid-3col`) so they can be collapsed in the `@media (max-width: 768px)` block. The hero stats bar is `position: static` on mobile (not `absolute`) to prevent overlap.

## Deployment

GitHub repo: `https://github.com/danielngayflor/ERA-Website-Project`  
Deployed via Vercel (auto-deploys on push to `main`).
