# City Video Player

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
The core Nearaway experience is watching a city walk. The player must feel immersive — fullscreen, no YouTube chrome, no branding competing with the city. It must handle buffering gracefully and mute by default (autoplay policy on browsers).

## User Stories
- As a traveller, I want the city walk to start playing automatically when I enter a city, so that the experience feels seamless
- As a traveller, I want the video to be fullscreen with no YouTube chrome, so that I feel immersed in the city
- As a traveller, I want to mute/unmute with a single tap, so that I can control audio without disrupting the experience
- As a traveller, I want to see a loading state while the video buffers, so that I know something is happening
- As a traveller, I want time-aware video selection (morning walk vs night walk), so that what I watch matches how I feel right now

## Acceptance Criteria
- [x] YouTube IFrame embeds fullscreen behind all overlays
- [x] `autoplay=1` via IFrame API, muted by default (browser autoplay policy)
- [x] Mute/unmute persists across cities (Zustand `playerMuted` persisted)
- [x] `modestbranding=1`, `rel=0`, `controls=0` — no YouTube chrome
- [x] Buffering overlay shown while player state = BUFFERING
- [x] `getTimeAwareVideo()` selects video based on user's local hour (morning/day/golden-hour/night)
- [x] Featured video fallback if no time-match found
- [x] Player registers `toggleMute` function in Zustand so HUD button can control it
- [x] `video-fadein` phase fades in player smoothly; `video-fadeout` fades it out
- [x] Start playback at 90s offset (skip intro/credits on most walks)

## Out of Scope (V1)
- Custom video hosting (YouTube dependency accepted for V1)
- Progress bar / scrubber (deferred — VideoScrubber component exists but not exposed in HUD)
- Picture-in-picture mode
- Offline/cached video playback

## Resolved Decisions
- **YouTube IFrame API over direct embed**: IFrame API gives programmatic control (mute, play, pause, state events) that plain iframes don't
- **Muted by default**: Required by all modern browsers for autoplay. Unmute requires explicit user gesture.
- **Start at 90s**: Most 4K walks have 30–90s of intro/logo. Skipping gives immediate city immersion.
- **Time-aware selection**: Uses *user's* local hour, not the city's timezone — matches how the user feels right now
