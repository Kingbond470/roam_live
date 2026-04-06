import type { City } from "@/types/city";
import citiesData from "@/data/cities.json";

export const cities: City[] = citiesData as City[];

export function getCityBySlug(slug: string): City | null {
  return cities.find((c) => c.slug === slug) ?? null;
}
