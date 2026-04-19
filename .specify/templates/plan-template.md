# [Feature Name] — Technical Plan

> Written after spec.md is approved. Describes *how* to build it.

## Architecture Diagram
```
<!-- ASCII diagram showing component tree and data flow -->
src/app/...
  └── ComponentA.tsx
        ├── ComponentB.tsx
        └── store/featureSlice.ts
```

## Key Files
| File | Role |
|---|---|
| `src/components/...` | ... |
| `src/store/appStore.ts` | State — add: ... |
| `src/lib/...` | ... |

## State Changes
<!-- What gets added to appStore.ts?
     New state fields, new actions, persist changes. -->
```ts
// New state fields
fieldName: Type;

// New actions
actionName: (param: Type) => void;
```

## Data Model
<!-- Any changes to cities.json schema, journeys.ts, or new data files -->
```ts
interface NewType {
  field: string;
}
```

## API / External Dependencies
<!-- New endpoints, third-party services, environment variables needed -->
- Endpoint: `GET /api/...` — returns ...
- Env var: `NEXT_PUBLIC_...` — used for ...

## Decisions Log
<!-- Technical choices made during planning. -->
- **Chose X over Y**: because ...
- **Deferred Z**: will revisit when ...

## Performance Considerations
<!-- How does this affect LCP, bundle size, CLS? -->
- ...

## SEO Considerations
<!-- New pages need: title, description, canonical, OG, JSON-LD -->
- New routes: `/...`
- JSON-LD schemas needed: ...
