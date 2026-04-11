import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatViewerCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export function getCityBySlug(cities: import("@/types/city").City[], slug: string) {
  return cities.find((c) => c.slug === slug) ?? null;
}

export function getFeaturedVideo(city: import("@/types/city").City) {
  return city.videos.find((v) => v.isFeatured) ?? city.videos[0];
}

/**
 * Returns the best video for the user's current local time.
 * Priority: exact timeOfDay match → isFeatured → first video.
 *
 * Uses the *user's* local hour (not the city's timezone) so the
 * experience reflects how the user feels right now.
 *
 *   5am – 8am  → morning
 *   9am – 4pm  → day
 *   5pm – 7pm  → golden-hour
 *   8pm – 4am  → night
 */
export function getTimeAwareVideo(city: import("@/types/city").City) {
  const hour = new Date().getHours();

  let desired: import("@/types/city").VideoTimeOfDay;
  if (hour >= 5 && hour < 9)       desired = "morning";
  else if (hour >= 9 && hour < 17) desired = "day";
  else if (hour >= 17 && hour < 20) desired = "golden-hour";
  else                              desired = "night";

  return (
    city.videos.find((v) => v.timeOfDay === desired) ??
    city.videos.find((v) => v.isFeatured) ??
    city.videos[0]
  );
}

/**
 * Returns a human-readable mood label for a video's timeOfDay + type combo.
 * Used as the pill label in the VideoSwitcher.
 */
export function getMoodLabel(
  timeOfDay: import("@/types/city").VideoTimeOfDay,
  type: import("@/types/city").VideoType
): string {
  if (type === "bike")    return "Adventure";
  if (type === "guided")  return "Deep Dive";
  if (timeOfDay === "morning")      return "No Crowds";
  if (timeOfDay === "night")        return "After Dark";
  if (timeOfDay === "golden-hour")  return "Golden Hour";
  if (type === "landmark")          return "Iconic";
  return "City Walk";
}
