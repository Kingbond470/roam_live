import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, ArrowLeft, MapPin, Film, Compass } from "lucide-react";
import { cities, getCitiesByContinent, countryToSlug } from "@/lib/cities";
import { journeys } from "@/data/journeys";

interface Props {
  params: Promise<{ continent: string }>;
}

const CONTINENT_META: Record<
  string,
  { display: string; description: string; hero: string }
> = {
  asia: {
    display: "Asia",
    description:
      "From the neon-lit streets of Tokyo to the ancient temples of Varanasi — immersive 4K virtual walks across Asia's most iconic cities.",
    hero: "The world's largest continent. Ancient civilisations, futuristic skylines, street-food heaven.",
  },
  europe: {
    display: "Europe",
    description:
      "Walk the cobblestones of Rome, stroll along the Seine in Paris, or explore the canals of Amsterdam — all from your screen.",
    hero: "Baroque cathedrals, café culture, and coastlines stretching from Scandinavia to the Mediterranean.",
  },
  americas: {
    display: "The Americas",
    description:
      "From the jazz clubs of New Orleans to the carnival energy of Rio — 4K virtual walks across North and South America.",
    hero: "Jazz, carnival, skyscrapers, and wilderness — the Americas contain multitudes.",
  },
  africa: {
    display: "Africa",
    description:
      "Wander through the medinas of Marrakech, explore Cape Town's waterfront, or feel the energy of Nairobi — no passport required.",
    hero: "Ancient kingdoms, technicolour markets, and coastlines unlike anywhere else on Earth.",
  },
  oceania: {
    display: "Oceania",
    description:
      "From Sydney Harbour to Auckland's waterfront — virtual 4K walks across the cities of Oceania.",
    hero: "Sun, surf, and cities perched at the edge of the world.",
  },
};

