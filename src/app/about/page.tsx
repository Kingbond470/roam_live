import { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowLeft, MapPin, Film, Compass, SplitSquareHorizontal, BookOpen, Heart } from "lucide-react";
import { cities } from "@/lib/cities";

export const metadata: Metadata = {
  title: "About Nearaway.in — Free 4K Virtual City Walks, No Passport",
  description:
    "Nearaway.in brings immersive 4K virtual city walks and cultural intelligence to anyone with a browser. 62 cities, 5 continents, no passport required.",
  openGraph: {
    title: "About Nearaway.in — A Window to Every Place on Earth",
    description: "Explore 62 cities across 5 continents with 4K walks and deep cultural insight.",
    url: "https://nearaway.in/about",
    siteName: "Nearaway.in",
  },
};

const CONTINENTS = ["Asia", "Europe", "Americas", "Africa", "Oceania"] as const;

const FEATURES = [
  {
    icon: Globe,
    title: "Interactive Globe",
    description:
      "Spin a live 3D globe and tap any city pin to instantly drop into its streets. Every pin reflects how many walks that city has.",
    href: "/",
  },
  {
    icon: Film,
    title: "Time-Aware Videos",
    description:
      "Morning light, golden hour, or neon-lit nights — the walk you see matches the time of day in that city when you arrive.",
    href: null,
  },
  {
    icon: BookOpen,
    title: "Culture Cards",
    description:
      "Every city comes with local greetings, must-eat dishes, dos and don'ts, and an origin story. Travel prep that fits on a screen.",
    href: null,
  },
  {
    icon: Compass,
    title: "Thematic Journeys",
    description:
      "Curated routes like 'Ancient Wonders' or 'Neon Megacities' guide you through hand-picked city sequences, one walk at a time.",
    href: "/journeys",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Side-by-Side Compare",
    description:
      "Can't decide between Tokyo and Seoul? Watch both simultaneously in split-screen and compare culture, food, and climate.",
    href: "/compare/tokyo-vs-seoul",
  },
  {
    icon: Heart,
    title: "Save Your Walks",
    description:
      "Heart any city to save it. Filter the globe to just your saved cities and build your personal travel wishlist.",
    href: null,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Open the Globe",
    description: "Land on a spinning 3D Earth with every city pinned and ready.",
  },
  {
    number: "02",
    title: "Tap Any City",
    description: "The globe zooms in, the city fades up, and you're on the street in seconds.",
  },
  {
    number: "03",
    title: "Explore & Learn",
    description: "Swipe between cities, read culture cards, or follow a curated journey path.",
  },
];

