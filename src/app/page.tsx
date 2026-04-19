import { cities } from "@/lib/cities";
import { getCityOfTheDay } from "@/lib/cityOfTheDay";
import { journeys } from "@/data/journeys";
import { HomeClient } from "./HomeClient";

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Nearaway?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nearaway is a free virtual travel platform that lets you explore cities around the world through immersive 4K walking tours. No account or passport required — just open the globe and start walking.",
      },
    },
    {
      "@type": "Question",
      name: "How many cities can I virtually visit on Nearaway?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Nearaway features ${cities.length} cities across 5 continents — Asia, Europe, the Americas, Africa, and Oceania — with multiple 4K walks per city covering different times of day.`,
      },
    },
    {
      "@type": "Question",
      name: "Is Nearaway free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Nearaway is completely free. No sign-up, no subscription, no downloads. Open nearaway.in in any browser and start exploring instantly.",
      },
    },
    {
      "@type": "Question",
      name: "What are Journeys on Nearaway?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Journeys are curated, themed routes connecting multiple cities — for example Ancient Empires, Neon After Dark, or Street Food Trail. Nearaway has ${journeys.length} journeys that guide you through cities connected by a common theme.`,
      },
    },
    {
      "@type": "Question",
      name: "Can I compare two cities side by side?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Nearaway has a split-screen compare mode that lets you watch two different city walks simultaneously, side by side, to compare culture, atmosphere, and vibe.",
      },
    },
  ],
};

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <HomeClient
        cities={cities}
        initialCity={initialCity}
        initialJourney={initialJourney}
        initialContinent={initialContinent}
      />
    </>
  );
}
