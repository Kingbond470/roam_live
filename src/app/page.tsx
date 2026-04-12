import { cities } from "@/lib/cities";
import { getCityOfTheDay } from "@/lib/cityOfTheDay";
import { HomeClient } from "./HomeClient";

interface Props {
  searchParams: Promise<{ city?: string; today?: string }>;
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
    title: `${titlePrefix} — Roam.Live`,
    description: `Take a virtual 4K walk through ${city.name}. No passport required.`,
    openGraph: {
      title: `${titlePrefix} on Roam.Live`,
      description: `Virtual 4K walk through ${city.name}, ${city.country}.`,
      images: [`/api/og?city=${city.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titlePrefix} on Roam.Live`,
      images: [`/api/og?city=${city.slug}`],
    },
  };
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialCity = resolveInitialCity(params.city, params.today);
  return <HomeClient cities={cities} initialCity={initialCity} />;
}
