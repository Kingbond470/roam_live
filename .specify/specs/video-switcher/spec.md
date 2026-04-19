# Video Switcher

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
Cities like Tokyo have walks at dawn, midday, golden hour, and midnight — completely different vibes. A single "featured" video undersells the depth. The video switcher lets users choose their mood without changing city.

## User Stories
- As a traveller in Tokyo, I want to pick between a morning walk and a night walk, so that I can match the vibe to how I feel
- As a traveller, I want to see a label for each video (e.g. "After Dark", "No Crowds"), so that I know what I'm choosing before I switch

## Acceptance Criteria
- [x] Film icon in HUD bottom row shows video count; tap opens VideoSwitcher
- [x] VideoSwitcher shows all videos for the current city with mood labels
- [x] Mood labels derived from `timeOfDay` + `type` via `getMoodLabel()`
- [x] Selecting a video calls `setActiveVideo(id)` and closes switcher
- [x] Active video highlighted in switcher list
- [x] Switcher only shown if city has > 1 video

## Out of Scope (V1)
- Transition animation between videos (hard cut accepted)
- User rating individual videos
- Recommended video based on weather or time of day at user's location

## Resolved Decisions
- **getMoodLabel() utility**: Translates `timeOfDay` ("morning", "night", "golden-hour", "day") + `type` ("bike", "guided", "landmark", "walk") into human-readable pill labels like "No Crowds", "After Dark", "Adventure".
- **Film icon count**: Shows video count inline in HUD to hint at the switcher without requiring an extra button.
