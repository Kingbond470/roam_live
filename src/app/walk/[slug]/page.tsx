import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCityBySlug } from "@/lib/cities";
import { getFeaturedVideo } from "@/lib/utils";
import { Globe, ArrowLeft, MapPin, Clock, Utensils, Lightbulb, Star } from "lucide-react";

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

  const title = `Walk ${city.name}, ${city.country} — 4K Virtual Walking Tour | Roam.Live`;
  const description = `Take a free virtual 4K walking tour through ${city.name}, ${city.country}. Explore ${city.culture.mustEat.slice(0, 2).join(", ")}, local culture, and more. No passport required.`;

  return {
    title,
    description,
    keywords: [
      `${city.name} walking tour`,
      `virtual walk ${city.name}`,
      `${city.name} 4K walk`,
      `${city.country} virtual tour`,
      `explore ${city.name} online`,
      "virtual travel",
      "4K city walk",
    ],
    alternates: {
      canonical: `https://roam.live/walk/${city.slug}`,
    },
    openGraph: {
      title: `Walk ${city.name} — Free 4K Virtual Tour | Roam.Live`,
      description,
      type: "video.other",
      url: `https://roam.live/walk/${city.slug}`,
      siteName: "Roam.Live",
      images: [
        {
          url: `/api/og?city=${city.slug}`,
          width: 1200,
          height: 630,
          alt: `Virtual walk through ${city.name}, ${city.country}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@roamlive",
      title: `${city.flagEmoji} Walk ${city.name} — Free 4K Virtual Tour`,
      description: `Explore ${city.name} from your couch. Immersive 4K walking tour with cultural insights. #VirtualTravel #${city.name.replace(/\s+/g, "")}`,
      images: [`/api/og?city=${city.slug}`],
    },
  };
}

export default async function CityWalkPage({ params }: Props) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const featuredVideo = getFeaturedVideo(city);
  const localCityName = city.timezone.split("/").pop()?.replace(/_/g, " ") ?? city.name;

  // JSON-LD structured data
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${city.name} 4K Virtual Walking Tour`,
    description: `An immersive 4K virtual walking tour through ${city.name}, ${city.country}. Explore the streets, culture, and atmosphere of ${city.name} from anywhere in the world.`,
    thumbnailUrl: `https://img.youtube.com/vi/${featuredVideo?.youtubeId}/maxresdefault.jpg`,
    uploadDate: "2024-01-01",
    embedUrl: `https://www.youtube.com/embed/${featuredVideo?.youtubeId}`,
    publisher: {
      "@type": "Organization",
      name: "Roam.Live",
      url: "https://roam.live",
    },
  };

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: city.name,
    description: `Explore ${city.name} virtually with immersive 4K walking tours. ${city.culture.funFact}`,
    url: `https://roam.live/walk/${city.slug}`,
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

      <div className="min-h-screen bg-[#050508] text-white">
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050508]/80 backdrop-blur-md border-b border-white/5">
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
            All Cities
          </Link>
        </nav>

        {/* Hero */}
        <div className="relative pt-16">
          {/* YouTube Embed */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {featuredVideo ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}?autoplay=0&rel=0&modestbranding=1&start=90`}
                title={`${city.name} 4K Virtual Walk`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <p className="text-white/40">Video coming soon</p>
              </div>
            )}
          </div>

          {/* Gradient overlay at bottom of hero */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none" />
        </div>

        {/* City Header */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start gap-5 mb-6">
            <span className="text-6xl">{city.flagEmoji}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-1">{city.name}</h1>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{city.country}</span>
                <span className="w-px h-3 bg-white/20" />
                <span>{city.continent}</span>
                {city.tags.length > 0 && (
                  <>
                    <span className="w-px h-3 bg-white/20" />
                    <div className="flex gap-1">
                      {city.tags.filter(t => t !== "new").slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/?city=${city.slug}`}
            className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors mb-10"
          >
            <Globe className="w-4 h-4" />
            Explore {city.name} in Roam.Live
          </Link>

          {/* Culture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

            {/* Greeting */}
            <div className="rounded-2xl bg-white/4 border border-white/8 p-5">
              <h2 className="text-xs tracking-widest uppercase text-amber-400/80 mb-2">Local Greeting</h2>
              <p className="text-2xl font-bold mb-1">{city.culture.greeting}</p>
              <p className="text-white/40 text-sm">How locals say hello in {city.name}</p>
            </div>

            {/* Best Season */}
            <div className="rounded-2xl bg-white/4 border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                <h2 className="text-xs tracking-widest uppercase text-amber-400/80">Best Time to Visit</h2>
              </div>
              <p className="font-semibold">{city.culture.bestSeason}</p>
            </div>

            {/* Must Eat */}
            <div className="rounded-2xl bg-white/4 border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-3.5 h-3.5 text-amber-400/80" />
                <h2 className="text-xs tracking-widest uppercase text-amber-400/80">Must Eat</h2>
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

            {/* Local Tip */}
            <div className="rounded-2xl bg-white/4 border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400/80" />
                <h2 className="text-xs tracking-widest uppercase text-amber-400/80">Local Tip</h2>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{city.culture.localTip}</p>
            </div>
          </div>

          {/* Fun Fact */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-5 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <h2 className="text-xs tracking-widest uppercase text-amber-400">Fun Fact</h2>
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

          {/* More cities */}
          <div className="border-t border-white/8 pt-8">
            <h2 className="text-xs tracking-widest uppercase text-white/30 mb-4">Explore More Cities</h2>
            <div className="flex flex-wrap gap-2">
              {cities
                .filter((c) => c.slug !== city.slug)
                .slice(0, 12)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/walk/${c.slug}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 hover:border-white/20 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <span>{c.flagEmoji}</span>
                    <span>{c.name}</span>
                  </Link>
                ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 text-center pb-12">
            <p className="text-white/30 text-sm mb-4">
              Roam.Live — A window to every place on Earth
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              <Globe className="w-4 h-4" />
              Open the Globe
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
