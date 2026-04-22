"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, VolumeX, SplitSquareHorizontal, Heart, Film, BookOpen } from "lucide-react";
import { Flag } from "@/components/ui/Flag";
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
  onOpenSwitcher: () => void;
  allCities: City[];
}

const HUD_HIDE_DELAY = 4000;

export function CityHUD({ city, isVisible, onOpenCard, onOpenPicker, onOpenSwitcher, allCities }: Props) {
  const {
    returnToGlobe,
    toggleMute,
    playerMuted,
    favoriteSlugs,
    toggleFavorite,
    navigateCity,
    activePath,
    setActivePath,
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

  // Path-aware navigation: when a journey is active, navigate within path cities only
  const pathCities = activePath
    ? activePath.citySlugOrder
        .map((slug) => allCities.find((c) => c.slug === slug))
        .filter(Boolean) as typeof allCities
    : null;
  const navCities = pathCities ?? allCities;
  const pathPosition = pathCities ? pathCities.findIndex((c) => c.slug === city.slug) + 1 : 0;



  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }}>

      {/* ── Cinematic bottom gradient vignette ── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="vignette"
            className="absolute bottom-0 left-0 right-0 h-48 md:h-72 pointer-events-none"
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
                className="glass rounded-full p-3 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                className="glass rounded-full p-3 text-white/70 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                title={playerMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {playerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onOpenPicker}
                className="glass rounded-full p-3 text-white/70 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Compare with another city"
              >
                <SplitSquareHorizontal className="w-4 h-4" />
              </button>

              <ShareButton citySlug={city.slug} cityName={city.name} flagEmoji={city.flagEmoji} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom info (auto-hides) + persistent nav arrows ── */}
      {isVisible && (
        <div className="absolute bottom-0 left-0 right-0 pb-safe">

          {/* City info card — animates in/out */}
          <AnimatePresence>
            {show && (
              <motion.div
                key="hud-city-info"
                className="pointer-events-auto cursor-pointer group px-4 md:px-6 pb-3"
                onClick={onOpenCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
              >
                {/* Journey + LIVE row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {activePath && (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <span
                        className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: activePath.accentColor + "20",
                          color: activePath.accentColor,
                          border: `1px solid ${activePath.accentColor}40`,
                        }}
                      >
                        <span>{activePath.emoji}</span>
                        <span className="max-w-[100px] truncate">{activePath.name}</span>
                        {pathPosition > 0 && (
                          <span style={{ opacity: 0.6 }}>· {pathPosition}/{pathCities!.length}</span>
                        )}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActivePath(null); }}
                        className="text-white/30 hover:text-white/70 transition-colors text-xs leading-none"
                      >✕</button>
                    </div>
                  )}
                  <LiveBadge />
                  <ViewerCount citySlug={city.slug} />
                </div>

                {/* City name + culture CTA row */}
                <div className="flex items-end justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-none tracking-tight truncate">
                      {city.name}
                    </h1>
                    <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm mt-1.5">
                      <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={14} />
                      <span>{city.country}</span>
                      <span className="w-px h-3 bg-white/20" />
                      <LocalClock timezone={city.timezone} />
                      {city.videos.length > 1 && (
                        <>
                          <span className="w-px h-3 bg-white/20" />
                          <button
                            onClick={(e) => { e.stopPropagation(); onOpenSwitcher(); }}
                            className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
                          >
                            <Film className="w-3 h-3" />
                            <span>{city.videos.length}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Culture + Nav row */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateCity(navCities, "prev"); }}
                      className="glass rounded-full p-3 text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Previous city (←)"
                      style={{ pointerEvents: show ? "auto" : "none" }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span className="text-white/60 text-[9px] tracking-widest uppercase">culture</span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); navigateCity(navCities, "next"); }}
                      className="glass rounded-full p-3 text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Next city (→)"
                      style={{ pointerEvents: show ? "auto" : "none" }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Persistent prev/next — faint when HUD hidden, invisible but touchable on mobile */}
          {!show && (
            <div className="flex items-center justify-between px-2 pb-3 pointer-events-auto">
              <button
                onClick={() => navigateCity(navCities, "prev")}
                className="glass rounded-full p-3 text-white/20 min-w-[48px] min-h-[48px] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateCity(navCities, "next")}
                className="glass rounded-full p-3 text-white/20 min-w-[48px] min-h-[48px] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
