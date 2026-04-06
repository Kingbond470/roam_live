"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe } from "lucide-react";
import type { City } from "@/types/city";
import { useAppStore } from "@/store/appStore";
import { GlobeLoader } from "@/components/globe/GlobeLoader";
import { CityVideoPlayer } from "@/components/video/CityVideoPlayer";
import { CityHUD } from "@/components/hud/CityHUD";
import { CultureCard } from "@/components/cards/CultureCard";
import { SplitScreen } from "@/components/wow/SplitScreen";
import { CitySearch } from "@/components/search/CitySearch";
import { getFeaturedVideo } from "@/lib/utils";

const GlobeScene = dynamic(
  () => import("@/components/globe/GlobeScene").then((m) => ({ default: m.GlobeScene })),
  { ssr: false, loading: () => <GlobeLoader /> }
);

interface Props {
  cities: City[];
}

export function HomeClient({ cities }: Props) {
  const {
    phase,
    selectedCity,
    cardOpen,
    compareOpen,
    compareCity,
    searchOpen,
    openCard,
    closeCard,
    openCompare,
    closeCompare,
    openSearch,
    closeSearch,
    completeReturn,
    setWatching,
  } = useAppStore();

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

  const featuredVideo = selectedCity ? getFeaturedVideo(selectedCity) : null;

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
            <GlobeScene cities={cities} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BUG-05 FIX: separate AnimatePresence per overlay, each with a key ── */}
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
      {showVideo && selectedCity && featuredVideo && (
        <motion.div
          key={`video-${selectedCity.slug}`}
          className="absolute inset-0"
          style={{ zIndex: 30 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "video-fadeout" ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={(definition) => {
            // BUG-09 FIX: only advance when the fade-IN animation completes (opacity → 1)
            // definition is the animate target object; check opacity === 1
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
            videoId={featuredVideo.youtubeId}
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
            if (others.length) {
              openCompare(others[Math.floor(Math.random() * others.length)]);
            }
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

      {/* ── BUG-06 FIX: no fragment inside AnimatePresence — two separate ones ── */}
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

      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="globe-bottombar"
            className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-8"
            style={{ zIndex: 15, pointerEvents: "none" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">
              Tap any city to explore
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center px-4">
              {cities.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => useAppStore.getState().selectCity(city)}
                  style={{ pointerEvents: "auto" }}
                  className="text-xl opacity-50 hover:opacity-100 hover:scale-125 transition-all duration-200"
                  title={city.name}
                >
                  {city.flagEmoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
