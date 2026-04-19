# Journeys — Tasks

- [x] Define Journey interface and journeys[] data (journeys.ts)
- [x] Build JourneyPanel component (journey picker from globe)
- [x] Add activePath: Journey | null to Zustand
- [x] Add setActivePath() action
- [x] Wire "Journeys" button in globe bottom bar to open JourneyPanel
- [x] Implement journey-aware navigation in CityHUD (navigateCity uses pathCities)
- [x] Show journey badge in HUD (emoji + name + position counter)
- [x] Add ✕ button on badge to setActivePath(null)
- [x] Render journey arc lines on globe when activePath active
- [x] Build static /journeys page with all journeys listed
- [x] Build static /journeys/[id] page with city route + rich content
- [x] Add generateStaticParams for all journey IDs
- [x] Support /?journey=[id] deep-link in page.tsx
- [x] Add ItemList + BreadcrumbList JSON-LD to journey pages
- [x] Journey badge max-w-[100px] truncate for long names on mobile

## V2 Tasks
- [ ] Validate citySlugOrder slugs at build time
- [ ] Persist active journey progress across sessions
- [ ] User-created journeys (Tier 1 spec required)
- [ ] Journey completion celebration
