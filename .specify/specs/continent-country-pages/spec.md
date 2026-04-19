# Continent & Country Pages

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
Users searching "virtual tours in Japan" or "cities to visit in Europe" need category-level landing pages, not just individual city pages. Continent and country pages create an SEO taxonomy that captures mid-funnel intent and builds topical authority for Nearaway.

## User Stories
- As someone searching "virtual tour Europe", I want a page that shows all European cities on Nearaway, so that I can browse and pick one
- As someone searching "Japan virtual walk", I want a Japan page that highlights Tokyo and other Japanese cities, so that I can explore the country virtually
- As a user on a city walk page, I want to navigate to the continent or country page, so that I can discover nearby cities

## Acceptance Criteria
- [x] `/continent/[continent]` pages for: Asia, Europe, Americas, Africa, Oceania
- [x] `/country/[slug]` pages for every country represented in cities.json
- [x] Continent page: hero stats (city count, country count, video count), city grid, country pills, related journeys, continent footer links
- [x] Country page: hero flag (Flag component), hero tagline, city cards, must-eat aggregate, related countries
- [x] Both pages: unique metadata, canonical URL, CollectionPage JSON-LD, BreadcrumbList JSON-LD
- [x] Flag component (not emoji) on all city/country references
- [x] h-full overflow-y-auto container (not min-h-full — body is overflow-hidden)
- [x] Internal links: continent → countries → walks (bidirectional)

## Resolved Decisions
- **"Americas" continent slug**: URL is `/continent/americas`, display is "The Americas". Stored as "Americas" in city data to match.
- **Country slug from country name**: `countryToSlug(country)` = `country.toLowerCase().replace(/\s+/g, "-")`. "South Korea" → "south-korea".
- **h-full not min-h-full**: Body has `overflow-hidden`. Pages must use `h-full overflow-y-auto` or content clips. Discovered via bug — all static pages had this issue initially.
- **getUniqueCountries() doesn't return countryCode**: Returns `{country, slug, flagEmoji, continent}`. For related countries, use `cities.find(c => c.country === country)?.countryCode` as fallback.
