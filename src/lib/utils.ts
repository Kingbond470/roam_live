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
