# Nearaway — Claude Code Instructions

> This file is read automatically by Claude Code at the start of every session.
> It tells Claude how to work on this project. Do not delete it.

---

## Project Identity

- **Product**: Nearaway — a free virtual city walk platform
- **Domain**: nearaway.in
- **Stack**: Next.js 16 App Router, TypeScript strict, Tailwind v4, Framer Motion, Zustand, globe.gl, YouTube IFrame API, Vercel
- **Repo**: d:/Github_Project/Roam_Live
- **Branch**: main (deploy directly — no staging branch)

---

## Before You Start Any Task

1. **Read the constitution** → `.specify/constitution.md`
   It contains performance targets, SEO rules, code standards, stack constraints, and branding rules. Every decision must be consistent with it.

2. **Find the relevant spec** → `.specify/specs/[feature-name]/spec.md`
   If a spec exists for the feature being modified, read it before touching code. The spec contains the *why* behind current decisions — changing code without reading the spec often causes regressions.

3. **Check if a new spec is needed**
   Use the Feature Tier system from the constitution:
   - Tier 1 (auth, payments, new data models, API integrations) → full spec required before implementation
   - Tier 2 (new pages, major UX) → spec.md + tasks.md before implementation
   - Tier 3 (bugs, copy, polish) → no spec, implement directly

---

## Project Structure

```
src/
├── app/                    Next.js App Router pages
│   ├── page.tsx            Home (server) → renders HomeClient
│   ├── HomeClient.tsx      Main app orchestrator (client)
│   ├── walk/[slug]/        City walk static pages (SEO)
│   ├── continent/[c]/      Continent pages (SEO)
│   ├── country/[slug]/     Country pages (SEO)
│   ├── journeys/           Journeys list + detail pages (SEO)
│   ├── compare/[pair]/     City comparison static pages (SEO)
│   └── about/              About page
├── components/
│   ├── globe/              GlobeScene, GlobeLoader
│   ├── hud/                CityHUD, LiveBadge, LocalClock, ViewerCount, ShareButton
│   ├── video/              CityVideoPlayer, BufferingOverlay, VideoLoadingScreen
│   ├── cards/              CultureCard
│   ├── search/             CitySearch
│   ├── journey/            JourneyPanel
│   ├── wow/                SplitScreen, ComparePicker
│   ├── onboarding/         MilestoneToast, CoachMark, PWAInstallPrompt
│   └── ui/                 Flag (country flag image component)
├── store/
│   └── appStore.ts         Zustand state machine — ALL app state lives here
├── data/
│   ├── cities.json         City data (62 cities, hardcoded)
│   └── journeys.ts         Journey route definitions (5 journeys)
├── lib/
│   ├── cities.ts           City helper functions
│   ├── utils.ts            getTimeAwareVideo, getFeaturedVideo, getMoodLabel
│   └── cityOfTheDay.ts     Deterministic daily city selection
└── types/
    └── city.ts             City, Video, Culture TypeScript types

.specify/
├── constitution.md         Project non-negotiables (READ FIRST)
├── templates/              Spec templates for new features
│   ├── spec-template.md
│   ├── plan-template.md
│   └── tasks-template.md
├── scripts/                Spec workflow automation
│   └── new-spec.sh
└── specs/                  One directory per feature
    ├── globe-navigation/
    ├── city-video-player/
    ├── city-hud/
    ├── culture-card/
    ├── city-search/
    ├── saved-cities/
    ├── journeys/
    ├── split-screen-compare/
    ├── onboarding/
    ├── discover-mode/
    ├── video-switcher/
    ├── static-walk-pages/
    ├── continent-country-pages/
    ├── journey-detail-pages/
    ├── seo-infrastructure/
    └── analytics/
```

---

## Critical Non-Negotiables (summary — full version in constitution.md)

| Rule | Detail |
|---|---|
| **TypeScript** | Strict mode. `npx tsc --noEmit` must pass before every commit |
| **SEO** | Every new page needs: title, description, canonical, OG, JSON-LD |
| **Server rendering** | Content pages must be server components. No client-only content pages. |
| **Flag images** | Use `<Flag countryCode={} flagEmoji={} size={} />` — never raw emoji. Windows renders emoji as text codes. |
| **Scroll** | Static pages use `h-full overflow-y-auto` — body is `overflow-hidden`. Never `min-h-full`. |
| **State** | All state in `appStore.ts` (Zustand). No prop-drilling beyond 2 levels. |
| **Branding** | Product = "Nearaway". Domain = "nearaway.in". Never "Nearaway.in" as the product name. |
| **Commits** | Always include `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` |

---

## Known V1 Decisions (do not "fix" these without a spec)

- `favoriteSlugs` — localStorage only. Cloud sync requires auth (not built yet).
- `playerMuted` — persists in localStorage. Intentional.
- Viewer counts — simulated. Real-time infra not built.
- Claude API culture route — stubbed. Returns cities.json data. Live AI generation deferred.
- Journey progress — session only (not persisted). Intentional V1 decision.
- citySlugOrder in journeys — not validated at build time. Known gap.

---

## How to Write a New Spec

```bash
# Run the scaffold script
bash .specify/scripts/new-spec.sh <feature-name>

# Then fill in the generated files:
# .specify/specs/<feature-name>/spec.md   ← what + why + user stories + criteria
# .specify/specs/<feature-name>/plan.md   ← technical architecture
# .specify/specs/<feature-name>/tasks.md  ← ordered task checklist
```

Templates are in `.specify/templates/`.

---

## Definition of Done

Before marking any task complete:
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Tested on mobile (375px) and desktop (1440px)
- [ ] New pages have metadata + canonical + JSON-LD
- [ ] Committed and pushed to main
- [ ] Relevant spec updated (tasks checked off, decisions logged)
