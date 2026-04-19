# Static City Walk Pages (/walk/[slug])

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
The globe experience is JavaScript-heavy and not crawlable as a content page. For organic search, every city needs a dedicated, server-rendered landing page that Google can index, rank, and display in rich results.

## User Stories
- As someone searching "Tokyo virtual walking tour", I want to find a Nearaway page in Google results, so that I can discover the platform through search
- As a user on the walk page, I want to see the city's culture highlights, origin story, dos/don'ts, and a way to jump into the live globe, so that the static page is valuable on its own

## Acceptance Criteria
- [x] Route: `/walk/[slug]` generated statically for all 62 cities
- [x] Unique `<title>`, `<meta description>`, `<link rel="canonical">` per city
- [x] OpenGraph + Twitter card metadata per city
- [x] YouTube embed (lazy-loaded, autoplay=0 for crawlability)
- [x] City header with Flag component (not emoji)
- [x] Culture grid: greeting, best season, must-eat, local tip
- [x] Origin story section (if city.origin exists)
- [x] Fun fact with ShareButton
- [x] Cultural dos and don'ts
- [x] "More cities" section linking to related walk pages (internal linking)
- [x] CTA button: "Explore {city} on Nearaway" → `/?city={slug}`
- [x] JSON-LD: VideoObject + TouristAttraction + BreadcrumbList + FAQPage
- [x] Images in sitemap (YouTube thumbnail for each city)

## Out of Scope (V1)
- User reviews / ratings on walk pages
- "Add to itinerary" CTA
- Multiple language versions of the page

## Resolved Decisions
- **CTA text "on Nearaway" not "in Nearaway.in"**: Product name is Nearaway; domain is nearaway.in. CTAs use product name.
- **FAQPage schema auto-generated from city data**: Best time, must-eat, fun fact, greeting — all pulled from `city.culture`. No manual FAQ writing needed.
- **Flag component not emoji**: Windows doesn't render flag emoji. flagcdn.com images proxied via Next.js Image component.
- **YouTube thumbnail in sitemap**: `images[]` field added to city routes in sitemap.ts. Helps Google Video indexing.
