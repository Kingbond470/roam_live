# Journey Detail Pages (/journeys + /journeys/[id])

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
Journeys need SEO-visible landing pages so users searching "virtual ancient cities tour" or "neon cities walk" can find Nearaway. Journey pages also serve as share targets — users can share a journey URL with friends.

## Acceptance Criteria
- [x] /journeys page: lists all journeys, city count stats, CTA to start on globe
- [x] /journeys/[id]: journey hero, city route (with step connectors), highlights, other journeys, start CTA
- [x] Deep-link: `/?journey=[id]` starts journey on globe (handled in page.tsx)
- [x] Unique metadata, canonical, OG per journey
- [x] ItemList JSON-LD on both pages
- [x] BreadcrumbList JSON-LD on /journeys/[id]
- [x] h-full overflow-y-auto container (not min-h-full)
- [x] Flag component (not emoji) for city flags in route list
- [x] Journey accentColor applied to badges, borders, stats, CTAs

## Resolved Decisions
- **Step connector UI**: Numbered circles + gradient lines between cities. Visual metaphor of a route reinforces the journey narrative.
- **"Journey Highlights" section**: Shows localTip from first 4 cities. Gives Google rich text content on the page beyond just a list of cities.
- **Start CTA → `/?journey=[id]`**: Drops user directly into the globe with that journey active — same as if they'd selected it from the JourneyPanel.
