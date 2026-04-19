# City Video Player — Technical Plan

## Architecture
```
HomeClient.tsx
  └── CityVideoPlayer.tsx
        ├── YouTube IFrame API (window.YT)
        ├── BufferingOverlay.tsx
        └── VideoLoadingScreen.tsx
```

## YouTube IFrame API Integration
- Loaded globally in `layout.tsx` via `<Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive">`
- `window.onYouTubeIframeAPIReady` callback initialises player instance
- Player state events: `onReady`, `onStateChange` (BUFFERING=3, PLAYING=1, PAUSED=2)
- `player.mute()` / `player.unMute()` called via registered Zustand action `registerToggleMute`

## Key Files
| File | Role |
|---|---|
| `src/components/video/CityVideoPlayer.tsx` | IFrame API wrapper, player lifecycle |
| `src/components/video/BufferingOverlay.tsx` | Spinner shown during BUFFERING state |
| `src/components/video/VideoLoadingScreen.tsx` | Full-screen loader before player ready |
| `src/lib/utils.ts` | `getTimeAwareVideo()`, `getFeaturedVideo()` |

## Mute Architecture
Player's `toggleMute` function is registered in Zustand:
```ts
registerToggleMute: (fn) => set({ _togglePlayerMute: fn })
toggleMute: () => { _togglePlayerMute?.(); set({ playerMuted: !playerMuted }) }
```
This decouples the HUD button (which only knows Zustand) from the player (which controls the IFrame).

## Time-Aware Video Selection
```
5am–8am  → "morning"
9am–4pm  → "day"  
5pm–7pm  → "golden-hour"
8pm–4am  → "night"
```
Falls back to `isFeatured` → `videos[0]`.

## Embed Parameters
```
autoplay=1&mute=1&rel=0&modestbranding=1&controls=0&start=90&enablejsapi=1
```
