import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCityBySlug, countryToSlug } from "@/lib/cities";
import { getFeaturedVideo } from "@/lib/utils";
import { journeys } from "@/data/journeys";
import { Globe, ArrowLeft, MapPin, Clock, Utensils, Lightbulb, Star, Landmark } from "lucide-react";
import { ShareButton } from "@/components/hud/ShareButton";
import { Flag } from "@/components/ui/Flag";
import { YouTubeFacade } from "@/components/video/YouTubeFacade";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `${city.name} Virtual Walk — Free 4K Tour | Nearaway`;
  const funFactFirst = city.culture.funFact.split(".")[0].trim();
  const description = `${funFactFirst}. Free 4K virtual walk through ${city.name}, ${city.country} — cultural insights, local food, no passport required.`;

  return {
    title,
    description,
    keywords: [
      `${city.name} virtual walk`,
      `${city.name} walking tour`,
      `virtual walk ${city.name}`,
      `${city.name} 4K walk`,
      `${city.country} virtual tour`,
      `${city.name} travel guide`,
      `things to do in ${city.name}`,
      `${city.name} travel tips`,
      `${city.name} culture guide`,
      "virtual travel",
      "4K city walk",
    ],
    alternates: {
      canonical: `https://nearaway.in/walk/${city.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "video.other",
      url: `https://nearaway.in/walk/${city.slug}`,
      siteName: "Nearaway",
      images: [
        {
          url: `/api/og?city=${city.slug}`,
          width: 1200,
          height: 630,
          alt: `${city.name} virtual walk — 4K street-level footage, ${city.country}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nearawayin",
      title: `${city.flagEmoji} ${city.name} Virtual Walk — Free 4K Tour`,
      description: `${funFactFirst}. Explore ${city.name} in immersive 4K — no passport required.`,
      images: [`/api/og?city=${city.slug}`],
    },
  };
}

export default async function CityWalkPage({ params }: Props) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const featuredVideo = getFeaturedVideo(city);
  const cityJourneys = journeys.filter((j) => j.citySlugOrder.includes(city.slug));

  // JSON-LD structured data
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${city.name} 4K Virtual Walking Tour`,
    description: `An immersive 4K virtual walking tour through ${city.name}, ${city.country}. Explore the streets, culture, and atmosphere of ${city.name} from anywhere in the world.`,
    thumbnailUrl: `https://img.youtube.com/vi/${featuredVideo?.youtubeId}/maxresdefault.jpg`,
    // Use per-video publishedAt if known; stable fallback avoids the "Jan 1 current year" false date
    uploadDate: featuredVideo?.publishedAt ?? "2025-01-01",
    embedUrl: `https://www.youtube.com/embed/${featuredVideo?.youtubeId}`,
    ...(featuredVideo?.duration && {
      duration: featuredVideo.duration, // add if populated in cities.json
    }),
    isAccessibleForFree: true,
    ...(cityJourneys.length > 0 && {
      isPartOf: cityJourneys.map((j) => ({
        "@type": "ItemList",
        name: j.name,
        url: `https://nearaway.in/journeys/${j.id}`,
      })),
    }),
    publisher: {
      "@type": "Organization",
      name: "Nearaway",
      url: "https://nearaway.in",
    },
  };

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: city.name,
    description: `Explore ${city.name} virtually with immersive 4K walking tours. ${city.culture.funFact}`,
    url: `https://nearaway.in/walk/${city.slug}`,
    image: `https://img.youtube.com/vi/${featuredVideo?.youtubeId}/maxresdefault.jpg`,
    address: {
      "@type": "PostalAddress",
      addressCountry: city.countryCode,
      addressLocality: city.name,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    touristType: ["Virtual traveler", "Cultural explorer"],
  };

  const continentSlug = city.continent.toLowerCase();
  const countrySlug = city.country.toLowerCase().replace(/\s+/g, "-");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Nearaway", item: "https://nearaway.in" },
      { "@type": "ListItem", position: 2, name: city.continent, item: `https://nearaway.in/continent/${continentSlug}` },
      { "@type": "ListItem", position: 3, name: city.country, item: `https://nearaway.in/country/${countrySlug}` },
      { "@type": "ListItem", position: 4, name: city.name, item: `https://nearaway.in/walk/${city.slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the best time to visit ${city.name}?`,
        acceptedAnswer: { "@type": "Answer", text: city.culture.bestSeason },
      },
      {
        "@type": "Question",
        name: `What food should I try in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Must-try foods in ${city.name} include: ${city.culture.mustEat.join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${city.name} known for?`,
        acceptedAnswer: { "@type": "Answer", text: city.culture.funFact },
      },
      {
        "@type": "Question",
        name: `How do locals greet each other in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `In ${city.name}, locals say "${city.culture.greeting}".`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="h-full overflow-y-auto bg-void text-white">
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 bg-void/80 backdrop-blur-md border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-ember" />
            <span className="font-bold text-lg tracking-tight">
              Near<span className="text-ember">away</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Cities
          </Link>
        </nav>

        {/* Hero */}
        <div className="relative pt-16">
          {/* YouTube Facade — thumbnail loads instantly (LCP), iframe loads on click */}
          <div className="relative w-full" style={{ paddingBottom: "min(56.25%, 70vh)" }}>
            {featuredVideo ? (
              <YouTubeFacade
                youtubeId={featuredVideo.youtubeId}
                title={`${city.name} 4K Virtual Walk`}
                citySlug={city.slug}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <p className="text-white/40">Video coming soon</p>
              </div>
            )}
          </div>

          {/* Gradient overlay at bottom of hero */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-void to-transparent pointer-events-none" />
        </div>

        {/* City Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-start gap-3 sm:gap-5 mb-6">
            <div className="flex-shrink-0 mt-1">
              <span className="block sm:hidden">
                <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={40} className="rounded-md" />
              </span>
              <span className="hidden sm:block">
                <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={64} className="rounded-md" />
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-1">{city.name} Virtual Walk</h1>
              <div className="flex items-center gap-2 text-white/50 text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <Link href={`/country/${countryToSlug(city.country)}`} className="hover:text-ember transition-colors">{city.country}</Link>
                <span className="w-px h-3 bg-white/20" />
                <Link href={`/continent/${city.continent.toLowerCase()}`} className="hover:text-ember transition-colors">{city.continent}</Link>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/?city=${city.slug}`}
            className="inline-flex items-center gap-3 bg-ember hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors mb-10"
          >
            <Globe className="w-4 h-4" />
            Explore {city.name} on Nearaway
          </Link>

          {/* SEO Intro — server-rendered text for Google snippets */}
          <div className="mb-8 text-white/65 leading-relaxed space-y-3 text-sm sm:text-base">
            <p>
              Take a free virtual walking tour through {city.name}, {city.country} — home to {city.population.toLocaleString("en")} people
              and one of {city.continent}&apos;s most remarkable cities.
              Nearaway streams immersive 4K street-level footage from {city.name}, letting you explore its
              neighbourhoods, culture, and atmosphere from anywhere in the world — no passport, no flights, no account required.
              {city.videos && city.videos.length > 1 && ` This virtual walk collection includes ${city.videos.length} different 4K walking tour videos across ${city.name}.`}
            </p>
            {city.origin?.story && (
              <p>{city.origin.story}</p>
            )}
            <p>
              {city.culture.funFact} The best time to take a virtual walk through {city.name} is {city.culture.bestSeason.toLowerCase()}.
              Must-try local foods in {city.name} include {city.culture.mustEat.slice(0, 3).join(", ")}.
              {" "}{city.culture.localTip}
            </p>
          </div>

          {/* Culture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

            {/* Greeting */}
            <div className="rounded-2xl bg-white/4 border border-white/8 p-5">
              <h2 className="text-xs tracking-widest uppercase text-white/30 mb-2">Local Greeting</h2>
              <p className="text-2xl font-bold mb-1">{city.culture.greeting}</p>
              <p className="text-white/40 text-sm">How locals say hello in {city.name}</p>
            </div>

            {/* Best Season */}
            <div className="rounded-2xl bg-white/4 border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-white/30" />
                <h2 className="text-xs tracking-widest uppercase text-white/30">Best Time to Visit</h2>
              </div>
              <p className="font-semibold">{city.culture.bestSeason}</p>
            </div>

            {/* Must Eat */}
            <div className="rounded-2xl bg-white/4 border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-3.5 h-3.5 text-white/30" />
                <h2 className="text-xs tracking-widest uppercase text-white/30">Must Eat</h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {city.culture.mustEat.map((food) => (
                  <span
                    key={food}
                    className="px-2.5 py-1 rounded-full bg-ember/10 border border-ember/20 text-ember text-sm"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>

            {/* Local Tip */}
            <div className="rounded-2xl bg-white/4 border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-white/30" />
                <h2 className="text-xs tracking-widest uppercase text-white/30">Local Tip</h2>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{city.culture.localTip}</p>
            </div>
          </div>

          {/* Origin Story */}
          {city.origin && (
            <div className="rounded-2xl border border-ember/20 overflow-hidden mb-8">
              <div className="flex items-center gap-2.5 px-5 py-3 bg-ember/8 border-b border-ember/15">
                <Landmark className="w-4 h-4 text-white/40" />
                <h2 className="text-xs tracking-widest uppercase text-white/50 font-semibold">Origin Story</h2>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-ember/15 text-ember/70 border border-ember/20 font-medium">
                  {city.origin.era}
                </span>
              </div>
              <div className="px-5 py-4 bg-ember/4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40 mb-3">
                  <span>📅 Founded {city.origin.founded}</span>
                  {city.origin.originalName && (
                    <span>Originally <span className="text-white/60 font-medium">{city.origin.originalName}</span></span>
                  )}
                  <span>By {city.origin.founders}</span>
                </div>
                <p className="text-white/80 leading-relaxed">{city.origin.story}</p>
              </div>
            </div>
          )}

          {/* Fun Fact */}
          <div className="rounded-2xl bg-gradient-to-br from-ember/10 to-ember/5 border border-ember/20 p-5 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-3.5 h-3.5 text-ember" />
              <h2 className="text-xs tracking-widest uppercase text-ember flex-1">Fun Fact</h2>
              <ShareButton citySlug={city.slug} cityName={city.name} flagEmoji={city.flagEmoji} />
            </div>
            <p className="text-white/90 leading-relaxed">{city.culture.funFact}</p>
          </div>

          {/* Dos & Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-5">
              <h2 className="text-xs tracking-widest uppercase text-emerald-400 mb-3">Cultural Dos</h2>
              <ul className="space-y-2">
                {city.culture.culturalDos.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-rose-500/5 border border-rose-500/15 p-5">
              <h2 className="text-xs tracking-widest uppercase text-rose-400 mb-3">Cultural Don&apos;ts</h2>
              <ul className="space-y-2">
                {city.culture.culturalDonts.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-rose-400 mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Journeys featuring this city */}
          {cityJourneys.length > 0 && (
            <div className="border-t border-white/8 pt-8 mb-8">
              <h2 className="text-xs tracking-widest uppercase text-white/30 mb-4">Part of These Journeys</h2>
              <div className="flex flex-col gap-2">
                {cityJourneys.map((journey) => (
                  <Link
                    key={journey.id}
                    href={`/journeys/${journey.id}`}
                    className="group flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/8 px-4 py-3 hover:border-white/20 transition-colors"
                  >
                    <span className="text-2xl leading-none flex-shrink-0">{journey.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white group-hover:text-ember transition-colors text-sm">{journey.name}</p>
                      <p className="text-white/40 text-xs mt-0.5">{journey.tagline}</p>
                    </div>
                    <span className="text-white/25 text-xs flex-shrink-0">{journey.citySlugOrder.length} cities →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* More cities */}
          <div className="border-t border-white/8 pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs tracking-widest uppercase text-white/30">Explore More Cities</h2>
              <Link
                href={`/continent/${city.continent.toLowerCase()}`}
                className="text-xs text-white/35 hover:text-ember transition-colors"
              >
                All {city.continent} cities →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ...cities.filter((c) => c.slug !== city.slug && c.continent === city.continent),
                ...cities.filter((c) => c.slug !== city.slug && c.continent !== city.continent),
              ]
                .slice(0, 12)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/walk/${c.slug}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 hover:border-white/20 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <Flag countryCode={c.countryCode} flagEmoji={c.flagEmoji} size={16} />
                    <span>{c.name}</span>
                  </Link>
                ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 text-center pb-12">
            <p className="text-white/30 text-sm mb-4">
              Nearaway — A window to every place on Earth
            </p>
            <div className="flex items-center justify-center gap-5 text-sm">
              <Link href="/" className="inline-flex items-center gap-2 text-ember hover:text-amber-400 font-medium transition-colors">
                <Globe className="w-4 h-4" />
                Open the Globe
              </Link>
              <span className="text-white/20">·</span>
              <Link href="/journeys" className="text-white/40 hover:text-white transition-colors">
                Journeys
              </Link>
              <span className="text-white/20">·</span>
              <Link href="/about" className="text-white/40 hover:text-white transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