export async function generateStaticParams() {
  return Object.keys(CONTINENT_META).map((continent) => ({ continent }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { continent } = await params;
  const meta = CONTINENT_META[continent];
  if (!meta) return {};

  const continentCities = getCitiesByContinent(meta.display === "The Americas" ? "Americas" : meta.display);
  const cityCount = continentCities.length;

  const title = `Virtual City Walks in ${meta.display} — ${cityCount} Cities | Nearaway.in`;
  return {
    title,
    description: meta.description,
    keywords: [
      `virtual tour ${meta.display}`,
      `${meta.display} city walk`,
      `4K walk ${meta.display}`,
      `explore ${meta.display} online`,
      "virtual travel",
      "4K city tour",
    ],
    alternates: { canonical: `https://nearaway.in/continent/${continent}` },
    openGraph: {
      title,
      description: meta.description,
      type: "website",
      url: `https://nearaway.in/continent/${continent}`,
      siteName: "Nearaway.in",
      images: [{ url: `/api/og?type=continent&name=${continent}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nearawayin",
      title,
      description: meta.description,
      images: [`/api/og?type=continent&name=${continent}`],
    },
  };
}

export default async function ContinentPage({ params }: Props) {
  const { continent } = await params;
  const meta = CONTINENT_META[continent];
  if (!meta) notFound();

  const continentLabel = meta.display === "The Americas" ? "Americas" : meta.display;
  const continentCities = getCitiesByContinent(continentLabel);
  if (continentCities.length === 0) notFound();

  const totalVideos = continentCities.reduce((s, c) => s + c.videos.length, 0);
  const countries = [...new Set(continentCities.map((c) => c.country))].sort();

  const continentSlugs = new Set(continentCities.map((c) => c.slug));
  const continentJourneys = journeys.filter((j) =>
    j.citySlugOrder.some((s) => continentSlugs.has(s))
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Virtual City Walks in ${meta.display}`,
    description: meta.description,
    url: `https://nearaway.in/continent/${continent}`,
    hasPart: continentCities.map((city) => ({
      "@type": "VideoObject",
      name: `${city.name} 4K Virtual Walk`,
      url: `https://nearaway.in/walk/${city.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="h-full overflow-y-auto bg-[#050508] text-white">
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#050508]/80 backdrop-blur-md border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-lg tracking-tight">
              Near<span className="text-amber-400">away</span>
            </span>
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            About
          </Link>
        </nav>

        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4 sm:px-6 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 70%)",
            }}
          />
          <p className="text-amber-400/70 text-xs tracking-widest uppercase font-semibold mb-4">
            Virtual Walks
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            {meta.display}
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            {meta.hero}
          </p>

          <div className="inline-flex items-center gap-8 bg-white/4 border border-white/8 rounded-2xl px-8 py-4 mb-10">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{continentCities.length}</p>
              <p className="text-white/40 text-xs mt-0.5">Cities</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{countries.length}</p>
              <p className="text-white/40 text-xs mt-0.5">Countries</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{totalVideos}+</p>
              <p className="text-white/40 text-xs mt-0.5">Walks</p>
            </div>
          </div>

          <div>
            <Link
              href={`/?continent=${continentLabel}`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors"
            >
              <Globe className="w-4 h-4" />
              Explore {meta.display} on the Globe
            </Link>
          </div>
        </section>

        {/* City grid */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-6">
            All cities in {meta.display}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {continentCities.map((city) => (
              <Link
                key={city.slug}
                href={`/walk/${city.slug}`}
                className="group flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/8 p-4 hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors"
              >
                <span className="text-3xl leading-none">{city.flagEmoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                    {city.name}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">{city.country}</p>
                </div>
                <div className="flex items-center gap-1 text-white/30 text-xs flex-shrink-0">
                  <Film className="w-3 h-3" />
                  <span>{city.videos.length}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Journeys through this continent */}
        {continentJourneys.length > 0 && (
          <section className="bg-white/[0.02] border-y border-white/6 py-14 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Compass className="w-3.5 h-3.5 text-amber-400/60" />
                <p className="text-xs tracking-widest uppercase text-white/30">
                  Journeys through {meta.display}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {continentJourneys.map((journey) => {
                  const journeyCitiesHere = journey.citySlugOrder
                    .map((s) => continentCities.find((c) => c.slug === s))
                    .filter(Boolean) as typeof continentCities;
                  return (
                    <Link
                      key={journey.id}
                      href={`/journeys/${journey.id}`}
                      className="group flex items-center gap-4 rounded-2xl bg-white/[0.03] border border-white/8 p-4 hover:border-white/20 transition-colors"
                    >
                      <span className="text-3xl leading-none">{journey.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {journey.name}
                        </p>
                        <p className="text-white/40 text-sm">{journey.tagline}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-white/30">
                          {journeyCitiesHere.map((c) => c.name).join(", ")}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Countries */}
        <section className="bg-white/[0.02] border-y border-white/6 py-14 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs tracking-widest uppercase text-white/30 mb-6 text-center">
              Countries in {meta.display}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {countries.map((country) => {
                const sample = continentCities.find((c) => c.country === country)!;
                return (
                  <Link
                    key={country}
                    href={`/country/${countryToSlug(country)}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/8 hover:border-amber-500/30 hover:bg-amber-500/5 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <span>{sample.flagEmoji}</span>
                    <span>{country}</span>
                    <span className="text-white/25">
                      {continentCities.filter((c) => c.country === country).length}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Other continents */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-6">
            Explore other continents
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CONTINENT_META)
              .filter(([key]) => key !== continent)
              .map(([key, m]) => (
                <Link
                  key={key}
                  href={`/continent/${key}`}
                  className="px-4 py-2 rounded-full bg-white/4 border border-white/8 hover:border-white/20 text-sm text-white/50 hover:text-white transition-colors"
                >
                  {m.display}
                </Link>
              ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/6 py-16 px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
            Ready to explore {meta.display}?
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-7 py-3.5 rounded-full transition-colors"
          >
            <Globe className="w-4 h-4" />
            Open the Globe
          </Link>
          <p className="text-white/20 text-xs mt-5">No account. No download. No passport.</p>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-tight">
              Near<span className="text-amber-400">away</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-white/30 text-sm flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Globe</Link>
            <span>·</span>
            <Link href="/journeys" className="hover:text-white transition-colors">Journeys</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>·</span>
            {Object.entries(CONTINENT_META).map(([key, m], i, arr) => (
              <span key={key} className="flex items-center gap-4">
                <Link href={`/continent/${key}`} className="hover:text-white transition-colors">
                  {m.display}
                </Link>
                {i < arr.length - 1 && <span>·</span>}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
