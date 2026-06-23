# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Preview Server

```bash
npx serve -l 3000 .
```

Serves the site at `http://localhost:3000`. The preview server ID in Claude Code sessions is tracked in `.claude/launch.json`. After CSS edits, add a cache-busting query string (`?v=N`) to the `<link rel="stylesheet">` tag in the relevant HTML file if the preview browser caches aggressively.

## Architecture

Pure HTML5/CSS3/Vanilla JS — no build step, no framework, no package.json.

**Pages:**
- `index.html` — homepage with hero, pillars, rotating "From the Field" slider, CTA banner, donors section
- `campaigns.html` — four campaigns (Binding Agreement, Extractive Justice, Corporate Accountability, Defending Defenders)
- `regions.html` — overview hub linking to 5 individual region pages
- `region-west.html`, `region-north.html`, `region-east.html`, `region-central.html`, `region-southern.html` — individual region pages, each with: regional anchor info, context, member orgs, publications section
- `about.html` — mission, why environmental rights, governance, secretariat, leaders
- `news.html` — resource hub (filterable: Stories, Case Studies, ERA Magazines, Opinion Pieces, External Resources)
- `story-dakar.html` — standalone article page (template for future stories)
- `join.html`, `contact.html`

**`css/styles.css`** — single stylesheet. Organized:
1. Google Fonts import
2. Design tokens (`:root`)
3. Reset & base
4. Layout primitives (`.l-header`, `.l-constrain`, `.l-section`, `.l-footer`)
5. Component blocks (`.c-*` prefix)
6. Utility classes (`.u-*`, `.t-*` typography)
7. Resource hub styles (`.c-hub-*`, `.c-resource-card`)
8. Rotating slider styles (`.c-field-slider`, `.c-field-slide`, `.c-field-dots`)
9. Region page styles (`.c-region-overview-grid`, `.c-region-hub-card`, `.c-member-org`)
10. Responsive breakpoints (`@media` at the bottom)
11. Animation keyframes and scroll-reveal classes

**`js/main.js`** — single script loaded on every page. Handles: mobile nav toggle, active nav link detection, contact form submit, smooth scroll, scroll-reveal via `IntersectionObserver`, stat count-up animation, navbar shadow on scroll.

Page-specific JS is inlined in `<script>` tags at the bottom of the relevant HTML file:
- `news.html` — resource hub category filtering (`.c-hub-filter` buttons toggle `data-category` card visibility)
- `index.html` — rotating slider (`setInterval` every 10s, toggles `.is-active` on `.c-field-slide` and `.c-field-dot`)

## Design Tokens

Key brand colors:
- `--color-forest: #1a3a0e` — primary dark green
- `--color-olive: #e0e69f` — accent/highlight (from ERA logo)
- `--color-terra: #b84d24` — terracotta CTA color

Fonts: `Playfair Display` (serif headlines), `Inter` (body), `Barlow Condensed` (labels/eyebrows).

Section themes applied via class on `<section>`: `.theme-forest`, `.theme-black`, `.theme-olive`, `.theme-light`, `.theme-default`.

## Page Header Images

Inner pages use `.c-page-header` with inline `background-image`, `background-size: cover`, `background-position: center`, and `background-blend-mode: multiply`. The CSS sets `background: rgba(26, 58, 14, 0.48)` as the blend base — adjust this opacity to control how much the image shows through (lower = more visible image).

## Resource Hub Content Model

New content cards go in `news.html` inside `#hubGrid`. Each card is a `<div class="c-resource-card [modifier]" data-category="[category]">`. Valid categories: `story`, `casestudy`, `newsletter`, `opinion`, `external`. External resources use `target="_blank" rel="noopener"` and display `.c-resource-card__ext-badge`. New stories with long-form content get their own HTML page (like `story-dakar.html`) and link from a card.

## Region Pages

Each `region-*.html` follows the same structure: page header → regional anchor section → regional context → member orgs grid → publications placeholder → CTA banner. The `regions.html` overview links to each via `.c-region-hub-card`. The secretariat info lives on `about.html#secretariat`, not on the regions pages.

## Animations

Scroll-reveal: `.js-reveal` / `.js-reveal-left` / `.js-reveal-scale` added by `main.js` on `DOMContentLoaded`, `.is-visible` toggled by `IntersectionObserver` (threshold 0.12). Hero content uses CSS keyframe `fadeSlideUp` on page load. Stat count-up fires when `.c-billboard__stats` enters the viewport.

## Responsive Layout

Breakpoints: `1024px`, `768px`, `480px`. Inline two-column grids use utility class names (`l-grid-2col`, `l-grid-contact`, `l-grid-article`, `l-grid-3col`) so they can be overridden with `!important` in media queries — always add the class name alongside any inline `style="display:grid"`. The hero stats bar is `position: static` on mobile.

## Navigation Pattern

All pages share identical header/footer HTML. When updating nav links (e.g. adding a new region page), update all HTML files. The Regions dropdown links to individual `region-*.html` pages; the About ERA dropdown includes `#secretariat`. The utility bar shows only Contact + Facebook icon (no "Join the Movement").

## Deployment

GitHub repo: `https://github.com/danielngayflor/ERA-Website-Project`  
Deployed via Vercel (auto-deploys on push to `main`).
