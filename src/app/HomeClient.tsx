"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Shuffle, Heart } from "lucide-react";
import type { City } from "@/types/city";
import { useAppStore } from "@/store/appStore";
import { GlobeLoader } from "@/components/globe/GlobeLoader";
import { CityVideoPlayer } from "@/components/video/CityVideoPlayer";
import { CityHUD } from "@/components/hud/CityHUD";
import { CultureCard } from "@/components/cards/CultureCard";
import { SplitScreen } from "@/components/wow/SplitScreen";
import { CitySearch } from "@/components/search/CitySearch";
import { getFeaturedVideo } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const GlobeScene = dynamic(
  () => import("@/components/globe/GlobeScene").then((m) => ({ default: m.GlobeScene })),
  { ssr: false, loading: () => <GlobeLoader /> }
);

interface Props {
  cities: City[];
  initialCity?: City | null;
}

export function HomeClient({ cities, initialCity }: Props) {
  const {
    phase,
    selectedCity,
    cardOpen,
    compareOpen,
    compareCity,
    searchOpen,
    activeVideoId,
    activeTag,
    favoriteSlugs,
    openCard,
    closeCard,
    openCompare,
    closeCompare,
    openSearch,
    closeSearch,
    completeReturn,
    setWatching,
    selectRandomCity,
    setTagFilter,
  } = useAppStore();

  // Sprint 1A: keyboard shortcuts
  useKeyboardShortcuts(cities);

  // Sprint 3A: deep-link — auto-select city from ?city= query param on first load
  const { selectCity } = useAppStore();
  useEffect(() => {
    if (initialCity) selectCity(initialCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive video-fadeout → idle
  useEffect(() => {
    if (phase === "video-fadeout") {
      const t = setTimeout(completeReturn, 650);
      return () => clearTimeout(t);
    }
  }, [phase, completeReturn]);

  const isWatching = phase === "watching" || phase === "video-fadein";
  const showVideo = phase === "video-fadein" || phase === "watching" || phase === "video-fadeout";
  const showGlobe = phase === "idle" || phase === "zooming" || phase === "globe-return";

  // Sprint 1C: resolve active video (switcher overrides featured)
  const currentVideo = useMemo(() => {
    if (!selectedCity) return null;
    if (activeVideoId) {
      return selectedCity.videos.find((v) => v.youtubeId === activeVideoId) ?? getFeaturedVideo(selectedCity);
    }
    return getFeaturedVideo(selectedCity);
  }, [selectedCity, activeVideoId]);

  // Sprint 2B: deduplicate all tags across cities for filter bar
  const allTags = useMemo(
    () => Array.from(new Set(cities.flatMap((c) => c.tags))).sort(),
    [cities]
  );

  // Sprint 2C: cities visible on globe when favorites filter active
  const globeCities = useMemo(() => {
    if (activeTag === "__favorites__") {
      return cities.filter((c) => favoriteSlugs.includes(c.slug));
    }
    return cities;
  }, [cities, activeTag, favoriteSlugs]);

  return (
    <div className="fixed inset-0 bg-[#050508]">

      {/* ── Globe ── */}
      <AnimatePresence>
        {showGlobe && (
          <motion.div
            key="globe"
            className="absolute inset-0"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlobeScene cities={globeCities} activeTag={activeTag} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Zoom overlay ── */}
      <AnimatePresence>
        {phase === "zooming" && (
          <motion.div
            key="zoom-overlay"
            className="absolute inset-0 bg-black"
            style={{ zIndex: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "video-fadeout" && (
          <motion.div
            key="fadeout-overlay"
            className="absolute inset-0 bg-black"
            style={{ zIndex: 35 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

      {/* ── Video ── */}
      {showVideo && selectedCity && currentVideo && (
        <motion.div
          key={`video-${selectedCity.slug}-${currentVideo.youtubeId}`}
          className="absolute inset-0"
          style={{ zIndex: 30 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "video-fadeout" ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={(definition) => {
            if (
              phase === "video-fadein" &&
              typeof definition === "object" &&
              (definition as { opacity?: number }).opacity === 1
            ) {
              setWatching();
            }
          }}
        >
          <CityVideoPlayer
            videoId={currentVideo.youtubeId}
            citySlug={selectedCity.slug}
          />
        </motion.div>
      )}

      {/* ── HUD ── */}
      {selectedCity && (
        <CityHUD
          city={selectedCity}
          isVisible={isWatching}
          onOpenCard={openCard}
          allCities={cities}
        />
      )}

      {/* ── Culture card ── */}
      {selectedCity && (
        <CultureCard
          city={selectedCity}
          isOpen={cardOpen}
          onClose={closeCard}
          onCompare={() => {
            const others = cities.filter((c) => c.slug !== selectedCity.slug);
            if (others.length) openCompare(others[Math.floor(Math.random() * others.length)]);
          }}
        />
      )}

      {/* ── Split-screen ── */}
      {selectedCity && compareCity && (
        <SplitScreen
          cityA={selectedCity}
          cityB={compareCity}
          isOpen={compareOpen}
          onClose={closeCompare}
        />
      )}

      {/* ── City search ── */}
      <CitySearch cities={cities} isOpen={searchOpen} onClose={closeSearch} />

      {/* ── Globe top nav ── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="globe-topnav"
            className="absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-6"
            style={{ zIndex: 15, pointerEvents: "none" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <span className="text-white font-bold text-lg tracking-tight">
                Roam<span className="text-amber-400">.Live</span>
              </span>
            </div>
            <button
              onClick={openSearch}
              style={{ pointerEvents: "auto" }}
              className="glass flex items-center gap-2.5 px-4 py-2.5 rounded-full text-white/70 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm hidden sm:block">Search cities...</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Globe bottom bar: tag filters + city flags + random button ── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="globe-bottombar"
            className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-6"
            style={{ zIndex: 15, pointerEvents: "none" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Sprint 2B: Tag filter pills */}
            <div
              className="flex items-center gap-1.5 mb-3 px-4 overflow-x-auto"
              style={{ pointerEvents: "auto", scrollbarWidth: "none" }}
            >
              {/* All */}
              <button
                onClick={() => setTagFilter(null)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeTag === null
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "text-white/30 hover:text-white/60 border border-white/10"
                }`}
              >
                All
              </button>

              {/* Favorites tab */}
              <button
                onClick={() => setTagFilter(activeTag === "__favorites__" ? null : "__favorites__")}
                className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeTag === "__favorites__"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "text-white/30 hover:text-white/60 border border-white/10"
                }`}
              >
                <Heart className="w-3 h-3" />
                Saved
              </button>

              {/* Dynamic tags */}
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(activeTag === tag ? null : tag)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                    activeTag === tag
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "text-white/30 hover:text-white/60 border border-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* City flags + random button */}
            <p className="text-white/30 text-xs tracking-widest uppercase mb-2" style={{ pointerEvents: "none" }}>
              Tap any city to explore
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center px-4" style={{ pointerEvents: "auto" }}>
              {cities.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => useAppStore.getState().selectCity(city)}
                  className="text-xl opacity-50 hover:opacity-100 hover:scale-125 transition-all duration-200"
                  title={city.name}
                >
                  {city.flagEmoji}
                </button>
              ))}

              {/* Sprint 1B: Random city button */}
              <button
                onClick={() => selectRandomCity(cities)}
                className="glass rounded-full p-2 text-white/40 hover:text-amber-400 transition-colors ml-1"
                title="Random city (R)"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
