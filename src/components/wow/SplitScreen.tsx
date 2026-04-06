"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { City } from "@/types/city";
import { getFeaturedVideo } from "@/lib/utils";

interface Props {
  cityA: City;
  cityB: City;
  isOpen: boolean;
  onClose: () => void;
}

export function SplitScreen({ cityA, cityB, isOpen, onClose }: Props) {
  const [splitPercent, setSplitPercent] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const videoA = getFeaturedVideo(cityA);
  const videoB = getFeaturedVideo(cityB);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPercent(Math.min(85, Math.max(15, pct)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setSplitPercent(Math.min(85, Math.max(15, pct)));
  };

  // BUG-08 FIX: each iframe is 100vw wide, positioned so only the relevant
  // half is visible via overflow:hidden on the clip container.
  // No scaleX — aspect ratio stays correct.
  const embedParamsA = `autoplay=1&mute=1&controls=0&loop=1&playlist=${videoA.youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`;
  const embedParamsB = `autoplay=1&mute=1&controls=0&loop=1&playlist=${videoB.youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black"
          style={{ zIndex: 50 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 glass rounded-full p-2.5 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            ref={containerRef}
            className="relative w-full h-full select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={() => { dragging.current = false; }}
            onMouseLeave={() => { dragging.current = false; }}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => { dragging.current = false; }}
          >
            {/* ── City A — left clip container ── */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${splitPercent}%` }}
            >
              {/* iframe is full viewport width, anchored left — overflow clips it */}
              <iframe
                src={`https://www.youtube.com/embed/${videoA.youtubeId}?${embedParamsA}`}
                style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100%" }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <div className="absolute top-6 left-5 glass rounded-xl px-4 py-2.5 pointer-events-none">
                <p className="text-white text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
                  {cityA.flagEmoji} {cityA.name}
                </p>
                <p className="text-white/50 text-xs mt-0.5">{cityA.country}</p>
              </div>
              {/* right-edge fade */}
              <div
                className="absolute inset-y-0 right-0 w-16 pointer-events-none"
                style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.7))" }}
              />
            </div>

            {/* ── City B — right clip container ── */}
            <div
              className="absolute inset-y-0 right-0 overflow-hidden"
              style={{ width: `${100 - splitPercent}%` }}
            >
              {/* iframe is full viewport width, anchored right — overflow clips left side */}
              <iframe
                src={`https://www.youtube.com/embed/${videoB.youtubeId}?${embedParamsB}`}
                style={{ position: "absolute", top: 0, right: 0, width: "100vw", height: "100%" }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <div className="absolute top-6 right-5 glass rounded-xl px-4 py-2.5 pointer-events-none text-right">
                <p className="text-white text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
                  {cityB.flagEmoji} {cityB.name}
                </p>
                <p className="text-white/50 text-xs mt-0.5">{cityB.country}</p>
              </div>
              {/* left-edge fade */}
              <div
                className="absolute inset-y-0 left-0 w-16 pointer-events-none"
                style={{ background: "linear-gradient(to left, transparent, rgba(0,0,0,0.7))" }}
              />
            </div>

            {/* ── Draggable divider ── */}
            <div
              className="absolute inset-y-0 flex items-center justify-center cursor-col-resize"
              style={{ left: `calc(${splitPercent}% - 16px)`, width: 32, zIndex: 2 }}
              onMouseDown={() => { dragging.current = true; }}
              onTouchStart={() => { dragging.current = true; }}
            >
              <div className="h-full w-px bg-white/40" />
              <div className="absolute w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <span className="text-white text-xs font-bold select-none">⟺</span>
              </div>
            </div>

            {/* ── Bottom comparison bar ── */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 2 }}>
              <div className="glass border-t border-white/10 px-6 py-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <CompareMetric
                    label="Population"
                    left={cityA.population >= 1_000_000
                      ? `${(cityA.population / 1_000_000).toFixed(1)}M`
                      : `${(cityA.population / 1000).toFixed(0)}K`}
                    right={cityB.population >= 1_000_000
                      ? `${(cityB.population / 1_000_000).toFixed(1)}M`
                      : `${(cityB.population / 1000).toFixed(0)}K`}
                  />
                  <CompareMetric
                    label="Continent"
                    left={cityA.continent}
                    right={cityB.continent}
                  />
                  <CompareMetric
                    label="Timezone"
                    left={cityA.timezone.replace("_", " ")}
                    right={cityB.timezone.replace("_", " ")}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CompareMetric({ label, left, right }: { label: string; left: string; right: string }) {
  return (
    <div>
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-white/70 truncate">{left}</span>
        <span className="text-white/20 flex-shrink-0">vs</span>
        <span className="text-white/70 truncate">{right}</span>
      </div>
    </div>
  );
}
