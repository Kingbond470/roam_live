# City Search

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
With 62 cities across 5 continents, users who know where they want to go need a direct path. The globe is for discovery; search is for intent.

## User Stories
- As a traveller, I want to type a city name and jump to it instantly, so that I don't have to scroll or filter the globe to find a specific city
- As a traveller, I want fuzzy search that handles typos, so that "Tokio" still finds Tokyo
- As a traveller, I want results to also match by country, so that I can type "Japan" and find Tokyo

## Acceptance Criteria
- [x] Search overlay opens from globe with a search icon button or keyboard shortcut
- [x] Fuzzy search via Fuse.js across city name + country + continent
- [x] Results appear as user types (no submit required)
- [x] Selecting a result calls selectCity() — same flow as tapping a globe pin
- [x] ESC or click-outside closes search
- [x] Empty state shows "No cities found" when no match
- [x] Keyboard navigable (arrow keys + enter)

## Out of Scope (V1)
- Search by cultural feature (e.g. "beach cities")
- Voice search
- Search history / recents
- Server-side search for future cities beyond client bundle size

## Resolved Decisions
- **Fuse.js client-side**: City count (62) is small enough that client-side fuzzy search is instantaneous and avoids a round-trip. Will revisit if cities exceed ~500.
- **Search fields**: `name` (weight 0.6), `country` (weight 0.3), `continent` (weight 0.1)
