"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, VolumeX, SplitSquareHorizontal, Heart } from "lucide-react";
import { ShareButton } from "./ShareButton";
import type { City } from "@/types/city";
import { LiveBadge } from "./LiveBadge";
import { ViewerCount } from "./ViewerCount";
import { LocalClock } from "./LocalClock";
import { useAppStore } from "@/store/appStore";

interface Props {
  city: City;
  isVisible: boolean;
  onOpenCard: () => void;
  onOpenPicker: () => void;
  allCities: City[];
}

const HUD_HIDE_DELAY = 4000;

export function CityHUD({ city, isVisible, onOpenCard, onOpenPicker, allCities }: Props) {
  const {
    returnToGlobe,
    toggleMute,
    playerMuted,
    activeVideoId,
    setActiveVideo,
    favoriteSlugs,
    toggleFavorite,
    navigateCity,
  } = useAppStore();

  const [hudRevealed, setHudRevealed] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    setHudRevealed(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setHudRevealed(false), HUD_HIDE_DELAY);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, resetTimer]);

  const isFavorited = favoriteSlugs.includes(city.slug);
  const show = isVisible && hudRevealed;

  // Sprint 1C: videos with distinct timeOfDay labels for switcher
  const switchableVideos = city.videos.length > 1 ? city.videos : [];
  const currentVideoId = activeVideoId ?? city.videos.find((v) => v.isFeatured)?.youtubeId;

  const timeLabel = (t: string) => {
    if (t === "golden-hour") return "Golden";
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }}>

      {/* ── Cinematic bottom gradient vignette ── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="vignette"
            className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.55) 45%, transparent 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* ── Top bar (auto-hides) ── */}
      <AnimatePresence>
        {show && (
          <motion.div
            key="hud-top"
            className="absolute top-0 left-0 right-0 flex items-start justify-between p-4 md:p-6"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <button
              onClick={returnToGlobe}
              className="pointer-events-auto flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 hover:text-white transition-colors"
              title="Back to globe (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </button>

            <div className="pointer-events-auto flex items-center gap-2">
              {/* Sprint 2C: favorite button */}
              <button
                onClick={() => toggleFavorite(city.slug)}
                className="glass rounded-full p-2.5 transition-colors"
                title={isFavorited ? "Remove from saved" : "Save city (F)"}
              >
                <Heart
                  className="w-4 h-4"
                  style={{ color: isFavorited ? "#f43f5e" : "rgba(255,255,255,0.6)" }}
                  fill={isFavorited ? "#f43f5e" : "none"}
                />
              </button>

              <button
                onClick={toggleMute}
                className="glass rounded-full p-2.5 text-white/70 hover:text-white transition-colors"
                title={playerMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {playerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onOpenPicker}
                className="glass rounded-full p-2.5 text-white/70 hover:text-white transition-colors"
                title="Compare with another city"
              >
                <SplitSquareHorizontal className="w-4 h-4" />
              </button>

              <ShareButton citySlug={city.slug} cityName={city.name} flagEmoji={city.flagEmoji} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom info (auto-hides) ── */}
      <AnimatePresence>
        {show && (
          <motion.div
            key="hud-bottom"
            className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-6 md:pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          >
            <div className="flex items-end gap-4">
              {/* Prev city */}
              <button
                onClick={() => navigateCity(allCities, "prev")}
                className="pointer-events-auto glass rounded-full p-2.5 text-white/50 hover:text-white transition-colors mb-1 flex-shrink-0"
                title="Previous city (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

            <div
              className="pointer-events-auto cursor-pointer group flex-1 min-w-0"
              onClick={onOpenCard}
            >
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <LiveBadge />
                    <ViewerCount citySlug={city.slug} />
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-none tracking-tight">
                    {city.name}
                  </h1>

                  {/* Sprint 1C: Video time-of-day switcher pills */}
                  {switchableVideos.length > 0 && (
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {switchableVideos.map((v) => (
                        <button
                          key={v.youtubeId}
                          onClick={() => setActiveVideo(v.youtubeId)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors ${
                            currentVideoId === v.youtubeId
                              ? "bg-amber-500/30 text-amber-300 border border-amber-500/50"
                              : "text-white/30 border border-white/10 hover:text-white/60"
                          }`}
                        >
                          {timeLabel(v.timeOfDay)}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <span>{city.flagEmoji}</span>
                    <span>{city.country}</span>
                    <span className="w-px h-3 bg-white/20" />
                    <LocalClock timezone={city.timezone} />
                  </div>
                </div>

                {/* Pulsing culture affordance */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white/40 text-xs tracking-widest uppercase">culture</span>
                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

              {/* Next city */}
              <button
                onClick={() => navigateCity(allCities, "next")}
                className="pointer-events-auto glass rounded-full p-2.5 text-white/50 hover:text-white transition-colors mb-1 flex-shrink-0"
                title="Next city (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
