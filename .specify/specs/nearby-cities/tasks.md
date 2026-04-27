# Nearby Cities — Tasks

> Ordered by dependency. Complete top-to-bottom.
> Check off each task the moment it ships — not when "mostly done".

## Setup
- [ ] Confirm PM decision on two open questions in spec.md (radius = 2 500 km; show only during `phase === "watching"`)
- [ ] Verify no conflicts with V1 decisions (no auth, no cloud, no external API — confirmed clean)
- [ ] Review constitution.md performance targets (LCP, INP, city transition < 500ms)

## Implementation

### Utility function
- [ ] Add `getNearbyCities(origin: City, all: City[], maxCount?: number, radiusKm?: number): City[]` to `src/lib/cities.ts`
  - Implements Haversine formula inline (no new dependency)
  - Default `maxCount = 5`, default `radiusKm = 2500`
  - Excludes origin city from results
  - Returns cities sorted ascending by distance
  - Returns empty array (not null) when fewer than 2 results exist within radius
- [ ] Add `haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number` as a pure helper in same file (or `src/lib/utils.ts` if preferred for reuse)
- [ ] Add `formatNearbyDistance(km: number): string` helper — rounds to nearest 50 km below 1 000, nearest 100 km above
- [ ] TypeScript: `npx tsc --noEmit` passes after utility additions

### Component
- [ ] Build `src/components/hud/NearbyCitiesPanel.tsx`
  - Props: `currentCity: City`, `allCities: City[]`
  - Internal: `useMemo` to derive nearby list from props (no Zustand slice needed)
  - Renders nothing (returns `null`) when nearby list length < 2
  - Each chip: `<Flag>` component + city name + formatted distance
  - Each chip: `aria-label="Visit [city name], [distance] km away"`, min-height 44px
  - Wrapping `<nav aria-label="Nearby cities">`
  - On click: calls `useAppStore(s => s.selectCity)(city)` — triggers globe zoom
- [ ] Mobile layout (375px): single-row horizontal scroll strip, `overflow-x-auto`, no wrapping, chips do not overflow viewport
- [ ] Desktop layout (1440px): flex row, no scroll, max 5 chips inline, no overflow
- [ ] Chip styling: secondary weight — semi-transparent dark background, small text (`text-xs sm:text-sm`), consistent with HUD glass aesthetic
- [ ] Focus ring visible on keyboard navigation (`:focus-visible` ring)
- [ ] `npx tsc --noEmit` passes after component

### Integration into CityHUD
- [ ] Import `NearbyCitiesPanel` in `src/components/hud/CityHUD.tsx`
- [ ] Render `<NearbyCitiesPanel>` only when `phase === "watching"` — gated via `useAppStore(s => s.phase)`
- [ ] Position: inside the existing bottom-gradient area, above the city name row
- [ ] Tray visibility tied to existing HUD `hudVisible` state — no new timer, no new show/hide logic
- [ ] Pass `selectedCity` and the full `cities` array as props (cities is a static import, not Zustand state)
- [ ] Verify no layout shift (CLS) caused by tray appearing — use `min-h-0` / fixed height container if needed
- [ ] Manual check: CityHUD line count stays under 250 lines after addition; extract sub-components if breached

## Verification
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Manual test Tokyo → chips show Seoul, Shanghai, Beijing, Osaka, Taipei (or similar East Asia neighbours present in cities.json)
- [ ] Manual test a sparse city (e.g. Buenos Aires) — tray hidden if fewer than 2 results within 2 500 km
- [ ] Manual test mobile (375px) Chrome: horizontal scroll works, chips do not overflow, touch targets >= 44px
- [ ] Manual test desktop (1440px) Chrome: all chips visible inline, no scroll needed
- [ ] HUD auto-hide: tray disappears and reappears with the rest of the HUD chrome (4s timer)
- [ ] Chip tap: triggers globe zoom animation (selectCity, not selectCityDirect)
- [ ] Accessibility: keyboard tab navigates chips; aria-labels present; screen reader announces "Nearby cities" region
- [ ] Performance: Chrome DevTools confirm no new network requests; nearby computation not visible in Performance trace

## Post-Ship
- [ ] Update spec.md status → ✅ Shipped — v1.0 ([month])
- [ ] Log confirmed radius and phase-gate decisions in spec.md Resolved Decisions
- [ ] Check off all tasks above

## V2 (deferred)
- [ ] Globe arc overlays highlighting nearby cities when HUD is open (requires globe-navigation spec change)
- [ ] Nearby city chips on static `/walk/[slug]` SEO pages (server-rendered, different layout — separate spec)
- [ ] Vibe/tag filter on nearby chips
- [ ] Distance in user-selected unit (km / miles)
- [ ] Adjustable proximity radius
