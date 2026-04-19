import { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowLeft, MapPin } from "lucide-react";
import { cities } from "@/lib/cities";
import { journeys } from "@/data/journeys";

export const metadata: Metadata = {
  title: "Curated City Journeys — Themed Virtual Walking Tours | Nearaway.in",
  description:
    "Follow hand-picked routes across the world's greatest cities. Ancient Empires, Neon After Dark, Street Food Trail — thematic 4K virtual journeys, no passport required.",
  keywords: [
    "themed virtual city tour",
    "curated city journey",
    "virtual travel route",
    "ancient cities virtual tour",
    "neon cities walk",
    "street food cities tour",
    "4K city journey",
  ],
  alternates: { canonical: "https://nearaway.in/journeys" },
  openGraph: {
    title: "Curated City Journeys | Nearaway.in",
    description:
      "Follow themed routes across the world's greatest cities — Ancient Empires, Neon After Dark, Street Food Trail, and more.",
    type: "website",
    url: "https://nearaway.in/journeys",
    siteName: "Nearaway.in",
    images: [{ url: "/api/og?type=journeys", width: 1200, height: 630, alt: "Nearaway.in City Journeys" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nearawayin",
    title: "Curated City Journeys | Nearaway.in",
    description:
      "Follow themed routes across the world's greatest cities — Ancient Empires, Neon After Dark, Street Food Trail, and more.",
    images: ["/api/og?type=journeys"],
  },
};

export default function JourneysPage() {
  const citiesInJourneys = new Set(journeys.flatMap((j) => j.citySlugOrder)).size;

  const journeysWithCities = journeys.map((journey) => ({
    ...journey,
    resolvedCities: journey.citySlugOrder
      .map((slug) => cities.find((c) => c.slug === slug))
      .filter(Boolean) as typeof cities,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nearaway.in Curated City Journeys",
    description: "Themed virtual walking tour routes across the world's greatest cities.",
    url: "https://nearaway.in/journeys",
    numberOfItems: journeys.length,
    itemListElement: journeysWithCities.map((j, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: j.name,
      description: j.tagline,
      url: `https://nearaway.in/journeys#${j.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-full overflow-y-auto bg-[#050508] text-white">
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#050508]/80 backdrop-blur-md border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-lg tracking-tight">
              Nearaway<span className="text-amber-400">.in</span>
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

        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4 sm:px-6 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)",
            }}
          />
          <p className="text-amber-400/80 text-xs tracking-widest uppercase font-semibold mb-5">
            Curated Routes
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight mb-5 max-w-3xl mx-auto">
            Not just cities.<br />
            <span className="text-amber-400">Journeys.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Hand-picked sequences of cities connected by a theme — history, nightlife, food, coastlines.
            Follow the route one city at a time, or jump anywhere on the map.
          </p>

          <div className="inline-flex items-center gap-8 bg-white/4 border border-white/8 rounded-2xl px-8 py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{journeys.length}</p>
              <p className="text-white/40 text-xs mt-0.5">Journeys</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{citiesInJourneys}</p>
              <p className="text-white/40 text-xs mt-0.5">Cities featured</p>
            </div>
          </div>
        </section>

        {/* Journey cards */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 flex flex-col gap-6">
          {journeysWithCities.map((journey) => (
            <div
              key={journey.id}
              id={journey.id}
              className="rounded-3xl bg-white/[0.03] border border-white/8 overflow-hidden"
              style={{ borderColor: journey.accentColor + "30" }}
            >
              {/* Journey header */}
              <div
                className="px-6 py-5 flex items-start justify-between gap-4"
                style={{ background: journey.accentColor + "10" }}
              >
                <Link href={`/journeys/${journey.id}`} className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity">
                  <span className="text-4xl">{journey.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{journey.name}</h2>
                    <p className="text-sm mt-0.5" style={{ color: journey.accentColor + "cc" }}>
                      {journey.tagline}
                    </p>
                  </div>
                </Link>
                <div
                  className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{
                    background: journey.accentColor + "18",
                    color: journey.accentColor,
                    borderColor: journey.accentColor + "40",
                  }}
                >
                  {journey.resolvedCities.length} cities
                </div>
              </div>

              {/* City sequence */}
              <div className="px-6 py-5">
                <div className="flex flex-col gap-3">
                  {journey.resolvedCities.map((city, idx) => (
                    <div key={city.slug} className="flex items-center gap-3">
                      {/* Step connector */}
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-6">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: journey.accentColor }}
                        />
                        {idx < journey.resolvedCities.length - 1 && (
                          <div
                            className="w-px flex-1"
                            style={{
                              height: "16px",
                              background: `linear-gradient(to bottom, ${journey.accentColor}60, transparent)`,
                            }}
                          />
                        )}
                      </div>

                      <Link
                        href={`/walk/${city.slug}`}
                        className="group flex items-center gap-3 flex-1 py-1 hover:opacity-80 transition-opacity"
                      >
                        <span className="text-xl leading-none">{city.flagEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                            {city.name}
                          </span>
                          <span className="text-white/40 text-sm ml-2">{city.country}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/25 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{city.videos.length} walk{city.videos.length !== 1 ? "s" : ""}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-5 pt-4 border-t" style={{ borderColor: journey.accentColor + "20" }}>
                  <Link
                    href={`/?journey=${journey.id}`}
                    className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
                    style={{
                      background: journey.accentColor + "18",
                      color: journey.accentColor,
                      border: `1px solid ${journey.accentColor}35`,
                    }}
                  >
                    <Globe className="w-4 h-4" />
                    Start this journey on the Globe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-white/6 py-16 px-4 text-center">
          <p className="text-white/40 text-sm mb-3">Prefer to explore freely?</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-7">
            Pick any city on the globe.
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-7 py-3.5 rounded-full transition-colors"
          >
            <Globe className="w-4 h-4" />
            Open the Globe
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-tight">
              Nearaway<span className="text-amber-400">.in</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-white/30 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Globe</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>·</span>
            <Link href="/journeys" className="text-white/50 hover:text-white transition-colors">Journeys</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
