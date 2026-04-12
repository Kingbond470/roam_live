export interface CultureCardData {
  greeting: string;
  currency: string;
  bestSeason: string;
  mustEat: string[];
  localTip: string;
  funFact: string;
  culturalDos: string[];
  culturalDonts: string[];
}

export type VideoTimeOfDay = "morning" | "day" | "golden-hour" | "night" | "any";
export type VideoType = "walk" | "landmark" | "guided" | "bike";

export interface CityVideo {
  youtubeId: string;
  label: string;
  duration?: string;
  timeOfDay: VideoTimeOfDay;
  type: VideoType;
  isFeatured: boolean;
}

export type CityEra = "Ancient" | "Medieval" | "Colonial" | "Modern" | "Contemporary";

export interface CityOrigin {
  founded: string;         // e.g. "circa 753 BCE" or "1626"
  originalName?: string;   // original/ancient name if different from current
  founders: string;        // who built it
  story: string;           // 2–3 sentence narrative
  era: CityEra;
}

export interface City {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  continent: "Europe" | "Asia" | "Americas" | "Africa" | "Oceania";
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
  population: number;
  videos: CityVideo[];
  culture: CultureCardData;
  origin?: CityOrigin;
  tags: string[];
  thumbnailUrl?: string;
}

export interface GlobePoint {
  lat: number;
  lng: number;
  citySlug: string;
  label: string;
  size: number;
  color: string;
  altitude: number;
}
