# Culture Card — Technical Plan

## Architecture
```
HomeClient.tsx (cardOpen state from Zustand)
  └── CultureCard.tsx
        └── Flag.tsx
```

## Animation
Framer Motion `AnimatePresence` + slide-up:
```tsx
initial={{ y: "100%" }}
animate={{ y: 0 }}
exit={{ y: "100%" }}
transition={{ type: "spring", damping: 30, stiffness: 300 }}
```

## Key Files
| File | Role |
|---|---|
| `src/components/cards/CultureCard.tsx` | Full card layout and content |
| `src/app/api/culture/route.ts` | Claude API stub (returns city.culture from JSON; live call commented) |

## Data Source
`city.culture` object from `cities.json`:
```ts
culture: {
  greeting: string
  bestSeason: string
  mustEat: string[]
  localTip: string
  funFact: string
  culturalDos: string[]
  culturalDonts: string[]
}
city.origin?: {
  founded: string
  founders: string
  era: string
  story: string
  originalName?: string
}
```

## Claude API Stub
`/api/culture/[slug]` route exists. Currently returns `city.culture` from JSON.
When activated, it will call Anthropic SDK to generate enriched cultural content.
Activation requires: API key in env, rate limiting, caching layer.
