import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCityBySlug } from "@/lib/cities";
import { getFeaturedVideo } from "@/lib/utils";
import { Globe, ArrowLeft, Utensils, Lightbulb } from "lucide-react";

interface Props {
  params: Promise<{ pair: string }>;
}

// Generate top city comparison pairs for static generation
export async function generateStaticParams() {
  const pairs: { pair: string }[] = [];
  const slugs = cities.map((c) => c.slug);

  // Generate meaningful pairs (not all permutations — just curated ones)
  const curated = [
    ["tokyo", "new-york"],
    ["paris", "rome"],
    ["tokyo", "seoul"],
    ["dubai", "singapore"],
    ["london", "paris"],
    ["new-york", "chicago"],
    ["tokyo", "osaka"],
    ["istanbul", "athens"],
    ["barcelona", "lisbon"],
    ["berlin", "prague"],
    ["amsterdam", "copenhagen"],
    ["miami", "los-angeles"],
    ["tokyo", "hong-kong"],
    ["new-york", "london"],
    ["paris", "amsterdam"],
    ["rome", "athens"],
    ["dubai", "cairo"],
    ["tokyo", "bangkok"],
    ["berlin", "vienna"],
    ["istanbul", "cairo"],
  ];

  for (const [a, b] of curated) {
    if (slugs.includes(a) && slugs.includes(b)) {
      pairs.push({ pair: `${a}-vs-${b}` });
    }
  }

  return pairs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const [slugA, slugB] = parsePair(pair);
  if (!slugA || !slugB) return {};

  const cityA = getCityBySlug(slugA);
  const cityB = getCityBySlug(slugB);
  if (!cityA || !cityB) return {};

  const title = `${cityA.name} vs ${cityB.name} — Which City Should You Visit? | Roam.Live`;
  const description = `Compare ${cityA.name} and ${cityB.name} side by side. Culture, food, best seasons, local tips, and immersive 4K virtual walks. No passport required.`;

  return {
    title,
    description,
    keywords: [
      `${cityA.name} vs ${cityB.name}`,
      `${cityA.name} or ${cityB.name}`,
      `compare ${cityA.name} ${cityB.name}`,
      `${cityA.name} travel guide`,
      `${cityB.name} travel guide`,
      "virtual travel comparison",
    ],
    alternates: {
      canonical: `https://roam.live/compare/${pair}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://roam.live/compare/${pair}`,
      siteName: "Roam.Live",
      images: [{ url: `/api/og?city=${cityA.slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@roamlive",
      title: `${cityA.flagEmoji} ${cityA.name} vs ${cityB.flagEmoji} ${cityB.name} — Compare Cities`,
      description,
      images: [`/api/og?city=${cityA.slug}`],
    },
  };
}

function parsePair(pair: string): [string, string] | [null, null] {
  const match = pair.match(/^(.+)-vs-(.+)$/);
  if (!match) return [null, null];
  return [match[1], match[2]];
}

export default async function ComparePage({ params }: Props) {
  const { pair } = await params;
  const [slugA, slugB] = parsePair(pair);
  if (!slugA || !slugB) notFound();

  const cityA = getCityBySlug(slugA);
  const cityB = getCityBySlug(slugB);
  if (!cityA || !cityB) notFound();

  const videoA = getFeaturedVideo(cityA);
  const videoB = getFeaturedVideo(cityB);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${cityA.name} vs ${cityB.name} — City Comparison`,
    description: `Compare ${cityA.name} and ${cityB.name}: culture, food, climate, and virtual walking tours.`,
    url: `https://roam.live/compare/${pair}`,
    mainEntity: [
      {
        "@type": "TouristAttraction",
        name: cityA.name,
        address: { "@type": "PostalAddress", addressCountry: cityA.countryCode },
      },
      {
        "@type": "TouristAttraction",
        name: cityB.name,
        address: { "@type": "PostalAddress", addressCountry: cityB.countryCode },
      },
    ],
  };

  const comparisonRows = [
    { label: "Country", a: cityA.country, b: cityB.country },
    { label: "Continent", a: cityA.continent, b: cityB.continent },
    { label: "Best Season", a: cityA.culture.bestSeason, b: cityB.culture.bestSeason },
    { label: "Currency", a: cityA.culture.currency, b: cityB.culture.currency },
    { label: "Greeting", a: cityA.culture.greeting, b: cityB.culture.greeting },
  ];

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
              Roam<span className="text-amber-400">.Live</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Globe
          </Link>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">City Comparison</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span>{cityA.flagEmoji} {cityA.name}</span>
              <span className="text-white/20 text-xl sm:text-3xl md:text-4xl">vs</span>
              <span>{cityB.flagEmoji} {cityB.name}</span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Compare two incredible cities side by side — culture, food, local tips, and immersive 4K virtual walks.
            </p>
          </div>

          {/* Video previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[{ city: cityA, video: videoA }, { city: cityB, video: videoB }].map(({ city, video }) => (
              <div key={city.slug}>
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video mb-3">
                  {video ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&start=90`}
                      title={`${city.name} Virtual Walk`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                      <p className="text-white/30 text-sm">Video coming soon</p>
                    </div>
                  )}
                </div>
                <Link
                  href={`/?city=${city.slug}`}
                  className="block text-center py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors"
                >
                  Explore {city.name} on Roam.Live →
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="rounded-2xl bg-white/4 border border-white/8 overflow-hidden mb-10">
            {/* Desktop header — hidden on mobile */}
            <div className="hidden sm:grid grid-cols-3 bg-white/4 border-b border-white/8 px-5 py-3">
              <span className="text-xs tracking-widest uppercase text-white/30">Category</span>
              <span className="text-sm font-semibold">{cityA.flagEmoji} {cityA.name}</span>
              <span className="text-sm font-semibold">{cityB.flagEmoji} {cityB.name}</span>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={`px-4 sm:px-5 py-3 sm:py-4 ${i < comparisonRows.length - 1 ? "border-b border-white/5" : ""}`}
              >
                {/* Mobile: label above, cities side by side */}
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1.5 sm:hidden">{row.label}</p>
                <div className="grid grid-cols-2 gap-3 sm:hidden">
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">{cityA.flagEmoji} {cityA.name}</p>
                    <p className="text-sm text-white/80">{row.a}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">{cityB.flagEmoji} {cityB.name}</p>
                    <p className="text-sm text-white/80">{row.b}</p>
                  </div>
                </div>
                {/* Desktop: 3-col grid */}
                <div className="hidden sm:grid grid-cols-3">
                  <span className="text-xs text-white/40 uppercase tracking-wide self-center">{row.label}</span>
                  <span className="text-sm text-white/80 pr-4">{row.a}</span>
                  <span className="text-sm text-white/80">{row.b}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Must Eat comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[cityA, cityB].map((city) => (
              <div key={city.slug} className="rounded-2xl bg-white/4 border border-white/8 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-3.5 h-3.5 text-amber-400/80" />
                  <h2 className="text-xs tracking-widest uppercase text-amber-400/80">
                    Must Eat in {city.name}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {city.culture.mustEat.map((food) => (
                    <span
                      key={food}
                      className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm"
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Local Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[cityA, cityB].map((city) => (
              <div key={city.slug} className="rounded-2xl bg-white/4 border border-white/8 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400/80" />
                  <h2 className="text-xs tracking-widest uppercase text-amber-400/80">
                    {city.name} Insider Tip
                  </h2>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{city.culture.localTip}</p>
              </div>
            ))}
          </div>

          {/* Fun Facts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {[cityA, cityB].map((city) => (
              <div
                key={city.slug}
                className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-5"
              >
                <p className="text-xs tracking-widest uppercase text-amber-400 mb-2">
                  {city.flagEmoji} {city.name} Fun Fact
                </p>
                <p className="text-white/80 text-sm leading-relaxed">{city.culture.funFact}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center border-t border-white/8 pt-10">
            <p className="text-white/40 mb-4">Try the live side-by-side comparison in the app</p>
            <Link
              href={`/?city=${cityA.slug}`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors"
            >
              <Globe className="w-4 h-4" />
              Open in Roam.Live
            </Link>
          </div>

          {/* More comparisons — alternates between cityA and cityB as base */}
          <div className="mt-12">
            <p className="text-xs tracking-widest uppercase text-white/30 mb-4">More Comparisons</p>
            <div className="flex flex-wrap gap-2">
              {cities
                .filter((c) => c.slug !== cityA.slug && c.slug !== cityB.slug)
                .slice(0, 10)
                .map((c, i) => {
                  const base = i % 2 === 0 ? cityA : cityB;
                  return (
                    <Link
                      key={c.slug}
                      href={`/compare/${base.slug}-vs-${c.slug}`}
                      className="px-3 py-1.5 rounded-full bg-white/4 border border-white/8 hover:border-white/20 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {base.flagEmoji} {base.name} vs {c.flagEmoji} {c.name}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
