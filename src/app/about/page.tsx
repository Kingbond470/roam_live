import { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowLeft, MapPin, Film, Compass, SplitSquareHorizontal, BookOpen, Heart } from "lucide-react";
import { cities } from "@/lib/cities";
import { Flag } from "@/components/ui/Flag";

export async function generateMetadata(): Promise<Metadata> {
  const cityCount = cities.length;
  const continentCount = new Set(cities.map((c) => c.continent)).size;
  return {
    title: "About Nearaway — Free 4K Virtual City Walks, No Passport",
    description: `Nearaway brings immersive 4K virtual city walks and cultural intelligence to anyone with a browser. ${cityCount} cities, ${continentCount} continents, no passport required.`,
    keywords: [
      "virtual city walk",
      "4K virtual tour",
      "free virtual travel",
      "explore cities online",
      "immersive walking tour",
      "virtual tourism",
      `${cityCount} cities virtual tour`,
      "city walks no passport",
      "travel from home",
    ],
    alternates: { canonical: "https://nearaway.in/about" },
    openGraph: {
      title: "About Nearaway — A Window to Every Place on Earth",
      description: `Explore ${cityCount} cities across ${continentCount} continents with 4K walks and deep cultural insight.`,
      url: "https://nearaway.in/about",
      siteName: "Nearaway",
      images: [{ url: "/api/og", width: 1200, height: 630, alt: "Nearaway — Free Virtual City Walks" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nearawayin",
      title: "About Nearaway — A Window to Every Place on Earth",
      images: ["/api/og"],
    },
  };
}

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

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Nearaway",
    description: `Nearaway is a free virtual travel platform offering immersive 4K walking tours of ${cityCount} cities across ${continentCount} continents. No passport, no account, no download required.`,
    url: "https://nearaway.in/about",
    mainEntity: {
      "@type": "Organization",
      name: "Nearaway",
      url: "https://nearaway.in",
      description: "Nearaway turns any device into a window onto the world's streets — immersive 4K city walks, real local culture, and the freedom to explore without a flight.",
      sameAs: ["https://twitter.com/nearawayin"],
    },
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Use Nearaway",
    description: `Explore ${cityCount} cities virtually in three simple steps.`,
    step: STEPS.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  };

  const citiesByContinent = CONTINENTS.map((continent) => ({
    continent,
    cities: cities.filter((c) => c.continent === continent),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      <div className="h-full overflow-y-auto bg-void text-white">

        {/* ── Nav — fixed 64px ── */}
        <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8 bg-void/80 backdrop-blur-md border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-ember" />
            <span className="font-bold text-lg tracking-tight">
              Near<span className="text-ember">away</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Globe
          </Link>
        </nav>

        {/* ── Hero ── */}
        <section className="relative pt-36 pb-24 px-4 sm:px-8 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 70%)" }}
          />
          <p className="text-white/35 text-xs tracking-[0.15em] uppercase font-medium mb-6">
            A window to every place on Earth
          </p>
          {/* font-display from --font-display theme token (Lora serif, weight 400) */}
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
            The world is <span className="text-ember">open</span>.<br />
            Step inside.
          </h1>
          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Nearaway turns any device into a window onto the world&rsquo;s streets —
            immersive 4K city walks, real local culture, and the freedom to explore without a flight.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-ember hover:bg-amber-400 text-black font-bold px-8 py-3.5 rounded-full text-sm transition-colors"
          >
            <Globe className="w-4 h-4" />
            Open the Globe
          </Link>
          {/* Trust signal pill badges */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {["No account", "No download", "No passport"].map((item) => (
              <span key={item} className="px-3 py-1 rounded-full text-xs text-white/40 border border-white/8 bg-surface-1">
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-y border-white/6 py-12 px-4">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
            {[
              { value: cityCount, label: "Cities" },
              { value: continentCount, label: "Continents" },
              { value: `${totalVideos}+`, label: "Walks" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl sm:text-5xl font-bold text-ember tracking-tight">{value}</p>
                <p className="text-white/35 text-xs tracking-widest uppercase mt-2">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why Nearaway ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-8 py-24 text-center">
          <p className="text-white/30 text-xs tracking-[0.15em] uppercase font-medium mb-6">Why we built this</p>
          <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight mb-8 leading-[1.1]">
            Most people will never visit most places.
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-5">
            Cost, time, health, responsibility — there are a thousand reasons a trip doesn&rsquo;t happen.
            But curiosity doesn&rsquo;t stop. The urge to know what it feels like to walk through
            Marrakech at dusk, or cross Shibuya at midnight, or wander along the Seine on a grey morning — that stays.
          </p>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed">
            Nearaway was built for that curiosity. Not as a replacement for travel, but as a
            companion to it — a place to preview, revisit, or simply wander without a reason.
          </p>
        </section>

        {/* ── How it works ── */}
        <section className="bg-surface-1 border-y border-surface-border py-24 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-white/30 text-xs tracking-[0.15em] uppercase font-medium text-center mb-14">
              How it works
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div key={step.number}>
                  <span
                    className="font-display block text-7xl sm:text-8xl font-bold tracking-tighter mb-4 leading-none select-none"
                    style={{ color: "rgba(245,158,11,0.10)" }}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-base font-semibold mb-2 -mt-2">{step.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features — 24px card padding, consistent radius ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-24">
          <p className="text-white/30 text-xs tracking-[0.15em] uppercase font-medium text-center mb-14">
            What&rsquo;s inside
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => {
              const inner = (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-4 h-4 text-white/55" />
                    </div>
                    <h3 className="font-semibold text-sm text-white">{f.title}</h3>
                    {f.href && <span className="ml-auto text-ember/50 text-xs">Try it →</span>}
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed">{f.description}</p>
                </>
              );
              return f.href ? (
                <Link
                  key={f.title}
                  href={f.href}
                  className="rounded-2xl bg-surface-1 border border-surface-border p-6 hover:border-ember/25 hover:bg-surface-2 transition-colors block"
                >
                  {inner}
                </Link>
              ) : (
                <div key={f.title} className="rounded-2xl bg-surface-1 border border-surface-border p-6">
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Cities by continent ── */}
        <section className="bg-surface-1 border-y border-surface-border py-24 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-white/30 text-xs tracking-[0.15em] uppercase font-medium text-center mb-4">
              Explore the world
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-normal tracking-tight text-center mb-14 leading-[1.1]">
              {cityCount} cities across {continentCount} continents
            </h2>
            <div className="flex flex-col gap-8">
              {citiesByContinent.map(({ continent, cities: cs }) => (
                <div key={continent}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs text-white/35 uppercase tracking-[0.15em] font-medium">{continent}</span>
                    <span className="text-white/15 text-xs">{cs.length} cities</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cs.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/walk/${city.slug}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/8 hover:border-ember/30 hover:bg-white/[0.07] text-sm text-white/55 hover:text-white/90 transition-colors"
                      >
                        <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={16} />
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
        <section className="max-w-2xl mx-auto px-4 sm:px-8 py-24 text-center">
          <p className="font-display text-white/65 text-xl sm:text-2xl leading-relaxed font-normal">
            &ldquo;We believe the world is better when it feels closer. When you can
            walk a foreign street before you arrive — or long after you&rsquo;ve left —
            something shifts. You stop seeing distant places as abstract. They become real.&rdquo;
          </p>
          <p className="text-white/20 text-sm mt-8 tracking-wide">— The Nearaway team</p>
        </section>

        {/* ── CTA band ── */}
        <section className="border-t border-white/6 py-24 px-4 text-center">
          <p className="text-white/35 text-sm mb-4 tracking-wide">Ready to explore?</p>
          <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight mb-10 leading-[1.1]">
            Pick a city. Any city.
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-ember hover:bg-amber-400 text-black font-bold px-9 py-4 rounded-full transition-colors"
          >
            <Globe className="w-5 h-5" />
            Open the Globe
          </Link>
          <p className="text-white/20 text-xs mt-8 tracking-widest uppercase">
            No account &middot; No download &middot; No passport
          </p>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/5 py-10 px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Globe className="w-4 h-4 text-ember" />
            <span className="font-bold tracking-tight">Near<span className="text-ember">away</span></span>
          </div>
          <div className="flex items-center justify-center gap-5 text-white/30 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Globe</Link>
            <span className="text-white/10">·</span>
            <Link href="/about" className="hover:text-white transition-colors text-white/50">About</Link>
            <span className="text-white/10">·</span>
            <Link href="/journeys" className="hover:text-white transition-colors">Journeys</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
