import Link from "next/link";
import { Globe, ArrowLeft, MapPin } from "lucide-react";
import { cities } from "@/lib/cities";

const SUGGESTIONS = cities.slice(0, 6);

export default function NotFound() {
  return (
    <div className="h-full overflow-y-auto bg-void text-white flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-void/80 backdrop-blur-md border-b border-white/5">
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

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-20">
        <div
          className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tighter mb-2 select-none"
          style={{ color: "rgba(245,158,11,0.10)" }}
        >
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 -mt-6">
          This city isn&apos;t on the map yet.
        </h1>
        <p className="text-white/40 text-base max-w-sm leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist. But 62 cities do — pick one below.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors mb-12"
        >
          <Globe className="w-4 h-4" />
          Open the Globe
        </Link>

        {/* Quick city links */}
        <div className="w-full max-w-sm">
          <p className="text-xs tracking-widest uppercase text-white/25 mb-4">
            Or jump to a city
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.map((city) => (
              <Link
                key={city.slug}
                href={`/walk/${city.slug}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 hover:border-amber-500/30 hover:bg-amber-500/5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <MapPin className="w-3 h-3" />
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
