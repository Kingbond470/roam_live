# Culture Card

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
A city walk shows you what a place looks like. Culture Card shows you what it feels like — the greeting, the food, the customs, the origin story. It turns a passive viewing experience into active learning.

## User Stories
- As a traveller, I want to read cultural highlights about a city while watching the walk, so that I understand not just what I'm seeing but why it matters
- As a traveller, I want to see the local greeting, must-eat foods, and local tips, so that I could actually navigate this city if I visited
- As a traveller, I want to read the city's origin story, so that I feel the historical depth behind what I'm watching
- As a traveller, I want the card to slide up without leaving the video, so that I stay immersed while learning

## Acceptance Criteria
- [x] Card slides up from bottom as a bottom sheet over the video
- [x] Tapping the city name in HUD opens the card
- [x] Card shows: greeting, best season, must-eat (pill chips), local tip, fun fact
- [x] Card shows origin story if `city.origin` exists (era badge, founded date, founders, story)
- [x] Card shows cultural dos and don'ts (emerald / rose colour-coded)
- [x] Card is scrollable for cities with long content
- [x] Tap outside or swipe down dismisses the card
- [x] Flag image shown in card header

## Out of Scope (V1)
- AI-generated cultural content (Claude API stub exists, not activated)
- User-contributed cultural tips
- "Save" specific cultural facts
- Translation of greeting into user's language

## Resolved Decisions
- **Static JSON over live Claude API**: Claude API stub was built (`src/app/api/culture/route.ts`) but hardcoded data ships first. Live AI generation adds latency and cost. Deferred to V2.
- **Bottom sheet over modal/page**: Keeps user in the video context. Full-page navigation would break the immersion loop.
