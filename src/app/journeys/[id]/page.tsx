import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, ArrowLeft, MapPin, Utensils, Star, Compass } from "lucide-react";
import { Flag } from "@/components/ui/Flag";
import { cities } from "@/lib/cities";
import { journeys } from "@/data/journeys";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return journeys.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const journey = journeys.find((j) => j.id === id);
  if (!journey) return {};

  const journeyCities = journey.citySlugOrder
    .map((s) => cities.find((c) => c.slug === s))
    .filter(Boolean) as typeof cities;

  const cityNames = journeyCities.map((c) => c.name).join(", ");
  const title = `${journey.name} — Virtual City Journey | Nearaway`;
  const description = `Take the ${journey.name} virtual journey through ${cityNames}. ${journey.tagline}. Free 4K walking tours, no passport required.`;

  return {
    title,
    description,
    keywords: [
      journey.name,
      journey.tagline,
      ...journeyCities.map((c) => `${c.name} virtual tour`),
      "themed virtual city tour",
      "curated city journey",
      "4K virtual walk",
    ],
    alternates: { canonical: `https://nearaway.in/journeys/${id}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://nearaway.in/journeys/${id}`,
      siteName: "Nearaway",
      images: [{ url: `/api/og?type=journeys`, width: 1200, height: 630, alt: journey.name }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nearawayin",
      title: `${journey.emoji} ${journey.name} — ${journey.tagline}`,
      description,
      images: [`/api/og?type=journeys`],
    },
  };
}

