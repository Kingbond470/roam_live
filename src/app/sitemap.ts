import { MetadataRoute } from "next";
import { cities, getUniqueCountries } from "@/lib/cities";
import { journeys } from "@/data/journeys";

const CONTINENTS = ["asia", "europe", "americas", "africa", "oceania"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://roam.live";
  const now = new Date();

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,               lastModified: now, changeFrequency: "daily",  priority: 1.0 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/journeys`, lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  // Individual journey pages (5)
  const journeyRoutes: MetadataRoute.Sitemap = journeys.map((j) => ({
    url: `${base}/journeys/${j.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // Continent pages (5)
  const continentRoutes: MetadataRoute.Sitemap = CONTINENTS.map((c) => ({
    url: `${base}/continent/${c}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Country pages (39)
  const countryRoutes: MetadataRoute.Sitemap = getUniqueCountries().map(({ slug }) => ({
    url: `${base}/country/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // City walk pages (62)
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${base}/walk/${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // All compare pairs: same-country pairs + top curated cross-country pairs
  // Mirrors generateStaticParams in compare/[pair]/page.tsx exactly
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
    url: `${base}/compare/${pair}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
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
