import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, ArrowLeft, MapPin, Film, Utensils, Clock } from "lucide-react";
import { cities, getCitiesByCountry, getUniqueCountries, countryToSlug } from "@/lib/cities";

interface Props {
  params: Promise<{ slug: string }>;
}

const COUNTRY_TAGLINES: Record<string, string> = {
  Japan: "Ancient temples, neon cities, and a culture that rewards every curious eye.",
  "South Korea": "K-pop, kimchi, and coastlines — Seoul is just the beginning.",
  China: "Five thousand years of history, still being written every day.",
  Thailand: "Golden temples, midnight markets, and the world's most generous smiles.",
  Singapore: "Where every culture on Earth decided to eat together.",
  India: "Chaos, colour, and civilisation at its most alive.",
  Vietnam: "Lantern-lit towns, karst mountains, and pho at dawn.",
  Taiwan: "Night markets, mountain trails, and bubble tea that started it all.",
  Indonesia: "17,000 islands, one extraordinary spirit.",
  Turkey: "The place where Europe ends and Asia begins — and both are beautiful.",
  Greece: "Democracy was born here. So was the philosophy of sitting by the sea.",
  Italy: "Where every piazza is a stage and every meal is an event.",
  France: "Art, bread, wine, and the audacity to make it all look effortless.",
  Spain: "Late nights, long lunches, and a coast that never apologises.",
  Germany: "Forests, festivals, and a precision that somehow still makes time for beer.",
  Netherlands: "Canals, cycling, and a country that built itself out of the sea.",
  UK: "Castles, queues, and the city that reinvented itself every decade.",
  Scotland: "Highlands, whisky, and a history written in stone.",
  "Czech Republic": "Gothic spires, velvet revolutions, and the best beer in Europe.",
  Portugal: "Fado, tiles, and the feeling that the world's greatest adventures started here.",
  Norway: "Fjords that make you forget language exists.",
  Poland: "Royal capitals, resilient spirit, and pierogi that are honestly perfect.",
  Croatia: "Dalmatian coastline — the Mediterranean's best-kept secret.",
  Qatar: "Ancient hospitality, a futuristic skyline, and the desert just beyond.",
  Denmark: "Hygge, harbour, and design that makes ordinary life beautiful.",
  Austria: "Mozart, mountains, and coffee houses where time slows down.",
  Hungary: "Thermal baths, ruin bars, and Budapest's unforgettable skyline.",
  Switzerland: "Alps, precision, and chocolate that might genuinely change you.",
  USA: "Fifty states, infinite characters — every city its own country.",
  Mexico: "Aztec pyramids, Pacific sunsets, and tacos worth crossing a continent for.",
  Brazil: "Carnival, caipirinha, and a zest for life that is frankly contagious.",
  Cuba: "Classic cars, revolution, and music in every crumbling courtyard.",
  Colombia: "Coffee, colour, and a warmth that's impossible to forget.",
  Peru: "Machu Picchu is just the opening act.",
  Chile: "From Atacama to Patagonia — Earth's most dramatic road trip.",
  Argentina: "Tango, steak, and a passion that bleeds into everything.",
  "South Africa": "Eleven languages, one rainbow nation, and landscapes that rewrite the rulebook.",
  Morocco: "Labyrinthine medinas, Sahara sunsets, and the scent of spice in every alley.",
  Egypt: "The pyramids are 4,500 years old and still the most impressive thing you'll see.",
  Kenya: "The Great Migration, Nairobi's energy, and skies too big to photograph.",
  Nigeria: "Afrobeats, Jollof rice, and the most entrepreneurial city on the continent.",
  Australia: "Harbours, reef, and a continent-sized backyard with no rules.",
  "New Zealand": "Middle-Earth was here. The scenery didn't need CGI.",
  Canada: "Mountains, maple syrup, and a politeness that is somehow completely sincere.",
  UAE: "Desert dunes in the morning, the world's tallest towers by night.",
};

