import { MetadataRoute } from "next";
import { cities, getUniqueCountries } from "@/lib/cities";
import { journeys } from "@/data/journeys";
import { getFeaturedVideo } from "@/lib/utils";

const BASE = "https://nearaway.in";
const CONTINENTS = ["asia", "europe", "americas", "africa", "oceania"];

// Stable date — updated manually when content changes significantly.
// Do NOT use new Date() here: every rebuild would mark all pages as "just modified",
// wasting crawl budget and diluting recrawl signals for pages that actually changed.
const CONTENT_DATE = new Date("2025-06-24");
const STATIC_DATE  = new Date("2025-04-01");

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: CONTENT_DATE, changeFrequency: "weekly",   priority: 1.0 },
    { url: `${BASE}/journeys`,    lastModified: CONTENT_DATE, changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE}/about`,       lastModified: STATIC_DATE,  changeFrequency: "monthly",  priority: 0.6 },
  ];

  // Journey pages
  const journeyRoutes: MetadataRoute.Sitemap = journeys.map((j) => ({
    url: `${BASE}/journeys/${j.id}`,
    lastModified: CONTENT_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Continent pages
  const continentRoutes: MetadataRoute.Sitemap = CONTINENTS.map((c) => ({
    url: `${BASE}/continent/${c}`,
    lastModified: CONTENT_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Country pages
  const countryRoutes: MetadataRoute.Sitemap = getUniqueCountries().map(({ slug }) => ({
    url: `${BASE}/country/${slug}`,
    lastModified: CONTENT_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // City walk pages — include YouTube thumbnail as image for Google Image/Video indexing
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => {
    const featured = getFeaturedVideo(city);
    const thumbnailUrl = featured
      ? `https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`
      : undefined;

    return {
      url: `${BASE}/walk/${city.slug}`,
      lastModified: CONTENT_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: thumbnailUrl ? [thumbnailUrl] : undefined,
    };
  });

  // Compare pages — same-country + curated cross-country pairs
  const comparePairs = new Set<string>();

  const byCountry: Record<string, string[]> = {};
  for (const city of cities) {
    if (!byCountry[city.country]) byCountry[city.country] = [];
    byCountry[city.country].push(city.slug);
  }
  for (const slugs of Object.values(byCountry)) {
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        comparePairs.add(`${slugs[i]}-vs-${slugs[j]}`);
      }
    }
  }

  const slugSet = new Set(cities.map((c) => c.slug));
  const curatedPairs = [
    ["tokyo", "new-york"], ["paris", "rome"], ["tokyo", "seoul"],
    ["dubai", "singapore"], ["london", "paris"], ["new-york", "chicago"],
    ["istanbul", "athens"], ["barcelona", "lisbon"], ["berlin", "prague"],
    ["amsterdam", "copenhagen"], ["miami", "los-angeles"], ["tokyo", "hong-kong"],
    ["new-york", "london"], ["paris", "amsterdam"], ["rome", "athens"],
    ["dubai", "cairo"], ["tokyo", "bangkok"], ["berlin", "vienna"],
    ["istanbul", "cairo"], ["seoul", "singapore"], ["sydney", "tokyo"],
    ["barcelona", "rome"], ["london", "amsterdam"], ["miami", "new-york"],
  ];
  for (const [a, b] of curatedPairs) {
    if (slugSet.has(a) && slugSet.has(b)) comparePairs.add(`${a}-vs-${b}`);
  }

  const compareRoutes: MetadataRoute.Sitemap = [...comparePairs].map((pair) => ({
    url: `${BASE}/compare/${pair}`,
    lastModified: STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  return [
    ...staticRoutes,
    ...journeyRoutes,
    ...continentRoutes,
    ...countryRoutes,
    ...cityRoutes,
    ...compareRoutes,
  ];
}
