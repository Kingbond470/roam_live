# SEO Infrastructure

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
A great product is invisible without organic search. Nearaway's content (62 cities, 5 continents, 5 journeys) needs to be discoverable. SEO infrastructure ensures every page is indexable, every schema is machine-readable, and Google understands what Nearaway is.

## Acceptance Criteria

### Sitemap
- [x] `/sitemap.xml` auto-generated via Next.js `sitemap.ts`
- [x] Covers: homepage, /about, /journeys, /journeys/[id], /continent/[x], /country/[slug], /walk/[slug], /compare/[pair]
- [x] City walk URLs include `images[]` (YouTube thumbnail) for Google Image/Video indexing
- [x] Priority weights: homepage=1.0, city walks=0.9, continent=0.85, journeys=0.8, countries=0.75, compare=0.55
- [x] Submitted to Google Search Console

### Robots
- [x] `/robots.txt` via Next.js `robots.ts`
- [x] Allows all, disallows `/api/`
- [x] Declares sitemap URL for both www and non-www
- [x] `host: nearaway.in` signals canonical domain

### Structured Data (JSON-LD)
- [x] **Global** (layout.tsx): Organization, WebSite (with SearchAction)
- [x] **Homepage** (page.tsx): FAQPage (5 questions about Nearaway)
- [x] **Walk pages**: VideoObject, TouristAttraction, BreadcrumbList, FAQPage
- [x] **Continent pages**: CollectionPage, BreadcrumbList
- [x] **Country pages**: CollectionPage, BreadcrumbList
- [x] **Journey pages**: ItemList, BreadcrumbList
- [x] **Journey list page**: ItemList
- [x] **Compare pages**: WebPage, TouristAttraction

### Canonicals
- [x] `metadataBase: new URL("https://nearaway.in")` in root layout
- [x] `alternates.canonical` on every page
- [x] Root layout canonical: `https://nearaway.in`

### Verification
- [x] Google Search Console: `<meta name="google-site-verification">` via `metadata.verification.google`
- [x] Both www and non-www properties added in GSC

### Flag Images (Googlebot Fix)
- [x] Flag.tsx uses Next.js `<Image>` (not raw `<img>`)
- [x] Images proxied via `/_next/image` — Googlebot accesses via nearaway.in domain
- [x] flagcdn.com in `next.config.ts` remotePatterns

## Resolved Decisions
- **www vs non-www**: Canonical is `nearaway.in` (non-www). Both properties registered in GSC. `host` directive in robots.txt.
- **JSON-LD in body not head**: Google accepts JSON-LD in `<body>`. Next.js renders layout scripts before `{children}` — effectively first in body, valid for crawlers.
- **FAQPage on homepage**: Organization + WebSite schemas don't generate rich results. FAQPage added to homepage to make it eligible for FAQ rich snippets in Google SERPs.
- **flagcdn.com blocked by Googlebot**: Raw `<img>` fetched flagcdn.com directly — blocked. Fix: Next.js `<Image>` proxies through `/_next/image` on nearaway.in domain.
