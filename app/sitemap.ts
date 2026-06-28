import type { MetadataRoute } from "next";
import { europeanCapitals } from "@/lib/europeanCities";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amicooked.com";

  const staticRoutes = ["", "/quiz", "/heat-index", "/heatwave-safety", "/glossary"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const cityRoutes = europeanCapitals.map((city) => {
    const slug = city.capital.toLowerCase().replace(/\s+/g, "-");
    return {
      url: `${baseUrl}/cities/${slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...cityRoutes];
}