export default async function JourneyDetailPage({ params }: Props) {
  const { id } = await params;
  const journey = journeys.find((j) => j.id === id);
  if (!journey) notFound();

  const journeyCities = journey.citySlugOrder
    .map((s) => cities.find((c) => c.slug === s))
    .filter(Boolean) as typeof cities;

  const totalVideos = journeyCities.reduce((s, c) => s + c.videos.length, 0);
  const continents = [...new Set(journeyCities.map((c) => c.continent))];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: journey.name,
    description: `${journey.tagline}. A curated virtual journey through ${journeyCities.map((c) => c.name).join(", ")}.`,
    url: `https://nearaway.in/journeys/${id}`,
    numberOfItems: journeyCities.length,
    itemListElement: journeyCities.map((city, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: city.name,
      url: `https://nearaway.in/walk/${city.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Nearaway", item: "https://nearaway.in" },
      { "@type": "ListItem", position: 2, name: "Journeys", item: "https://nearaway.in/journeys" },
      { "@type": "ListItem", position: 3, name: journey.name, item: `https://nearaway.in/journeys/${id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="h-full overflow-y-auto bg-void text-white">
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-void/80 backdrop-blur-md border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-lg tracking-tight">
              Near<span className="text-amber-400">away</span>
            </span>
          </Link>
          <Link
            href="/journeys"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Journeys
          </Link>
        </nav>

        {/* Hero */}
        <section
          className="relative pt-28 pb-16 px-4 sm:px-6 text-center overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${journey.accentColor}15 0%, transparent 70%)`,
            }}
          />
          <p className="text-xs tracking-widest uppercase font-semibold mb-5" style={{ color: journey.accentColor + "cc" }}>
            Curated Journey
          </p>
          <div className="text-6xl sm:text-8xl mb-5">{journey.emoji}</div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3">{journey.name}</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">{journey.tagline}</p>

          <div className="inline-flex items-center gap-5 sm:gap-8 bg-white/4 border border-white/8 rounded-2xl px-5 sm:px-8 py-3 sm:py-4 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: journey.accentColor }}>{journeyCities.length}</p>
              <p className="text-white/40 text-xs mt-0.5">Cities</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: journey.accentColor }}>{totalVideos}+</p>
              <p className="text-white/40 text-xs mt-0.5">Walks</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: journey.accentColor }}>{continents.length}</p>
              <p className="text-white/40 text-xs mt-0.5">{continents.length === 1 ? "Continent" : "Continents"}</p>
            </div>
          </div>

          <div>
            <Link
              href={`/?journey=${journey.id}`}
              className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full text-sm transition-colors"
              style={{ background: journey.accentColor, color: "#000" }}
            >
              <Compass className="w-4 h-4" />
              Start this Journey on the Globe
            </Link>
          </div>
        </section>

        {/* SEO Intro */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-2">
          <div className="text-white/55 leading-relaxed space-y-3 text-sm sm:text-base mb-8">
            <p>
              The {journey.name} is a curated virtual journey through {journeyCities.map((c) => c.name).join(", ")}.
              Take a free virtual walk through each city in sequence — {totalVideos}+ immersive 4K walking tour videos,
              no passport or account required.
            </p>
            <p>
              This virtual journey spans {continents.length === 1 ? continents[0] : continents.join(" and ")} and covers{" "}
              {journeyCities.length} cities hand-picked for their cultural depth and walkability.
              {" "}{journey.tagline}.
            </p>
          </div>
        </section>

        {/* City sequence */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-6">The Route</p>

          <div className="flex flex-col">
            {journeyCities.map((city, idx) => (
              <div key={city.slug} className="flex gap-4">
                {/* Step connector */}
                <div className="flex flex-col items-center gap-0 w-8 flex-shrink-0 pt-1.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border"
                    style={{
                      background: journey.accentColor + "20",
                      borderColor: journey.accentColor + "50",
                      color: journey.accentColor,
                    }}
                  >
                    {idx + 1}
                  </div>
                  {idx < journeyCities.length - 1 && (
                    <div
                      className="w-px flex-1 mt-1"
                      style={{
                        minHeight: "40px",
                        background: `linear-gradient(to bottom, ${journey.accentColor}40, ${journey.accentColor}10)`,
                      }}
                    />
                  )}
                </div>

                {/* City card */}
                <div className={`flex-1 pb-6 ${idx < journeyCities.length - 1 ? "" : ""}`}>
                  <Link
                    href={`/walk/${city.slug}`}
                    className="group block rounded-2xl bg-white/[0.03] border border-white/8 p-5 hover:border-white/20 transition-colors mb-0"
                    style={{ borderColor: journey.accentColor + "20" }}
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={40} className="flex-shrink-0 rounded-sm" />
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                          {city.name}
                        </h2>
                        <div className="flex items-center gap-2 text-white/40 text-sm mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{city.country}</span>
                          <span className="w-px h-3 bg-white/15" />
                          <span>{city.continent}</span>
                        </div>
                      </div>
                      <div
                        className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          background: journey.accentColor + "15",
                          color: journey.accentColor,
                          border: `1px solid ${journey.accentColor}30`,
                        }}
                      >
                        {city.videos.length} walk{city.videos.length !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-3">
                      {city.culture.funFact}
                    </p>

                    {city.culture.mustEat.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Utensils className="w-3 h-3 text-white/25 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1.5">
                          {city.culture.mustEat.slice(0, 3).map((food) => (
                            <span
                              key={food}
                              className="px-2 py-0.5 rounded-full bg-white/5 text-white/45 text-xs"
                            >
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fun facts strip */}
        <section
          className="border-y py-14 px-4 sm:px-6"
          style={{ borderColor: journey.accentColor + "20", background: journey.accentColor + "06" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-4 h-4" style={{ color: journey.accentColor }} />
              <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: journey.accentColor + "cc" }}>
                Journey Highlights
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {journeyCities.slice(0, 4).map((city) => (
                <div
                  key={city.slug}
                  className="rounded-2xl p-4 border"
                  style={{ background: journey.accentColor + "0a", borderColor: journey.accentColor + "20" }}
                >
                  <p className="text-xs font-semibold mb-1.5" style={{ color: journey.accentColor + "cc" }}>
                    <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={12} className="inline-block mr-1" /> {city.name}
                  </p>
                  <p className="text-white/65 text-sm leading-relaxed">{city.culture.localTip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other journeys */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-5">More Journeys</p>
          <div className="flex flex-col gap-3">
            {journeys
              .filter((j) => j.id !== journey.id)
              .map((j) => (
                <Link
                  key={j.id}
                  href={`/journeys/${j.id}`}
                  className="flex items-center gap-4 rounded-2xl bg-white/[0.03] border border-white/8 p-4 hover:border-white/20 transition-colors"
                >
                  <span className="text-3xl leading-none">{j.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{j.name}</p>
                    <p className="text-white/40 text-sm">{j.tagline}</p>
                  </div>
                  <span className="text-white/25 text-xs">{j.citySlugOrder.length} cities →</span>
                </Link>
              ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/6 py-16 px-4 text-center">
          <p className="text-white/40 text-sm mb-3">Ready to walk these cities?</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-7">
            Start the {journey.name} Journey.
          </h2>
          <Link
            href={`/?journey=${journey.id}`}
            className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full transition-colors"
            style={{ background: journey.accentColor, color: "#000" }}
          >
            <Compass className="w-4 h-4" />
            Open on the Globe
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
          <div className="flex items-center justify-center gap-4 text-white/30 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Globe</Link>
            <span>·</span>
            <Link href="/journeys" className="hover:text-white transition-colors">All Journeys</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
