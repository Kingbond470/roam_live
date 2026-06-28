# Nearaway

Free virtual city walk platform. Explore 96 cities across 41 countries on an interactive 3D globe — no account, no passport required.

**Live**: [nearaway.in](https://nearaway.in)

---

## What it is

Nearaway streams immersive 4K street-level walking tour videos from cities worldwide. Users land on a spinning globe, click any city, and the video starts. No friction, no login wall, no ads.

Core loop: **Globe → City → Walk**. Everything else (journeys, comparisons, culture cards) extends that loop without breaking it.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | React 19 |
| Styling | Tailwind v4 (`@theme inline` token system) |
| Animation | Framer Motion 12 |
| State | Zustand 5 |
| Globe | globe.gl (Three.js) |
| Video | YouTube IFrame API |
| Search | Fuse.js |
| Analytics | Vercel Analytics + Speed Insights |
| OG images | @vercel/og |
| Deploy | Vercel (main branch → production) |

---

## Content scale

- **96 cities** across 41 countries, 5 continents
- **233 videos** (avg 2.4 per city)
- **5 curated journeys** (Neon After Dark, Street Food Trail, Ancient Empires, Coastal Dreams, Music & Soul)
- **41 country pages**, 5 continent pages, 24+ curated city comparison pages

---

## Project structure

```
src/
├── app/                        Next.js App Router
│   ├── page.tsx                Home — server component, renders HomeClient
│   ├── HomeClient.tsx          Globe app orchestrator (client)
│   ├── walk/[slug]/            City walk pages (96 static pages, SEO)
│   ├── continent/[continent]/  Continent pages (5 pages, SEO)
│   ├── country/[slug]/         Country pages (41 pages, SEO)
│   ├── journeys/               Journey list + 5 detail pages (SEO)
│   ├── compare/[pair]/         City comparison pages (SEO)
│   ├── about/                  About page
│   ├── sitemap.ts              Dynamic XML sitemap
│   ├── robots.ts               robots.txt
│   ├── not-found.tsx           404 page
│   └── error.tsx               500 page
├── components/
│   ├── globe/                  GlobeScene, GlobeLoader
│   ├── hud/                    CityHUD, LiveBadge, LocalClock, ViewerCount, ShareButton, VideoScrubber
│   ├── video/                  CityVideoPlayer, VideoSwitcher, YouTubeFacade, YouTubeInline, BufferingOverlay, VideoLoadingScreen
│   ├── cards/                  CultureCard
│   ├── search/                 CitySearch (Fuse.js fuzzy)
│   ├── journey/                JourneyPanel
│   ├── wow/                    SplitScreen, ComparePicker
│   ├── onboarding/             MilestoneToast, CoachMark, PWAInstallPrompt
│   └── ui/                     Flag (country flag image component)
├── store/
│   └── appStore.ts             Zustand — all client state lives here
├── data/
│   ├── cities.json             96 cities with videos, culture data, coordinates
│   └── journeys.ts             5 journey definitions (id, name, emoji, tagline, citySlugOrder)
├── lib/
│   ├── cities.ts               City helpers (getCityBySlug, countryToSlug, getCitiesByContinent, etc.)
│   ├── utils.ts                getTimeAwareVideo, getFeaturedVideo, getMoodLabel
│   └── cityOfTheDay.ts         Deterministic daily city selection (date-seeded)
└── types/
    └── city.ts                 City, Video, Culture TypeScript types

.specify/
├── constitution.md             Project non-negotiables (read before any task)
└── specs/                      Feature specs (spec.md + plan.md + tasks.md per feature)
```

---

## Design system

Tailwind v4 `@theme inline` in `src/app/globals.css` defines all tokens.

### Colours

| Token | Value | Use |
|---|---|---|
| `bg-void` | `#050508` | Page background |
| `text-ember` / `bg-ember` | `#f59e0b` | Accent — numbers, CTAs, wordmark only |
| `bg-surface-1` | `rgba(255,255,255,0.03)` | Card backgrounds |
| `border-surface-border` | `rgba(255,255,255,0.08)` | Card borders |

**Amber scarcity rule**: `text-ember` reserved for stats numbers, CTA buttons, and the wordmark. Section labels, icons, and secondary text use `text-white/30` or lower — not amber. This keeps the accent meaningful.

### Typography

| Token | Value | Use |
|---|---|---|
| `font-display` | Lora (serif, via Next/Font) | Page titles, hero H1s |
| `font-sans` | Inter (default) | All body text |

Display headings use `font-display font-normal` — Lora's weight carries itself, no bold needed.

### Spacing & layout

- Nav height: `h-16` (64px) fixed across all pages
- Static pages: `h-full overflow-y-auto` — body is `overflow-hidden`, never `min-h-screen`
- Max content width: `max-w-4xl` or `max-w-5xl` depending on page density

---

## SEO architecture

Every public page is a **server component** with full metadata.

### Structured data per page type

| Page | JSON-LD schemas |
|---|---|
| `/walk/[slug]` | VideoObject, TouristAttraction, BreadcrumbList, FAQPage |
| `/journeys/[id]` | ItemList, BreadcrumbList |
| `/continent/[c]` | CollectionPage, ItemList, BreadcrumbList, FAQPage |
| `/country/[slug]` | CollectionPage, ItemList, BreadcrumbList |
| `/compare/[pair]` | BreadcrumbList |

### On-page signals

- **H1**: `{City} Virtual Walk` — primary keyword phrase, not bare city name
- **Title**: city-first format — `Tokyo Virtual Walk — Free 4K Tour | Nearaway`
- **Descriptions**: funFact first sentence + city-specific hook
- **Intro copy**: population, video count, localTip injected for unique content per city
- **Internal links**: walk → journey, country → journey, continent → journey (link equity flow)

### Sitemap

`src/app/sitemap.ts` uses `CONTENT_DATE` (stable string) not `new Date()`. Bump `CONTENT_DATE` manually after significant content changes — prevents crawl budget waste from false "modified" signals on every rebuild.

---

## Development

```bash
npm install
npm run dev        # localhost:3000
npm run typecheck  # tsc --noEmit — must pass before commit
npm run build      # production build
```

### Before every commit

```bash
npx tsc --noEmit   # zero errors required
```

### Adding a city

1. Add entry to `src/data/cities.json` following the existing schema
2. No code changes needed — all pages generate from `cities.json`
3. Bump `CONTENT_DATE` in `src/app/sitemap.ts`

### Adding a journey

1. Add entry to `src/data/journeys.ts`
2. `citySlugOrder` must contain valid slugs from `cities.json` (not validated at build time — verify manually)

---

## Key conventions

### Flag images

Always use `<Flag countryCode={} flagEmoji={} size={} />` — never raw emoji. Windows renders flag emoji as text codes, not images.

### State

All client state in `src/store/appStore.ts`. No prop-drilling beyond 2 levels. New state slices go in `appStore.ts`.

### URL helpers

`countryToSlug(country)` — `country.toLowerCase().replace(/\s+/g, "-")` — used for `/country/[slug]` URLs. Import from `@/lib/cities`.

### Components

Target ≤ 250 lines per component. Extract sub-components if longer.

### V1 decisions (don't change without a spec)

| Decision | Detail |
|---|---|
| `favoriteSlugs` | localStorage only — cloud sync requires auth |
| `playerMuted` | persists in localStorage, intentional |
| Viewer counts | simulated — no real-time infra |
| Culture API route | stubbed — returns `cities.json` data |
| Journey progress | session-only, not persisted |

---

## Deployment

Branch `main` deploys directly to production on Vercel. No staging branch.

```bash
git push origin main   # triggers Vercel production deploy
```

TypeScript check runs at build time — broken types will fail the deploy.

---

## Branding

- Product name: **Nearaway** (not NearAway, not Roam.Live)
- Domain: **nearaway.in**
- Tone: cinematic, calm, curious — not corporate, not gamified

---

## Spec workflow

Feature work follows the `.specify/` system:

```
.specify/
├── constitution.md    read first — non-negotiables
└── specs/[feature]/
    ├── spec.md        what + why + acceptance criteria
    ├── plan.md        technical architecture (Tier 1 only)
    └── tasks.md       ordered task checklist
```

Tier system: Tier 1 (auth, payments, new data models) → full spec required. Tier 2 (new pages, major UX) → spec.md + tasks.md. Tier 3 (bugs, copy, SEO metadata) → implement directly.

```bash
npm run spec:new [feature-name]   # scaffold spec directory
```
