import { MetadataRoute } from "next";
import { cities } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://roam.live";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // City walk pages
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${base}/walk/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Top comparison pairs (most searched city combos)
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
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...cityRoutes, ...compareRoutes];
}
