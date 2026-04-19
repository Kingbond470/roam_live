# City Search — Technical Plan

## Key Files
| File | Role |
|---|---|
| `src/components/search/CitySearch.tsx` | Search overlay, input, results list |
| `src/store/appStore.ts` | `searchOpen`, `openSearch()`, `closeSearch()` |

## Fuse.js Configuration
```ts
const fuse = new Fuse(cities, {
  keys: [
    { name: "name", weight: 0.6 },
    { name: "country", weight: 0.3 },
    { name: "continent", weight: 0.1 },
  ],
  threshold: 0.4,  // fuzzy tolerance
  includeScore: true,
});
```

## State
`searchOpen: boolean` in Zustand. Overlay renders conditionally in HomeClient.
Results are local component state (not persisted).

## Keyboard Support
- Arrow Up/Down: move selection
- Enter: selectCity(results[selectedIndex])
- ESC: closeSearch()
