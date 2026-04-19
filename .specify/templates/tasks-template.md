# [Feature Name] — Tasks

> Ordered by dependency. Complete top-to-bottom.
> Check off each task as it ships — not when it's "mostly done".

## Setup
- [ ] Create spec + plan + tasks files in .specify/specs/[feature]/
- [ ] Review constitution.md for relevant constraints

## Implementation
<!-- Group tasks by layer: data → state → components → pages → SEO -->

### Data / Schema
- [ ] ...

### State (appStore.ts)
- [ ] Add `...` to AppState interface
- [ ] Implement `...()` action

### Components
- [ ] Build `src/components/.../FeatureName.tsx`
- [ ] Wire to Zustand store
- [ ] Test on mobile (375px) and desktop (1440px)

### Pages (if new routes)
- [ ] Create `src/app/.../page.tsx`
- [ ] Add generateStaticParams (if dynamic)
- [ ] Add metadata (title, description, canonical, OG, Twitter)
- [ ] Add JSON-LD structured data

### SEO
- [ ] Update sitemap.ts with new routes
- [ ] Verify canonical URLs

## Verification
- [ ] `npx tsc --noEmit` passes
- [ ] Manual test: mobile + desktop
- [ ] Rich Results Test (if new JSON-LD added)

## Post-Ship
- [ ] Update spec.md status → ✅ Shipped
- [ ] Check off tasks in this file
- [ ] Log any new decisions in spec.md Resolved Decisions

## V2 Tasks (deferred)
<!-- Tasks explicitly deferred from V1 scope -->
- [ ] ...
