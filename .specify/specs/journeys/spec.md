# Journeys (Thematic City Routes)

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
Discovering random cities is fun. But users who want a curated, themed experience — "take me through cities known for street food" — have no path. Journeys give structure to discovery, turning a session into a narrative.

## User Stories
- As a traveller, I want to follow a themed route through multiple cities, so that my exploration feels like a journey with a beginning and end
- As a traveller, I want to see where I am in a journey (e.g. "2 of 6"), so that I feel progression
- As a traveller, I want to exit a journey mid-way without losing my place in the route, so that I can explore freely and return
- As a traveller browsing the Journeys page, I want to preview which cities are in a journey, so that I can decide if it's for me before starting

## Acceptance Criteria
- [x] 5 journeys defined: Neon After Dark, Street Food Trail, Ancient Empires, Coastal Dreams, Music & Soul
- [x] Each journey has: id, name, emoji, tagline, citySlugOrder[], accentColor
- [x] JourneyPanel accessible from globe bottom bar "Journeys" button
- [x] Selecting a journey sets activePath in Zustand and navigates to first city
- [x] HUD shows journey badge with emoji + name + current position (e.g. "3/6")
- [x] Prev/Next arrows navigate within journey cities only (not all cities)
- [x] Journey ✕ button in HUD badge exits journey mode (sets activePath null)
- [x] Journey arcs rendered on globe surface when a journey is active
- [x] Static `/journeys` page lists all journeys (SEO)
- [x] Static `/journeys/[id]` page for each journey (SEO)
- [x] `/?journey=[id]` deep-link starts the journey on the globe

## Out of Scope (V1)
- User-created journeys
- Journey completion rewards / badges
- Journey progress persisted across sessions
- Collaborative journeys (shared with friends)
- More than 5 journeys at launch

## Resolved Decisions
- **accentColor per journey**: Used for globe arcs, HUD badge, and journey page theming. One colour per journey makes each feel distinct.
- **Journey progress not persisted**: activePath is session-only in Zustand (not in persist partialise). Resuming a journey requires re-selecting it. Acceptable for V1.
- **citySlugOrder not validated at build time**: If a slug doesn't exist in cities.json, the journey silently skips it. Should add a build-time validation script in V2.
