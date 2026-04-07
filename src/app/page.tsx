import { cities } from "@/lib/cities";
import { HomeClient } from "./HomeClient";

interface Props {
  searchParams: Promise<{ city?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const slug = params.city;
  const city = slug ? cities.find((c) => c.slug === slug) : null;
  if (!city) return {};
  return {
    title: `Walk ${city.name}, ${city.country} — Roam.Live`,
    description: `Take a virtual 4K walk through ${city.name}. No passport required.`,
    openGraph: {
      title: `Walk ${city.name} on Roam.Live`,
      description: `Virtual 4K walk through ${city.name}, ${city.country}.`,
      images: [`/api/og?city=${city.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Walk ${city.name} on Roam.Live`,
      images: [`/api/og?city=${city.slug}`],
    },
  };
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialCitySlug = params.city ?? null;
  const initialCity = initialCitySlug ? cities.find((c) => c.slug === initialCitySlug) ?? null : null;
  return <HomeClient cities={cities} initialCity={initialCity} />;
}