export async function generateStaticParams() {
  return getUniqueCountries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const countryCities = getCitiesByCountry(slug);
  if (countryCities.length === 0) return {};

  const country = countryCities[0].country;
  const flag = countryCities[0].flagEmoji;
  const cityNames = countryCities.map((c) => c.name).join(", ");
  const totalVideos = countryCities.reduce((s, c) => s + c.videos.length, 0);

  const title = `Virtual Walking Tours in ${country} — ${countryCities.length} ${countryCities.length === 1 ? "City" : "Cities"} | Nearaway.in`;
  const description = `Explore ${country} from your screen with immersive 4K virtual walks. ${countryCities.length > 1 ? `Cities include ${cityNames}.` : `Walk through ${cityNames}.`} ${totalVideos} walks, no passport required.`;

  return {
    title,
    description,
    keywords: [
      `virtual tour ${country}`,
      `${country} city walk`,
      `explore ${country} online`,
      `4K walk ${country}`,
      ...countryCities.map((c) => `${c.name} virtual tour`),
    ],
    alternates: { canonical: `https://nearaway.in/country/${slug}` },
    openGraph: {
      title: `${flag} Virtual Walks in ${country} | Nearaway.in`,
      description,
      type: "website",
      url: `https://nearaway.in/country/${slug}`,
      siteName: "Nearaway.in",
      images: [{ url: `/api/og?type=country&name=${encodeURIComponent(country)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nearawayin",
      title: `${flag} Virtual Walks in ${country} | Nearaway.in`,
      description,
      images: [`/api/og?type=country&name=${encodeURIComponent(country)}`],
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const countryCities = getCitiesByCountry(slug);
  if (countryCities.length === 0) notFound();

  const country = countryCities[0].country;
  const flagEmoji = countryCities[0].flagEmoji;
  const continent = countryCities[0].continent;
  const continentSlug = continent.toLowerCase();
  const totalVideos = countryCities.reduce((s, c) => s + c.videos.length, 0);

  // Aggregate must-eats across all cities (unique, up to 8)
  const allMustEat = [
    ...new Set(countryCities.flatMap((c) => c.culture.mustEat)),
  ].slice(0, 8);

  // Related countries — same continent, different country
  const relatedCountries = getUniqueCountries()
    .filter((c) => c.continent === continent && c.slug !== slug)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Virtual Walking Tours in ${country}`,
    description: `Explore ${country} virtually with 4K walking tours of ${countryCities.map((c) => c.name).join(", ")}.`,
    url: `https://nearaway.in/country/${slug}`,
    hasPart: countryCities.map((city) => ({
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
            href={`/continent/${continentSlug}`}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {continent}
          </Link>
        </nav>

        {/* Hero */}
        <section className="relative pt-28 pb-14 px-4 sm:px-6 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 70%)",
            }}
          />
          <p className="text-amber-400/70 text-xs tracking-widest uppercase font-semibold mb-4">
            Virtual Walks
          </p>
          <div className="text-6xl sm:text-8xl mb-4">{flagEmoji}</div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3">{country}</h1>
          {COUNTRY_TAGLINES[country] && (
            <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-4 italic">
              {COUNTRY_TAGLINES[country]}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm mb-8">
            <MapPin className="w-3.5 h-3.5" />
            <Link
              href={`/continent/${continentSlug}`}
              className="hover:text-amber-400 transition-colors"
            >
              {continent}
            </Link>
          </div>

          <div className="inline-flex items-center gap-8 bg-white/4 border border-white/8 rounded-2xl px-8 py-4 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{countryCities.length}</p>
              <p className="text-white/40 text-xs mt-0.5">{countryCities.length === 1 ? "City" : "Cities"}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{totalVideos}+</p>
              <p className="text-white/40 text-xs mt-0.5">Walks</p>
            </div>
          </div>

          <div>
            <Link
              href={`/?city=${countryCities[0].slug}`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors"
            >
              <Globe className="w-4 h-4" />
              Explore {country} on the Globe
            </Link>
          </div>
        </section>

        {/* City cards */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-14">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-5">
            {countryCities.length === 1 ? "City" : `${countryCities.length} Cities`} in {country}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {countryCities.map((city) => (
              <Link
                key={city.slug}
                href={`/walk/${city.slug}`}
                className="group rounded-2xl bg-white/[0.03] border border-white/8 p-5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                      {city.name}
                    </h2>
                    <div className="flex items-center gap-2 text-white/40 text-xs mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{city.culture.bestSeason}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400/70 text-xs bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0">
                    <Film className="w-3 h-3" />
                    <span>{city.videos.length} walk{city.videos.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                  {city.culture.funFact}
                </p>
                {city.culture.mustEat.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {city.culture.mustEat.slice(0, 3).map((food) => (
                      <span
                        key={food}
                        className="px-2 py-0.5 rounded-full bg-white/6 text-white/50 text-xs"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Must eat */}
        {allMustEat.length > 0 && (
          <section className="bg-white/[0.02] border-y border-white/6 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-5">
                <Utensils className="w-4 h-4 text-amber-400/70" />
                <p className="text-xs tracking-widest uppercase text-white/30">
                  Must eat in {country}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {allMustEat.map((food) => (
                  <span
                    key={food}
                    className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related countries */}
        {relatedCountries.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <p className="text-xs tracking-widest uppercase text-white/30 mb-4">
              More countries in {continent}
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedCountries.map((c) => (
                <Link
                  key={c.slug}
                  href={`/country/${c.slug}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 hover:border-white/20 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <span>{c.flagEmoji}</span>
                  <span>{c.country}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-tight">
              Near<span className="text-amber-400">away</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-white/30 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Globe</Link>
            <span>·</span>
            <Link href="/journeys" className="hover:text-white transition-colors">Journeys</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>·</span>
            <Link href={`/continent/${continentSlug}`} className="hover:text-white transition-colors">{continent}</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
