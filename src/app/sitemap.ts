import { MetadataRoute } from "next";
import { cities, getUniqueCountries } from "@/lib/cities";

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

  // Top comparison pairs
  const topPairs = [
    ["tokyo", "new-york"],
    ["paris", "rome"],
    ["tokyo", "seoul"],
    ["dubai", "singapore"],
    ["london", "paris"],
    ["new-york", "chicago"],
    ["tokyo", "osaka"],
    ["istanbul", "athens"],
    ["barcelona", "lisbon"],
    ["berlin", "prague"],
    ["amsterdam", "copenhagen"],
    ["miami", "los-angeles"],
  ].filter(([a, b]) =>
    cities.some((c) => c.slug === a) && cities.some((c) => c.slug === b)
  );

  const compareRoutes: MetadataRoute.Sitemap = topPairs.map(([a, b]) => ({
    url: `${base}/compare/${a}-vs-${b}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...continentRoutes,
    ...countryRoutes,
    ...cityRoutes,
    ...compareRoutes,
  ];
}
