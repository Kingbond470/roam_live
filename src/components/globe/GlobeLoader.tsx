"use client";

import { useEffect, useState } from "react";
import { Globe, RefreshCw } from "lucide-react";
import Link from "next/link";

export function GlobeLoader() {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 12000);
    return () => clearTimeout(t);
  }, []);

  if (timedOut) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050508] px-6 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-1">
          <Globe className="w-6 h-6 text-amber-400/60" />
        </div>
        <p className="text-white/70 font-semibold text-lg">Globe failed to load</p>
        <p className="text-white/35 text-sm max-w-xs leading-relaxed">
          This usually means a slow connection or WebGL isn&apos;t supported in your browser. Try reloading.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload
          </button>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-white/6 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white px-5 py-2.5 rounded-full text-sm transition-colors"
          >
            Browse walks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050508]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
        <p className="text-white/40 text-sm font-mono tracking-widest uppercase">
          Loading world...
        </p>
      </div>
    </div>
  );
}
