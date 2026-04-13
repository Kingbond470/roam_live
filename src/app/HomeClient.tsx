"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Shuffle, Heart, Play, Pause, Compass } from "lucide-react";
import type { City } from "@/types/city";
import { useAppStore } from "@/store/appStore";
import { GlobeLoader } from "@/components/globe/GlobeLoader";
import { CityVideoPlayer } from "@/components/video/CityVideoPlayer";
import { CityHUD } from "@/components/hud/CityHUD";
import { CultureCard } from "@/components/cards/CultureCard";
import { SplitScreen } from "@/components/wow/SplitScreen";
import { ComparePicker } from "@/components/wow/ComparePicker";
import { CitySearch } from "@/components/search/CitySearch";
import { getTimeAwareVideo } from "@/lib/utils";
import { VideoSwitcher } from "@/components/video/VideoSwitcher";
import { getCityOfTheDay } from "@/lib/cityOfTheDay";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSwipeGestures } from "@/hooks/useSwipeGestures";
import { useOnboarding } from "@/hooks/useOnboarding";
import { CoachMark } from "@/components/onboarding/CoachMark";
import { PWAInstallPrompt } from "@/components/onboarding/PWAInstallPrompt";
import { JourneyPanel } from "@/components/journey/JourneyPanel";

const GlobeScene = dynamic(
  () => import("@/components/globe/GlobeScene").then((m) => ({ default: m.GlobeScene })),
  { ssr: false, loading: () => <GlobeLoader /> }
);

interface Props {
  cities: City[];
  initialCity?: City | null;
}

