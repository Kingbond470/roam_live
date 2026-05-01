export interface Journey {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  citySlugOrder: string[];
  // Raw hex required — globe.gl arc renderer and CSS inline styles both need it.
  // CSS custom properties (var(--color-*)) cannot be used here.
  // Palette constraint: vibrant, saturated, and visually distinct from --color-ember (#f59e0b).
  // Prefer Tailwind 500-level hues: purple, sky, pink, emerald, rose — avoid yellow/amber.
  accentColor: string;
}

export const journeys: Journey[] = [
  {
    id: "neon-after-dark",
    name: "Neon After Dark",
    emoji: "🌙",
    tagline: "Cities that never sleep",
    citySlugOrder: ["tokyo", "seoul", "hong-kong", "bangkok", "singapore", "dubai"],
    accentColor: "#a855f7",
  },
  {
    id: "street-food-trail",
    name: "Street Food Trail",
    emoji: "🍜",
    tagline: "Eat the world, one city at a time",
    citySlugOrder: ["bangkok", "tokyo", "mumbai", "taipei", "ho-chi-minh", "varanasi", "new-delhi"],
    accentColor: "#f97316",
  },
  {
    id: "ancient-empires",
    name: "Ancient Empires",
    emoji: "🏛️",
    tagline: "3,000 years of history in 7 cities",
    citySlugOrder: ["athens", "rome", "istanbul", "cairo", "varanasi", "kyoto", "lisbon"],
    accentColor: "#10b981",
  },
  {
    id: "coastal-dreams",
    name: "Coastal Dreams",
    emoji: "🌊",
    tagline: "Where land meets sea",
    citySlugOrder: ["sydney", "rio-de-janeiro", "barcelona", "cape-town", "miami", "los-cabos"],
    accentColor: "#0ea5e9",
  },
  {
    id: "music-and-soul",
    name: "Music & Soul",
    emoji: "🎵",
    tagline: "Cities shaped by sound",
    citySlugOrder: ["new-orleans", "havana", "rio-de-janeiro", "vienna", "chicago", "edinburgh"],
    accentColor: "#ec4899",
  },
];
