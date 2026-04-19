# Globe Navigation

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
Users need a visceral, spatial way to discover and select cities. A flat list or grid loses the "world is the product" feeling. The globe is the hero — it must feel alive, fast, and cinematic from first load.

## User Stories
- As a traveller, I want to spin a 3D globe and tap any city to enter it, so that exploring feels like opening a map, not using an app
- As a traveller, I want city pins to show directly on the globe, so that I can see the world and make spatial connections between cities
- As a traveller, I want the globe to zoom into my selected city, so that the transition into the walk feels like a journey, not a page load
- As a traveller, I want to filter cities by continent or vibe, so that I can narrow discovery without losing the spatial context
- As a traveller, I want a "City of the Day" suggestion, so that I don't have to decide if I'm browsing with no destination in mind

## Acceptance Criteria
- [x] 3D globe renders using globe.gl on first load, SSR-safe (dynamic import, no hydration errors)
- [x] City pins visible on globe surface, each clickable
- [x] Selecting a city triggers: zoom animation → video fade-in → watching state
- [x] ESC key or Back button returns to globe from any city
- [x] Continent filter (Asia, Europe, Americas, Africa, Oceania) filters visible pins
- [x] Vibe filter pills ("Neon Cities", "Ancient", "Coastal", etc.) filter by tag
- [x] Saved/Favorites filter shows only hearted cities
- [x] City of the Day is computed deterministically from the date (same city all day for all users)
- [x] Globe auto-rotates when idle; stops on hover/touch
- [x] State machine: idle → zooming → video-fadein → watching → video-fadeout → globe-return → idle

## Out of Scope (V1)
- User-contributed city pins
- Animated arcs between cities (except Journey path arcs)
- Globe heatmap by popularity
- Night/day shading on globe surface

## Resolved Decisions
- **globe.gl over Three.js direct**: globe.gl abstracts the WebGL complexity while still allowing custom shaders on pins. Lower maintenance burden.
- **SSR-safe via dynamic import**: globe.gl requires `window` — wrapped in `next/dynamic` with `ssr: false`
- **City of the Day via date hash**: deterministic, no DB call, same result for all users simultaneously
