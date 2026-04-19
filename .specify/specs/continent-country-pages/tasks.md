# Continent & Country Pages — Tasks

- [x] Build /continent/[continent]/page.tsx with generateStaticParams
- [x] Build /country/[slug]/page.tsx with generateStaticParams
- [x] Add CONTINENT_META (display, description, hero text) map
- [x] Add COUNTRY_TAGLINES map (descriptive one-liner per country)
- [x] Continent: city grid, country pills, journey cross-links, stats block
- [x] Country: hero flag, tagline, city cards, must-eat aggregate, related countries
- [x] Add CollectionPage JSON-LD to both pages
- [x] Add BreadcrumbList JSON-LD (Home > Continent for continent; Home > Continent > Country for country)
- [x] Fix all raw flagEmoji → Flag component (continent city grid, country pills, hero flag)
- [x] Fix h-full overflow-y-auto (was min-h-full — pages not scrollable)
- [x] Add canonical URLs to both page types
- [x] getCitiesByContinent / getCitiesByCountry helper functions in lib/cities.ts
- [x] countryToSlug helper for URL generation