export default function AboutPage() {
  const totalVideos = cities.reduce((sum, c) => sum + c.videos.length, 0);
  const cityCount = cities.length;
  const continentCount = new Set(cities.map((c) => c.continent)).size;

  const citiesByContinent = CONTINENTS.map((continent) => ({
    continent,
    cities: cities.filter((c) => c.continent === continent),
  }));

  return (
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
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Globe
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 text-center overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        />

        <p className="text-amber-400/80 text-xs tracking-widest uppercase font-semibold mb-5">
          A window to every place on Earth
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
          The world is{" "}
          <span className="text-amber-400">open</span>
          .<br />
          Step inside.
        </h1>
        <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Nearaway.in turns any device into a window onto the world's streets —
          immersive 4K city walks, real local culture, and the freedom to explore
          without a flight.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold px-7 py-3.5 rounded-full text-sm transition-colors"
        >
          <Globe className="w-4 h-4" />
          Open the Globe
        </Link>

        {/* Objection handler — most important trust signal */}
        <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
          {["No account", "No download", "No passport"].map((item, i, arr) => (
            <span key={item} className="flex items-center gap-3">
              <span className="text-white/35 text-sm">{item}</span>
              {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-white/20" />}
            </span>
          ))}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-white/6 py-10 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl sm:text-5xl font-bold text-amber-400 tracking-tight">
              {cityCount}
            </p>
            <p className="text-white/40 text-sm mt-1">Cities</p>
          </div>
          <div>
            <p className="text-3xl sm:text-5xl font-bold text-amber-400 tracking-tight">
              {continentCount}
            </p>
            <p className="text-white/40 text-sm mt-1">Continents</p>
          </div>
          <div>
            <p className="text-3xl sm:text-5xl font-bold text-amber-400 tracking-tight">
              {totalVideos}+
            </p>
            <p className="text-white/40 text-sm mt-1">Walks</p>
          </div>
        </div>
      </section>

      {/* ── Why Nearaway.in ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-amber-400/70 text-xs tracking-widest uppercase font-semibold mb-5">
          Why we built this
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-6">
          Most people will never visit most places.
        </h2>
        <p className="text-white/55 text-base sm:text-lg leading-relaxed mb-5">
          Cost, time, health, responsibility — there are a thousand reasons a trip doesn't happen.
          But curiosity doesn't stop. The urge to know what it feels like to walk through
          Marrakech at dusk, or cross Shibuya at midnight, or wander along the Seine on a grey morning — that stays.
        </p>
        <p className="text-white/55 text-base sm:text-lg leading-relaxed">
          Nearaway.in was built for that curiosity. Not as a replacement for travel, but as a
          companion to it — a place to preview, revisit, or simply wander without a reason.
        </p>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white/[0.02] border-y border-white/6 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-400/70 text-xs tracking-widest uppercase font-semibold text-center mb-12">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <span
                  className="block text-6xl sm:text-7xl font-bold tracking-tighter mb-4 leading-none"
                  style={{ color: "rgba(245,158,11,0.12)" }}
                >
                  {step.number}
                </span>
                <h3 className="text-lg font-bold mb-2 -mt-2">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <p className="text-amber-400/70 text-xs tracking-widest uppercase font-semibold text-center mb-12">
          What's inside
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const inner = (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  {f.href && (
                    <span className="ml-auto text-amber-400/50 text-xs">Try it →</span>
                  )}
                </div>
                <p className="text-white/45 text-sm leading-relaxed">{f.description}</p>
              </>
            );
            return f.href ? (
              <Link
                key={f.title}
                href={f.href}
                className="rounded-2xl bg-white/[0.03] border border-white/8 p-5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors block"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={f.title}
                className="rounded-2xl bg-white/[0.03] border border-white/8 p-5 hover:border-white/16 transition-colors"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Cities by continent ── */}
      <section className="bg-white/[0.02] border-y border-white/6 py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-400/70 text-xs tracking-widest uppercase font-semibold text-center mb-3">
            Explore the world
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12">
            {cityCount} cities across {continentCount} continents
          </h2>

          <div className="flex flex-col gap-6">
            {citiesByContinent.map(({ continent, cities: cs }) => (
              <div key={continent}>
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-amber-400/60" />
                  <span className="text-xs text-amber-400/70 uppercase tracking-widest font-semibold">
                    {continent}
                  </span>
                  <span className="text-white/20 text-xs">{cs.length} cities</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cs.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/?city=${city.slug}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 hover:border-amber-500/30 hover:bg-amber-500/5 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <span>{city.flagEmoji}</span>
                      <span>{city.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-white/70 text-lg sm:text-xl leading-relaxed italic">
          "We believe the world is better when it feels closer. When you can
          walk a foreign street before you arrive — or long after you've left —
          something shifts. You stop seeing distant places as abstract.
          They become real."
        </p>
        <p className="text-white/25 text-sm mt-6">— The Nearaway.in team</p>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/6 py-20 px-4 text-center">
        <p className="text-white/40 text-sm mb-3">Ready to explore?</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          Pick a city. Any city.
        </h2>
        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-full transition-colors"
        >
          <Globe className="w-5 h-5" />
          Open the Globe
        </Link>
        <p className="text-white/20 text-xs mt-6">
          No account. No download. No passport.
        </p>
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
          <Link href="/about" className="hover:text-white transition-colors text-white/50">About</Link>
          <span>·</span>
          <Link href="/journeys" className="hover:text-white transition-colors">Journeys</Link>
        </div>
      </footer>
    </div>
  );
}