export function HomeClient({ cities, initialCity }: Props) {
  const router = useRouter();
  const {
    phase,
    selectedCity,
    cardOpen,
    compareOpen,
    compareCity,
    searchOpen,
    activeVideoId,
    activeTag,
    activePath,
    favoriteSlugs,
    discoverMode,
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
    toggleDiscoverMode,
  } = useAppStore();

  // Compare picker — lifted here so it renders outside pointer-events-none HUD
  const [pickerOpen, setPickerOpen] = useState(false);
  // Video switcher panel
  const [switcherOpen, setSwitcherOpen] = useState(false);
  // Journey paths panel
  const [journeyOpen, setJourneyOpen] = useState(false);

  // Sprint 1A: keyboard shortcuts
  useKeyboardShortcuts(cities);

  // Mobile swipe gestures (watching phase only, not while compare/card is open)
  const { navigateCity, returnToGlobe: returnToGlobeGesture } = useAppStore();
  // BUG-01 FIX: read activePath at call time so swipes respect the active journey path
  const getSwipeNavCities = () => {
    const ap = useAppStore.getState().activePath;
    if (!ap) return cities;
    return ap.citySlugOrder
      .map((s) => cities.find((c) => c.slug === s))
      .filter(Boolean) as City[];
  };
  useSwipeGestures({
    onSwipeDown:  () => { if (phase === "watching" && !compareOpen && !cardOpen) returnToGlobeGesture(); },
    onSwipeLeft:  () => { if (phase === "watching" && !compareOpen && !cardOpen) navigateCity(getSwipeNavCities(), "next"); },
    onSwipeRight: () => { if (phase === "watching" && !compareOpen && !cardOpen) navigateCity(getSwipeNavCities(), "prev"); },
  });

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

  // Discover mode: auto-cycle every 30s when watching (skip if compare/card is open)
  useEffect(() => {
    if (!discoverMode || phase !== "watching") return;
    const t = setInterval(() => {
      const { compareOpen: co, cardOpen: ca } = useAppStore.getState();
      if (!co && !ca) navigateCity(cities, "next");
    }, 30_000);
    return () => clearInterval(t);
  }, [discoverMode, phase, cities, navigateCity]);

  // When Discover is turned on from the globe, immediately pick a city and start
  const handleToggleDiscover = () => {
    const isOn = !discoverMode; // what it's about to become
    toggleDiscoverMode();
    if (isOn && phase === "idle") {
      selectRandomCity(cities);
    }
  };

  const isWatching = phase === "watching" || phase === "video-fadein";
  const showVideo = phase === "video-fadein" || phase === "watching" || phase === "video-fadeout";
  const showGlobe = phase === "idle" || phase === "zooming" || phase === "globe-return";

  // Onboarding coach marks
  const { showGlobeTip, showSwipeTip, showCultureTip, dismissGlobe, dismissSwipe, dismissCulture } =
    useOnboarding(phase);

  // Time-aware default: picks morning/day/golden-hour/night video based on user's local hour.
  // If user explicitly switched via switcher (activeVideoId set), that overrides.
  const currentVideo = useMemo(() => {
    if (!selectedCity) return null;
    if (activeVideoId) {
      return selectedCity.videos.find((v) => v.youtubeId === activeVideoId) ?? getTimeAwareVideo(selectedCity);
    }
    return getTimeAwareVideo(selectedCity);
  }, [selectedCity, activeVideoId]);

  // City of the day
  const cityOfTheDay = useMemo(() => getCityOfTheDay(cities), [cities]);

  // Continent filter list — derived from city data, ordered for display
  const allContinents = useMemo(
    () => Array.from(new Set(cities.map((c) => c.continent))).sort(),
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
            <GlobeScene cities={globeCities} activeTag={activeTag} cityOfTheDay={cityOfTheDay} activePath={activePath} />
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
          onOpenPicker={() => setPickerOpen(true)}
          onOpenSwitcher={() => setSwitcherOpen(true)}
          allCities={cities}
        />
      )}

      {/* ── Video Switcher panel (top-level so pointer-events work) ── */}
      {selectedCity && (
        <VideoSwitcher
          city={selectedCity}
          activeVideoId={currentVideo?.youtubeId ?? ""}
          isOpen={switcherOpen}
          onClose={() => setSwitcherOpen(false)}
          onSelect={(video) => {
            useAppStore.getState().setActiveVideo(video.youtubeId);
          }}
        />
      )}

      {/* ── Culture card ── */}
      {selectedCity && (
        <CultureCard
          city={selectedCity}
          isOpen={cardOpen}
          onClose={closeCard}
          onCompare={() => { closeCard(); setPickerOpen(true); }}
        />
      )}

      {/* ── Compare city picker (top-level so pointer-events work correctly) ── */}
      {selectedCity && (
        <ComparePicker
          isOpen={pickerOpen}
          cities={cities.filter((c) => c.slug !== selectedCity.slug)}
          onSelect={(city) => { openCompare(city); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
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

            <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
              {/* City of the day shortcut */}
              <button
                onClick={() => {
                  useAppStore.getState().selectCity(cityOfTheDay);
                  router.replace("/?today=1", { scroll: false });
                }}
                className="glass flex items-center gap-2 px-3 py-2 rounded-full text-white/60 hover:text-white transition-colors"
                title={`Today's walk: ${cityOfTheDay.name}`}
              >
                <span className="text-base">{cityOfTheDay.flagEmoji}</span>
                <span className="text-xs">{cityOfTheDay.name}</span>
              </button>

              <button
                onClick={openSearch}
                className="glass flex items-center gap-2.5 px-4 py-2.5 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm hidden sm:block">Search cities...</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Globe bottom bar: action row + continent filters ── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="globe-bottombar"
            className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-safe"
            style={{ zIndex: 15, pointerEvents: "none" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Action row: Shuffle · Discover · Journeys */}
            <div className="flex items-center gap-2 mb-3" style={{ pointerEvents: "auto" }}>
              <button
                onClick={() => selectRandomCity(cities)}
                className="glass flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/50 hover:text-white transition-colors text-xs"
                title="Random city (R)"
              >
                <Shuffle className="w-3 h-3" />
                Shuffle
              </button>

              <button
                onClick={handleToggleDiscover}
                className={`glass flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs ${
                  discoverMode ? "text-amber-400" : "text-white/50 hover:text-white"
                }`}
                title={discoverMode ? "Stop auto-cycling" : "Auto-cycle cities every 30s"}
              >
                {discoverMode ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {discoverMode ? "Stop" : "Discover"}
              </button>

              <button
                onClick={() => setJourneyOpen(true)}
                className={`glass flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs ${
                  activePath ? "text-amber-400" : "text-white/50 hover:text-white"
                }`}
                title="Thematic Journeys"
              >
                <Compass className="w-3 h-3" />
                {activePath ? activePath.name : "Journeys"}
              </button>
            </div>

            {/* Continent + saved filter pills */}
            <div
              className="flex items-center gap-1.5 mb-4 px-4 overflow-x-auto"
              style={{ pointerEvents: "auto", scrollbarWidth: "none" }}
            >
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

              {allContinents.map((continent) => (
                <button
                  key={continent}
                  onClick={() => setTagFilter(activeTag === continent ? null : continent)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeTag === continent
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "text-white/30 hover:text-white/60 border border-white/10"
                  }`}
                >
                  {continent}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Onboarding coach marks ── */}
      <CoachMark
        visible={showGlobeTip}
        message="Tap any city pin or flag to start your walk"
        subtext="Explore 20 cities around the world, hands-free"
        position="bottom"
        onDismiss={dismissGlobe}
      />
      <CoachMark
        visible={showSwipeTip}
        message="Swipe left or right to explore cities"
        subtext="Or use the ← → arrows to navigate"
        position="bottom"
        onDismiss={dismissSwipe}
      />
      <CoachMark
        visible={showCultureTip}
        message="Tap the city name to discover local culture"
        subtext="Greetings, food, tips, dos & don'ts"
        position="bottom"
        onDismiss={dismissCulture}
      />

      {/* PWA install prompt — shown 20s after first visit, once ever */}
      <PWAInstallPrompt />

      {/* Journey paths panel */}
      <JourneyPanel
        cities={cities}
        isOpen={journeyOpen}
        onClose={() => setJourneyOpen(false)}
      />
    </div>
  );
}
