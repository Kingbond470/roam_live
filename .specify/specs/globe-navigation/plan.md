# Globe Navigation — Technical Plan

## Architecture

```
src/app/page.tsx (server)
  └── HomeClient.tsx (client orchestrator)
        ├── GlobeScene.tsx (dynamic import, SSR-off)
        │     └── globe.gl instance
        └── appStore.ts (Zustand state machine)
```

## State Machine
`appStore.ts` owns all phase transitions:
```
idle → zooming → video-fadein → watching → video-fadeout → globe-return → idle
```
- `selectCity(city)` → sets phase = "zooming"
- `advanceToVideo()` → zooming → video-fadein (called after zoom animation completes)
- `setWatching()` → video-fadein → watching (called after player ready)
- `returnToGlobe()` → watching → video-fadeout
- `completeReturn()` → video-fadeout → idle, clears selectedCity

## Key Files
| File | Role |
|---|---|
| `src/app/HomeClient.tsx` | Full app orchestrator — renders globe + overlays based on phase |
| `src/components/globe/GlobeScene.tsx` | globe.gl wrapper, pin rendering, click handlers |
| `src/components/globe/GlobeLoader.tsx` | Loading state while globe.gl initialises |
| `src/store/appStore.ts` | State machine + all actions |
| `src/lib/cityOfTheDay.ts` | Deterministic daily city selection |

## Globe.gl Configuration
- `new Globe(element)` constructor pattern (not callable)
- Custom pin HTML elements for each city (flagEmoji + name label)
- Programmatic camera zoom using `.pointOfView()` with animation duration
- `autoRotate` stops on `mouseenter`/`touchstart`, resumes after 3s idle

## Filter Implementation
- `activeTag: string | null` in Zustand
- `favoriteSlugs: string[]` persisted in localStorage
- GlobeScene receives filtered city list as prop; re-renders pins on change
- Filter pills in bottom bar update `activeTag` via `setTagFilter()`

## Performance Decisions
- Globe uses `dynamic` import with `loading` skeleton to avoid blocking initial HTML
- City data (`cities.json`) is embedded at build time — no runtime API call for pin data
- Pin count is bounded by city count (62) — no virtualisation needed
