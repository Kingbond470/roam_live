import { cities } from "@/lib/cities";
import { getCityOfTheDay } from "@/lib/cityOfTheDay";
import { journeys } from "@/data/journeys";
import { HomeClient } from "./HomeClient";

const VALID_CONTINENTS = new Set(["Asia", "Europe", "Americas", "Africa", "Oceania"]);

interface Props {
  searchParams: Promise<{ city?: string; today?: string; journey?: string; continent?: string }>;
}

/** Resolve whichever param is present → City | null */
function resolveInitialCity(slug?: string, today?: string) {
  if (today) return getCityOfTheDay(cities);
  if (slug)  return cities.find((c) => c.slug === slug) ?? null;
  return null;
}

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const city = resolveInitialCity(params.city, params.today);
  if (!city) return {};

  const isToday = !!params.today;
  const titlePrefix = isToday ? `Today's Walk: ${city.name}` : `Walk ${city.name}, ${city.country}`;

  return {
    title: `${titlePrefix} — Nearaway.in`,
    description: `Take a virtual 4K walk through ${city.name}. No passport required.`,
    openGraph: {
      title: `${titlePrefix} on Nearaway.in`,
      description: `Virtual 4K walk through ${city.name}, ${city.country}.`,
      images: [`/api/og?city=${city.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titlePrefix} on Nearaway.in`,
      images: [`/api/og?city=${city.slug}`],
    },
  };
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialCity = resolveInitialCity(params.city, params.today);
  const initialJourney = params.journey
    ? (journeys.find((j) => j.id === params.journey) ?? null)
    : null;
  const initialContinent = params.continent && VALID_CONTINENTS.has(params.continent)
    ? params.continent
    : null;
  return (
    <HomeClient
      cities={cities}
      initialCity={initialCity}
      initialJourney={initialJourney}
      initialContinent={initialContinent}
    />
  );
}
