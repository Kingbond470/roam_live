# City HUD — Technical Plan

## Architecture
```
HomeClient.tsx
  └── CityHUD.tsx
        ├── LiveBadge.tsx
        ├── ViewerCount.tsx
        ├── LocalClock.tsx
        ├── ShareButton.tsx
        └── Flag.tsx (via ui/)
```

## Auto-Hide Timer
```ts
const HUD_HIDE_DELAY = 4000;
const timerRef = useRef<ReturnType<typeof setTimeout>>();

const resetTimer = useCallback(() => {
  setHudRevealed(true);
  clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => setHudRevealed(false), HUD_HIDE_DELAY);
}, []);

useEffect(() => {
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("touchstart", resetTimer);
  return () => { /* cleanup */ };
}, [isVisible, resetTimer]);
```

## Key Files
| File | Role |
|---|---|
| `src/components/hud/CityHUD.tsx` | Main HUD layout and auto-hide logic |
| `src/components/hud/LiveBadge.tsx` | Animated "LIVE" red dot badge |
| `src/components/hud/ViewerCount.tsx` | Simulated viewer count per city |
| `src/components/hud/LocalClock.tsx` | Live clock in city's timezone |
| `src/components/hud/ShareButton.tsx` | Native share or clipboard fallback |

## Layer Structure (z-index)
- Video player: z-10
- Bottom vignette gradient: z-20
- HUD container: z-40 (pointer-events-none, children opt-in)
- Culture card: z-50
- Search overlay: z-60

## Journey-Aware Navigation
```ts
const pathCities = activePath
  ? activePath.citySlugOrder.map(slug => allCities.find(c => c.slug === slug)).filter(Boolean)
  : null;
const navCities = pathCities ?? allCities;
```
When a journey is active, prev/next navigate within `pathCities` only.

## Mobile Layout Decision
Prev/Next arrows are positioned inline with city info block (not as separate full-width row).
This keeps thumb zone reachable and avoids double-row layout on small screens.
