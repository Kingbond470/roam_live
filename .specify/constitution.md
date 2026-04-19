# Nearaway — Project Constitution

> This document governs every feature built on Nearaway. It establishes non-negotiables before any spec is written or any code is committed. All contributors — human or AI — must read this first.

---

## 1. Product Identity

| Attribute | Value |
|---|---|
| **Product name** | Nearaway |
| **Domain** | nearaway.in |
| **Tagline** | A window to every place on Earth |
| **Mission** | Democratise travel experience for people who can't physically travel |
| **Tone** | Cinematic, calm, curious — never corporate, never aggressive |
| **Target user** | Anyone with a browser and curiosity about the world |

---

## 2. Product Principles

### P1 — Zero friction
No account. No download. No paywall. A user who lands on nearaway.in must be exploring a city within 3 seconds. Every feature that adds a step before that moment must justify itself with exceptional value.

### P2 — The world is the product
Cities are the content. Code is the frame. Avoid UI chrome that competes with the video. The globe and the walk should feel like windows, not interfaces.

### P3 — Mobile is primary
Over 70% of travel browsing happens on mobile. Every layout decision is made mobile-first. Desktop is enhancement.

### P4 — SEO is a growth channel
Every city, country, continent, and journey is a landing page. Organic search is the primary acquisition channel. No feature that breaks server-rendering ships without explicit sign-off.

### P5 — Cultural respect
City data (greetings, food, customs, dos/don'ts) must be accurate and respectful. Never stereotype. Data quality is a product requirement, not a content afterthought.

### P6 — Decisions leave a trace
Every architectural decision, product trade-off, and V1 deferral is documented in the relevant spec. "We'll figure it out later" is not acceptable without a written record of the decision.

---

## 3. Technical Standards

### Performance
| Metric | Target | Measurement |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Vercel Speed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | Vercel Speed Insights |
| INP (Interaction to Next Paint) | < 200ms | Vercel Speed Insights |
| Globe initial load | < 3s on 4G | Chrome DevTools throttle |
| City navigation transition | < 500ms perceived | Manual test |

### SEO
- Every page must be **server-rendered** (Next.js App Router, no client-only pages for content)
- Every page must have a unique `<title>`, `<meta description>`, and `<link rel="canonical">`
- Every page must have OpenGraph + Twitter card metadata
- Structured data (JSON-LD) required on all content pages
- Sitemap must include all routes within 24h of a new city/journey being added

### Accessibility
- WCAG 2.1 AA minimum
- All interactive elements must have keyboard focus states
- All images must have meaningful `alt` text (not empty, not "image")
- Colour contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text

### Code Quality
- **TypeScript strict mode** — no `any`, no `as unknown as X`
- **No console.log in production** — use structured logging if needed
- **No inline styles** except for dynamic values (colours from data, computed positions)
- **No new runtime dependencies** without TL review — keep bundle lean
- Components must be ≤ 250 lines; extract if longer
- State lives in Zustand (`appStore.ts`); no prop-drilling beyond 2 levels

### Stack Constraints
| Layer | Choice | Locked? |
|---|---|---|
| Framework | Next.js 16 App Router | Yes |
| Language | TypeScript 5, strict | Yes |
| Styling | Tailwind v4 | Yes |
| Animation | Framer Motion 12 | Yes |
| State | Zustand 5 + persist middleware | Yes |
| Globe | globe.gl | Yes |
| Video | YouTube IFrame API | Yes |
| Hosting | Vercel | Yes |
| Analytics | Vercel Analytics + Speed Insights + Plausible | Yes |
| Search | Fuse.js | Yes |
| Flag images | flagcdn.com via Next.js Image proxy | Yes |

---

## 4. Data Standards

### City Data (`cities.json`)
Every city must have all of these fields before it ships:
- `slug`, `name`, `country`, `countryCode`, `continent`, `coordinates`
- `flagEmoji`, `timezone`
- `culture`: `greeting`, `bestSeason`, `mustEat[]`, `localTip`, `funFact`, `culturalDos[]`, `culturalDonts[]`
- `origin`: `founded`, `founders`, `era`, `story`, `originalName?`
- `videos[]`: at least 1 featured video with `youtubeId`, `isFeatured: true`

### V1 Decisions (explicit, documented)
- `favoriteSlugs` are **localStorage-only** — cloud sync deferred to post-auth
- `playerMuted` persists across sessions — user preference, not session state
- Viewer counts are **simulated** — real-time infra deferred
- Claude API culture route is **stubbed** — live AI generation deferred

---

## 5. Branding Standards

| Usage | Correct | Incorrect |
|---|---|---|
| Product name | Nearaway | NearAway, NEARAWAY, Roam.Live |
| Domain reference | nearaway.in | Nearaway.in (as product name) |
| Logo text | `Near` + amber `away` | Any other colour split |
| Twitter handle | @nearawayin | |

---

## 6. Feature Tiers (when to write a spec)

| Tier | Examples | Spec required |
|---|---|---|
| **1 — Full spec** | Auth, payments, user data, new data models, API integrations, features changing the core loop | Yes — all 3 files (spec, plan, tasks) |
| **2 — Lightweight spec** | New page types, major UX changes, new content verticals, new journey | spec.md + tasks.md |
| **3 — No spec** | Bug fixes, copy changes, flag fixes, SEO metadata updates, visual polish | No |

---

## 7. Definition of Done

A feature is **done** when:
- [ ] All acceptance criteria in `spec.md` are met
- [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [ ] No new ESLint warnings introduced
- [ ] Tested on mobile (375px) and desktop (1440px) manually
- [ ] SEO metadata verified for any new pages
- [ ] Committed and pushed to `main`
- [ ] spec.md, plan.md, tasks.md updated to reflect final state

---

*Last updated: 2026-04-19 | Authors: Mausam Singh (SPM), Claude (TL)*
