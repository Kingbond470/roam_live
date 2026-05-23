import { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowLeft, MapPin } from "lucide-react";
import { Flag } from "@/components/ui/Flag";
import { cities } from "@/lib/cities";
import { journeys } from "@/data/journeys";

export const metadata: Metadata = {
  title: "Curated Virtual City Journeys — Themed 4K Walking Tours | Nearaway",
  description:
    "Follow hand-picked virtual walking routes across the world's greatest cities. Ancient Empires, Neon After Dark, Street Food Trail — thematic 4K virtual journeys, no passport required.",
  keywords: [
    "virtual city journey",
    "themed virtual walk",
    "curated city walk",
    "virtual travel route",
    "ancient cities virtual tour",
    "4K city journey",
    "free virtual walking tour",
  ],
  alternates: { canonical: "https://nearaway.in/journeys" },
  openGraph: {
    title: "Curated Virtual City Journeys | Nearaway",
    description:
      "Follow themed virtual walking routes across the world's greatest cities — Ancient Empires, Neon After Dark, Street Food Trail, and more.",
    type: "website",
    url: "https://nearaway.in/journeys",
    siteName: "Nearaway",
    images: [{ url: "/api/og?type=journeys", width: 1200, height: 630, alt: "Nearaway — Virtual City Journeys" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nearawayin",
    title: "Curated Virtual City Journeys | Nearaway",
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
    name: "Nearaway Curated City Journeys",
    description: "Themed virtual walking tour routes across the world's greatest cities.",
    url: "https://nearaway.in/journeys",
    numberOfItems: journeys.length,
    itemListElement: journeysWithCities.map((j, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: j.name,
      description: j.tagline,
      url: `https://nearaway.in/journeys/${j.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="h-full overflow-y-auto bg-void text-white">
        {/* Nav — fixed 64px */}
        <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8 bg-void/80 backdrop-blur-md border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-ember" />
            <span className="font-bold text-lg tracking-tight">
              Near<span className="text-ember">away</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Globe
          </Link>
        </nav>

        {/* Hero */}
        <section className="relative pt-36 pb-20 px-4 sm:px-8 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 70%)",
            }}
          />
          <p className="text-white/30 text-xs tracking-[0.15em] uppercase font-medium mb-6">
            Curated Routes
          </p>
          <h1 className="font-display text-5xl sm:text-7xl font-normal tracking-tight leading-[1.05] mb-6 max-w-3xl mx-auto">
            Not just cities.<br />
            <span className="text-ember">Journeys.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            Hand-picked sequences of cities connected by a theme — history, nightlife, food, coastlines.
            Follow the route one city at a time, or jump anywhere on the map.
          </p>

          <div className="inline-flex items-center gap-8 bg-white/[0.04] border border-white/8 rounded-2xl px-8 py-5">
            <div className="text-center">
              <p className="text-3xl font-bold text-ember">{journeys.length}</p>
              <p className="text-white/35 text-xs tracking-widest uppercase mt-1">Journeys</p>
            </div>
            <div className="w-px h-8 bg-white/8" />
            <div className="text-center">
              <p className="text-3xl font-bold text-ember">{citiesInJourneys}</p>
              <p className="text-white/35 text-xs tracking-widest uppercase mt-1">Cities</p>
            </div>
          </div>
        </section>

        {/* Journey cards — rounded-2xl, consistent radius */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-24 flex flex-col gap-5">
          {journeysWithCities.map((journey) => (
            <div
              key={journey.id}
              id={journey.id}
              className="rounded-2xl bg-white/[0.03] border overflow-hidden"
              style={{ borderColor: journey.accentColor + "28" }}
            >
              {/* Journey header */}
              <div
                className="px-6 py-6 flex items-start justify-between gap-4"
                style={{ background: journey.accentColor + "0d" }}
              >
                <Link href={`/journeys/${journey.id}`} className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity">
                  <span className="text-4xl">{journey.emoji}</span>
                  <div>
                    <h2 className="font-display text-2xl font-normal text-white leading-snug">
                      {journey.name}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: journey.accentColor + "b3" }}>
                      {journey.tagline}
                    </p>
                  </div>
                </Link>
                <div
                  className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border"
                  style={{
                    background: journey.accentColor + "15",
                    color: journey.accentColor,
                    borderColor: journey.accentColor + "35",
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
                        <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={20} className="flex-shrink-0 rounded-sm" />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-white group-hover:text-ember transition-colors">
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
        <section className="border-t border-white/6 py-24 px-4 text-center">
          <p className="text-white/35 text-sm mb-4 tracking-wide">Prefer to explore freely?</p>
          <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight mb-10 leading-[1.1]">
            Pick any city on the globe.
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-ember hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-full transition-colors"
          >
            <Globe className="w-4 h-4" />
            Open the Globe
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Globe className="w-4 h-4 text-ember" />
            <span className="font-bold tracking-tight">
              Near<span className="text-ember">away</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-5 text-white/30 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Globe</Link>
            <span className="text-white/10">·</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span className="text-white/10">·</span>
            <Link href="/journeys" className="text-white/50 hover:text-white transition-colors">Journeys</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
