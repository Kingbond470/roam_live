"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, SplitSquareHorizontal } from "lucide-react";
import type { City } from "@/types/city";
import { LiveBadge } from "./LiveBadge";
import { ViewerCount } from "./ViewerCount";
import { LocalClock } from "./LocalClock";
import { useAppStore } from "@/store/appStore";

interface Props {
  city: City;
  isVisible: boolean;
  onOpenCard: () => void;
  allCities: City[];
}

export function CityHUD({ city, isVisible, onOpenCard, allCities }: Props) {
  // BUG-04 FIX: use store-level mute state + action wired to actual YT player
  const { returnToGlobe, openCompare, toggleMute, playerMuted } = useAppStore();

  const handleCompare = () => {
    const others = allCities.filter((c) => c.slug !== city.slug);
    if (others.length) {
      openCompare(others[Math.floor(Math.random() * others.length)]);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }}>
          {/* ── Top bar ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 flex items-start justify-between p-4 md:p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <button
              onClick={returnToGlobe}
              className="pointer-events-auto flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Explore</span>
            </button>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="glass rounded-full p-2.5 text-white/70 hover:text-white transition-colors"
                title={playerMuted ? "Unmute" : "Mute"}
              >
                {playerMuted
                  ? <VolumeX className="w-4 h-4" />
                  : <Volume2 className="w-4 h-4" />
                }
              </button>
              <button
                onClick={handleCompare}
                className="glass rounded-full p-2.5 text-white/70 hover:text-white transition-colors"
                title="Compare cities"
              >
                <SplitSquareHorizontal className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ── Bottom info bar ── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <div
              className="rounded-2xl glass p-4 md:p-5 pointer-events-auto cursor-pointer hover:border-amber-500/30 transition-colors border border-transparent"
              onClick={onOpenCard}
            >
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <LiveBadge />
                    <ViewerCount seed={(city.population % 1000) + 200} />
                  </div>
                  <div className="flex items-baseline gap-3">
                    <h1
                      className="text-3xl md:text-5xl font-bold text-white leading-none truncate"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {city.flagEmoji} {city.name}
                    </h1>
                    <span className="text-white/50 text-lg hidden sm:block">{city.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 flex-wrap">
                    <LocalClock timezone={city.timezone} />
                    <span className="hidden sm:flex items-center gap-1.5 text-sm">
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      {city.continent}
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5 text-sm">
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      {(city.population / 1_000_000).toFixed(1)}M people
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 hidden sm:flex flex-col items-end gap-1 text-white/30 text-xs">
                  <span>Tap for</span>
                  <span className="text-amber-400/60">culture →</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
