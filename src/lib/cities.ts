import type { City } from "@/types/city";
import citiesData from "@/data/cities.json";

export const cities: City[] = citiesData as City[];

export function getCityBySlug(slug: string): City | null {
  return cities.find((c) => c.slug === slug) ?? null;
}

export function countryToSlug(country: string): string {
  return country.toLowerCase().replace(/\s+/g, "-");
}

export function getCitiesByCountry(countrySlug: string): City[] {
  return cities.filter((c) => countryToSlug(c.country) === countrySlug);
}

export function getCitiesByContinent(continent: string): City[] {
  return cities.filter(
    (c) => c.continent.toLowerCase() === continent.toLowerCase()
  );
}

export function getUniqueCountries(): { country: string; slug: string; flagEmoji: string; continent: string }[] {
  const seen = new Set<string>();
  const result: { country: string; slug: string; flagEmoji: string; continent: string }[] = [];
  for (const city of cities) {
    const slug = countryToSlug(city.country);
    if (!seen.has(slug)) {
      seen.add(slug);
      result.push({ country: city.country, slug, flagEmoji: city.flagEmoji, continent: city.continent });
    }
  }
  return result.sort((a, b) => a.country.localeCompare(b.country));
}
