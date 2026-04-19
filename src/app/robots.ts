import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      "https://nearaway.in/sitemap.xml",
      "https://www.nearaway.in/sitemap.xml",
    ],
    host: "https://nearaway.in",
  };
}
