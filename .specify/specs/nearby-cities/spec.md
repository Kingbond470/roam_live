# Nearby Cities

## Status
🔲 Draft

## Problem
When a user is watching a city walk — say, Tokyo — they have no spatial context about which other cities they could visit next. The only navigation options available are the global prev/next arrows (which cycle through all 62 cities in an arbitrary order) or backing out to the globe entirely. Both break the feeling of being somewhere. A user exploring East Asia shouldn't need to return to a full-globe view just to jump to Seoul or Shanghai. Showing geographically close cities that are actually in the catalogue lets the user feel the world as connected space, not a disconnected list — and keeps the exploration momentum alive.

## User Stories
- As a curious traveller watching Tokyo, I want to see which other cities are nearby on the map, so that I can continue exploring the same region without breaking my immersion
- As a mobile user, I want to tap a nearby city chip with one thumb, so that I can jump to it from within the video view without navigating back to the globe
- As a traveller discovering a region, I want to see the flag and distance of nearby cities, so that I can build a mental map of where I am in the world
- As a casual explorer, I want nearby cities to appear subtly — not block the video — so that the walk remains the focus

## Acceptance Criteria

### Core behaviour
- [ ] When a city is active (phase = "watching"), a "Nearby Cities" tray shows up to 5 geographically closest cities that exist in `cities.json`
- [ ] Proximity is computed using the Haversine formula on `city.coordinates` — no external geocoding API
- [ ] The tray shows only cities that are within a reasonable radius; if fewer than 2 cities exist within that radius the tray is hidden entirely (avoids awkward single-item lists)
- [ ] Tapping a nearby city chip calls `selectCity()` (globe zoom animation), matching the existing city-selection UX
- [ ] Each chip shows: flag image (via `<Flag>` component, not emoji), city name, and approximate distance in km
- [ ] Distance is shown rounded to the nearest 50 km for cities under 1 000 km; rounded to nearest 100 km above that (keeps it casual, not GPS-precise)

### UI / Placement
- [ ] Tray is positioned in the bottom area of the HUD, above the city name bar, and respects existing safe area insets
- [ ] Tray auto-hides / auto-shows with the same 4-second HUD timer already in CityHUD (shares the same visibility state, no new timer)
- [ ] On mobile (375px): chips scroll horizontally; no wrapping; tray is a single-row scroll strip
- [ ] On desktop (1440px): all chips visible inline with no scroll, max 5 chips, no overflow
- [ ] Touch target per chip >= 44px tall (WCAG / P3 mobile-first)
- [ ] Chips are visually distinct from the main city controls — lighter weight, smaller text — so the video remains the hero (P2)

### Performance
- [ ] Proximity computation is pure JS (no network call); runs in < 5ms for 62 cities
- [ ] Nearby cities are computed once when `selectedCity` changes; result memoised (useMemo or derived in the component)
- [ ] No new npm dependency; Haversine is ~8 lines of math

### Accessibility
- [ ] Each chip has an `aria-label="Visit [city name], [distance] km away"`
- [ ] Tray has `aria-label="Nearby cities"` as a landmark
- [ ] Focus ring visible on keyboard navigation

## Out of Scope (V1)
- Showing nearby cities on the globe as arc overlays or highlighted pins (globe-navigation concern, separate spec)
- Sorting/filtering nearby chips by vibe/tag (adds cognitive load; distance alone is clear enough)
- Showing nearby cities on the static `/walk/[slug]` pages — those are server-rendered SEO pages with a different layout; this is a live walk feature only
- Distance in miles (single locale; km is universal at this product stage)
- Caching computed nearby lists to localStorage (62-city computation is trivially fast)
- Adjustable radius slider (P1 — no friction; sensible default covers real user need)

## Open Questions

### Brand Fit Check
- Q: Does a "Nearby Cities" tray conflict with Nearaway's "cinematic, calm, curious" brand (P2 — world is the product)?
  A: **Passes with conditions.** Geographic adjacency is a natural, map-like mental model — it mirrors how a real traveller thinks ("if I'm in Tokyo, what else is nearby?"). It reinforces spatial curiosity rather than gamifying it. There are no counters, rankings, or achievement mechanics. The only risk is if the tray visually competes with the video. This is managed by: (a) sharing the HUD auto-hide timer so the tray disappears with the rest of the chrome, (b) styling chips as light, low-contrast secondary elements, and (c) keeping the tray beneath the existing city name bar rather than overlaying the video centre. **PM sign-off recorded here: nearby is on-brand provided the UI conditions above are met. No further decision needed before implementation.**

### Unresolved
- Q: What radius defines "nearby"? A natural default is ~2 500 km (covers most regional clusters — e.g. Tokyo → Seoul is ~1 300 km; Tokyo → Shanghai is ~1 750 km). But the current 62-city catalogue has uneven density: East Asia is dense, South America is sparse. A radius cap may leave South American cities with zero nearby results. → **Proposed resolution**: use radius = 2 500 km, but if fewer than 2 results exist, silently hide the tray (already in Acceptance Criteria). Revisit if catalogue grows to 150+ cities. → A: (pending PM confirmation of 2 500 km default)

- Q: Should the tray be visible during phase = "video-fadein" (the few seconds before `watching`)? Showing it too early may cause a layout jump. → **Proposed resolution**: only render when `phase === "watching"`. → A: (pending PM confirmation)

## Resolved Decisions
- **Haversine, not a geocoding API**: Zero latency, zero cost, zero dependency. Accuracy is sufficient for "nearby" UX — we don't need road distance, just straight-line.
- **Flag via `<Flag>` component**: Windows renders flag emoji as letter codes ("JP", "KR"). Consistent with every other Nearaway component.
- **Shares HUD auto-hide timer**: Adding a separate hide/show cycle for the tray would create a visual desync with the rest of the HUD chrome. One timer governs all transient UI.
- **selectCity() on chip tap (with globe zoom), not selectCityDirect()**: Preserves the spatial "flying to" animation that gives Nearaway its cinematic feel. The half-second zoom is worth keeping even from within the walk.
- **No state slice needed**: Nearby city list is derived data (computed from `selectedCity.coordinates` + `cities`). It lives as a `useMemo` in the component — no Zustand changes required.
- **Max 5 chips**: More than 5 chips on mobile forces horizontal scroll beyond comfortable thumb reach. 5 is enough to show regional richness without cognitive overload.
