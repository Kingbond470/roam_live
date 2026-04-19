# Split Screen Compare

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
Travel decisions are comparative. "Should I go to Tokyo or Seoul?" Users want to experience both cities side-by-side, not sequentially. Split-screen compare is the feature that makes Nearaway genuinely useful for travel planning — not just exploration.

## User Stories
- As a traveller deciding between two cities, I want to watch both walks simultaneously side-by-side, so that I can directly compare the feel of each place
- As a traveller, I want to pick the second city from a picker, so that I can compare any combination
- As a traveller, I want to see cultural summary cards for both cities, so that I can compare facts alongside the visual experience
- As a traveller who just compared two cities, I want to share or revisit the comparison, so that I can come back or show others

## Acceptance Criteria
- [x] Split-screen icon in HUD top bar opens ComparePicker
- [x] ComparePicker lets user select any city as the comparison city
- [x] SplitScreen component renders two video players side by side
- [x] Both videos play simultaneously (both muted by default)
- [x] Cultural info panels below each video (or inline)
- [x] Static `/compare/[pair]` page for SEO (e.g. `/compare/tokyo-vs-paris`)
- [x] Static compare pages generated for: same-country pairs + 24 curated cross-country pairs
- [x] Shareable URL for each comparison pair
- [x] Both cities' flags rendered via Flag component

## Out of Scope (V1)
- Audio mixing (one city audio at a time)
- More than 2 cities at once
- Side-by-side cultural score / "winner" designation
- User-voting on which city is better

## Resolved Decisions
- **Static pages for compare pairs**: Same-country comparisons + 24 curated cross-country pairs. Not all-vs-all (62×61/2 = 1891 pairs is too many for static generation). Curated pairs cover the highest-intent searches.
- **`tokyo-vs-paris` slug format**: Alphabetically ordered to avoid duplicate `/tokyo-vs-paris` and `/paris-vs-tokyo` pages. generateStaticParams enforces order.
- **Both videos muted**: Browser autoplay requires mute. Playing both with audio would be chaotic even if allowed.
