import type { City } from "@/types/city";

/**
 * Returns a deterministic city for today — same city for all users on the same day.
 * Changes at midnight UTC.
 */
export function getCityOfTheDay(cities: City[]): City {
  const today = new Date();
  const dayIndex =
    today.getUTCFullYear() * 10000 +
    (today.getUTCMonth() + 1) * 100 +
    today.getUTCDate();
  return cities[dayIndex % cities.length];
}
