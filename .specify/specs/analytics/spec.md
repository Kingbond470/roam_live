# Analytics & Performance Monitoring

## Status
✅ Shipped — v1.0 (2026-04)

## Acceptance Criteria
- [x] Vercel Analytics: page views, unique visitors, top pages, referrers, countries
- [x] Vercel Speed Insights: LCP, CLS, INP per page from real users
- [x] Plausible Analytics: privacy-first fallback (no cookies, no GDPR banner needed)
- [x] All three load via `strategy="afterInteractive"` — do not block LCP

## V1 Data Decisions — DOCUMENTED
> No user tracking IDs. No cookies set by Nearaway.
> Plausible is cookieless by design.
> Vercel Analytics is cookieless by default on Hobby plan.
> No cookie consent banner required under current data collection scope.

## Resolved Decisions
- **Three analytics tools**: Vercel Analytics (product metrics), Speed Insights (Core Web Vitals for SEO), Plausible (privacy-first alternative, already set up before Vercel). Keeping all three — different audiences (PM vs engineer vs privacy-conscious).
- **afterInteractive strategy**: Analytics must never delay LCP. All scripts deferred.
