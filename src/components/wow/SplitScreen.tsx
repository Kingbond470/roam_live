"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronsLeftRight, ChevronsUpDown } from "lucide-react";
import { Flag } from "@/components/ui/Flag";
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
  const [isPortrait, setIsPortrait] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const videoA = getFeaturedVideo(cityA);
  const videoB = getFeaturedVideo(cityB);

  // Detect portrait vs landscape
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    setIsPortrait(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Reset split to center when orientation changes
  useEffect(() => {
    setSplitPercent(50);
  }, [isPortrait]);

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = isPortrait
      ? ((clientY - rect.top) / rect.height) * 100
      : ((clientX - rect.left) / rect.width) * 100;
    setSplitPercent(Math.min(85, Math.max(15, pct)));
  };

  // Add start=90 to skip intros; remove YouTube chrome
  const embedParams = (id: string) =>
    `autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&start=90`;

  // DESIGN FIX: clip-path on full-viewport iframes so both videos show their center content
  const clipA = isPortrait
    ? `inset(0 0 ${100 - splitPercent}% 0)`
    : `inset(0 ${100 - splitPercent}% 0 0)`;
  const clipB = isPortrait
    ? `inset(${splitPercent}% 0 0 0)`
    : `inset(0 0 0 ${splitPercent}%)`;

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
            style={{ zIndex: 60 }}
          >
            <X className="w-5 h-5" />
          </button>

          <div
            ref={containerRef}
            className="relative w-full h-full select-none"
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={() => { dragging.current = false; }}
            onMouseLeave={() => { dragging.current = false; }}
            onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => { dragging.current = false; }}
          >
            {/* ── City A — full viewport, clipped to reveal correct portion ── */}
            {/* overflow:hidden + iframe extended -60px top/bottom crops YouTube title bar,
                controls bar, logo, and end-screen chrome entirely out of view.
                pointer-events:none on the iframe blocks any remaining YouTube UI interaction. */}
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: clipA }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoA.youtubeId}?${embedParams(videoA.youtubeId)}`}
                style={{
                  position: "absolute",
                  top: "-60px",
                  left: 0,
                  right: 0,
                  bottom: "-60px",
                  width: "100%",
                  height: "calc(100% + 120px)",
                  pointerEvents: "none",
                }}
                allow="autoplay; encrypted-media"
              />
              {/* City A label — top-left on landscape, top-center on portrait */}
              <div
                className={`absolute glass rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 pointer-events-none ${
                  isPortrait ? "top-3 sm:top-4 left-1/2 -translate-x-1/2" : "top-4 sm:top-6 left-3 sm:left-5"
                }`}
              >
                <p className="text-white font-bold text-xs sm:text-base flex items-center gap-1.5" style={{ fontFamily: "Georgia, serif" }}>
                  <Flag countryCode={cityA.countryCode} flagEmoji={cityA.flagEmoji} size={16} />
                  {cityA.name}
                </p>
                <p className="text-white/50 text-[10px] sm:text-xs">{cityA.country}</p>
              </div>
            </div>

            {/* ── City B — full viewport, clipped to reveal correct portion ── */}
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: clipB }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoB.youtubeId}?${embedParams(videoB.youtubeId)}`}
                style={{
                  position: "absolute",
                  top: "-60px",
                  left: 0,
                  right: 0,
                  bottom: "-60px",
                  width: "100%",
                  height: "calc(100% + 120px)",
                  pointerEvents: "none",
                }}
                allow="autoplay; encrypted-media"
              />
              {/* City B label — bottom-right on landscape, bottom-center on portrait */}
              <div
                className={`absolute glass rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 pointer-events-none ${
                  isPortrait
                    ? "bottom-20 sm:bottom-20 left-1/2 -translate-x-1/2 text-center"
                    : "top-4 sm:top-6 right-3 sm:right-5 text-right"
                }`}
              >
                <p className="text-white font-bold text-xs sm:text-base flex items-center gap-1.5" style={{ fontFamily: "Georgia, serif" }}>
                  <Flag countryCode={cityB.countryCode} flagEmoji={cityB.flagEmoji} size={16} />
                  {cityB.name}
                </p>
                <p className="text-white/50 text-[10px] sm:text-xs">{cityB.country}</p>
              </div>
            </div>

            {/* ── Draggable divider ── */}
            {isPortrait ? (
              // Horizontal divider for portrait
              <div
                className="absolute inset-x-0 flex flex-col items-center justify-center cursor-row-resize"
                style={{ top: `calc(${splitPercent}% - 22px)`, height: 44, zIndex: 55 }}
                onMouseDown={() => { dragging.current = true; }}
                onTouchStart={() => { dragging.current = true; }}
              >
                <div className="w-full h-px bg-white/40" />
                <div className="absolute w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                  <ChevronsUpDown className="w-4 h-4 text-white" />
                </div>
              </div>
            ) : (
              // Vertical divider for landscape
              <div
                className="absolute inset-y-0 flex items-center justify-center cursor-col-resize"
                style={{ left: `calc(${splitPercent}% - 22px)`, width: 44, zIndex: 55 }}
                onMouseDown={() => { dragging.current = true; }}
                onTouchStart={() => { dragging.current = true; }}
              >
                <div className="h-full w-px bg-white/40" />
                <div className="absolute w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                  <ChevronsLeftRight className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            {/* ── Bottom comparison bar ── */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ zIndex: 56 }}
            >
              <div className="glass border-t border-white/10 px-4 py-3">
                {/* Responsive: flex-wrap on mobile, 3-col grid on desktop */}
                <div className="flex items-center justify-around gap-2 flex-wrap sm:grid sm:grid-cols-3 sm:gap-4 text-center">
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
                    left={cityA.timezone.split("/").pop()?.replace(/_/g, " ") ?? cityA.timezone}
                    right={cityB.timezone.split("/").pop()?.replace(/_/g, " ") ?? cityB.timezone}
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
    <div className="min-w-[80px]">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
        <span className="text-white/80 font-medium truncate max-w-[70px] sm:max-w-none">{left}</span>
        <span className="text-white/20 flex-shrink-0">vs</span>
        <span className="text-white/80 font-medium truncate max-w-[70px] sm:max-w-none">{right}</span>
      </div>
    </div>
  );
}
