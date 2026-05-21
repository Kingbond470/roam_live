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
  if (!city) {
    return {
      title: "Nearaway — Free Virtual City Walks on a 3D Globe",
      description: `Explore ${cities.length} cities across 5 continents through immersive 4K walking tours. No account, no passport — just open the globe and start walking.`,
      alternates: { canonical: "https://nearaway.in" },
      openGraph: {
        title: "Nearaway — Free Virtual City Walks on a 3D Globe",
        description: `Explore ${cities.length} cities through immersive 4K virtual walking tours. No account required.`,
        type: "website",
        url: "https://nearaway.in",
        siteName: "Nearaway",
        images: [{ url: "/api/og", width: 1200, height: 630, alt: "Nearaway — Free Virtual City Walks" }],
      },
      twitter: {
        card: "summary_large_image",
        site: "@nearawayin",
        title: "Nearaway — Free Virtual City Walks on a 3D Globe",
        images: ["/api/og"],
      },
    };
  }

  const isToday = !!params.today;
  const titlePrefix = isToday ? `Today's Walk: ${city.name}` : `Walk ${city.name}, ${city.country}`;

  return {
    title: `${titlePrefix} — Nearaway`,
    description: `Take a free virtual walk through ${city.name}, ${city.country}. No passport required.`,
    openGraph: {
      title: `${titlePrefix} | Nearaway`,
      description: `Free virtual walk through ${city.name}, ${city.country}. 4K walking tour, no account required.`,
      images: [`/api/og?city=${city.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titlePrefix} | Nearaway`,
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
      {/*
        Server-rendered city index — invisible to users (position absolute, off-screen),
        fully crawlable by Googlebot. Provides internal links so spiders can discover
        all /walk/* pages from the homepage without depending on the JS globe.
      */}
      <nav aria-label="City walks index" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
        <h2>Explore cities on Nearaway</h2>
        <ul>
          {cities.map((city) => (
            <li key={city.slug}>
              <a href={`/walk/${city.slug}`}>{city.name} virtual walk — {city.country}</a>
            </li>
          ))}
        </ul>
        <h2>Journeys</h2>
        <ul>
          {journeys.map((j) => (
            <li key={j.id}>
              <a href={`/journeys/${j.id}`}>{j.name} — {j.tagline}</a>
            </li>
          ))}
        </ul>
        <h2>Explore by continent</h2>
        <ul>
          {["asia", "europe", "americas", "africa", "oceania"].map((c) => (
            <li key={c}><a href={`/continent/${c}`}>Virtual city walks in {c}</a></li>
          ))}
        </ul>
      </nav>
    </>
  );
}
