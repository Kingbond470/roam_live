# City Video Player — Tasks

- [x] Integrate YouTube IFrame API via global Script tag in layout.tsx
- [x] Build CityVideoPlayer component with IFrame API lifecycle
- [x] Implement mute/unmute via registerToggleMute pattern
- [x] Add BufferingOverlay on BUFFERING player state
- [x] Add VideoLoadingScreen before player ready
- [x] Implement getTimeAwareVideo() with 4 time buckets
- [x] Set autoplay + muted + no-chrome embed parameters
- [x] Set start=90 offset on embed URL
- [x] Wire video phase transitions (video-fadein → watching → video-fadeout)
- [x] Persist playerMuted across sessions via Zustand persist middleware
