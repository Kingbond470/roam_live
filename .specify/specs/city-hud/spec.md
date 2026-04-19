# City HUD (Heads-Up Display)

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
While watching a city walk, users need contextual controls (back, mute, share, navigate) and city identity (name, flag, clock) without these elements competing with the video. The HUD must feel cinematic — present when needed, invisible when not.

## User Stories
- As a traveller, I want the HUD to auto-hide so that I can watch the walk without UI distraction
- As a traveller, I want to see the city name, flag, and local time at a glance, so that I feel contextually grounded
- As a traveller, I want prev/next navigation arrows always accessible (even when HUD hides), so that I can move between cities without tapping to reveal the HUD first
- As a traveller watching a Journey, I want to see which stop I'm on (e.g. "3/6"), so that I know my place in the route
- As a traveller on mobile, I want the layout to be usable with one thumb, so that I can navigate comfortably

## Acceptance Criteria
- [x] HUD auto-hides after 4 seconds of no interaction
- [x] Any mouse move or touch resets the 4s timer and reveals HUD
- [x] Top bar: Back button, Heart (save), Mute, Compare picker, Share
- [x] Bottom: city name (responsive text size), flag image, country, local clock, video count
- [x] Prev/Next nav arrows always visible (faint when HUD hidden, bright when shown)
- [x] Journey badge shows journey name + emoji + current position (e.g. "🌙 Neon After Dark · 2/6")
- [x] Journey badge has ✕ to exit journey mode
- [x] LIVE badge + viewer count shown
- [x] Bottom gradient vignette always visible (for text legibility)
- [x] Heart button fills rose when city is saved
- [x] City name truncates gracefully on small screens
- [x] Flag rendered via Flag component (not emoji — Windows compatibility)

## Out of Scope (V1)
- Gesture swipe (left/right) for city navigation
- Video progress scrubber in HUD (component built but not exposed)
- HUD customisation (user can't pin/unpin elements)

## Resolved Decisions
- **Auto-hide delay = 4000ms**: Tested at 3s (too aggressive) and 5s (too sluggish). 4s balanced.
- **Persistent faint arrows when hidden**: Critical discovery — users were stranded without knowing they could navigate. Faint arrows = persistent affordance.
- **Flag component over emoji**: Windows renders flag emoji as country codes ("IN", "JP"). flagcdn.com images proxied via Next.js Image solve this universally.
- **City name text sizing `text-2xl sm:text-4xl md:text-6xl`**: Responsive sizing prevents overflow on long city names (e.g. "Rio de Janeiro") on mobile.
