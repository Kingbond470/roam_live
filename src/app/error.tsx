"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Globe, ArrowLeft, RefreshCw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-full overflow-y-auto bg-void text-white flex flex-col">
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
          Globe
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-20">
        <div
          className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tighter mb-2 select-none"
          style={{ color: "rgba(245,158,11,0.10)" }}
        >
          500
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 -mt-6">
          Something went wrong.
        </h1>
        <p className="text-white/40 text-base max-w-sm leading-relaxed mb-10">
          We hit a snag on our end. Try refreshing — the globe is still spinning.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-ember hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/6 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
          >
            <Globe className="w-4 h-4" />
            Back to Globe
          </Link>
        </div>
      </div>
    </div>
  );
}
