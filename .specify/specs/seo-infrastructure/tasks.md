# SEO Infrastructure — Tasks

- [x] Build sitemap.ts with all route types
- [x] Add images[] (YouTube thumbnails) to city walk routes in sitemap
- [x] Build robots.ts (allow all, disallow /api/, declare sitemap)
- [x] Add host directive and www+non-www sitemap URLs to robots.ts
- [x] Add metadataBase to root layout
- [x] Add alternates.canonical to root layout
- [x] Add alternates.canonical to every static page
- [x] Add Organization JSON-LD to root layout
- [x] Add WebSite + SearchAction JSON-LD to root layout
- [x] Add FAQPage JSON-LD to homepage (page.tsx)
- [x] Add VideoObject + TouristAttraction JSON-LD to walk pages
- [x] Add BreadcrumbList JSON-LD to walk, continent, country, journey pages
- [x] Add FAQPage JSON-LD to walk pages (auto-generated from city.culture)
- [x] Add ItemList JSON-LD to journeys list + journey detail pages
- [x] Add CollectionPage JSON-LD to continent and country pages
- [x] Add Google Search Console verification meta tag
- [x] Submit sitemap in Google Search Console
- [x] Fix flagcdn.com Googlebot errors: switch Flag from <img> to Next.js <Image>
- [x] Add flagcdn.com to next.config.ts remotePatterns
- [x] Fix about page: add canonical, fix title to "Nearaway" not "Nearaway.in"
- [x] Add Vercel Analytics + Speed Insights to layout

## Monitoring (ongoing)
- [ ] Check GSC Coverage report weekly — watch for "Excluded" → "Valid" movement
- [ ] Check Core Web Vitals in GSC + Vercel Speed Insights
- [ ] Test Rich Results in Google Rich Results Test after each deploy
- [ ] Request indexing for new city pages when added
