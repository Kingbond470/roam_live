"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Shuffle, Heart, Play, Pause, Compass, Flame, MapPin } from "lucide-react";
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
import { MilestoneToast } from "@/components/onboarding/MilestoneToast";
import { useWalkStats } from "@/hooks/useWalkStats";
import { Flag } from "@/components/ui/Flag";

// Vibe filter pills — map display label → city tag value
const VIBE_PILLS = [
  { label: "🌙 Nightlife", tag: "nightlife" },
  { label: "🍜 Food",      tag: "street-food" },
  { label: "🏛️ History",  tag: "historic" },
  { label: "🌊 Coastal",   tag: "beaches" },
  { label: "🎨 Art",       tag: "art" },
] as const;

const GlobeScene = dynamic(
  () => import("@/components/globe/GlobeScene").then((m) => ({ default: m.GlobeScene })),
  { ssr: false, loading: () => <GlobeLoader /> }
);

interface Props {
  cities: City[];
  initialCity?: City | null;
  initialJourney?: import("@/data/journeys").Journey | null;
  initialContinent?: string | null;
}

export function HomeClient({ cities, initialCity, initialJourney, initialContinent }: Props) {
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

  // Walk stats: streak, visited cities, milestones
  const { visitedSlugs, streak, markVisited, newlyCompletedJourney, clearCompletedJourney } = useWalkStats();
  const [dismissedMilestones, setDismissedMilestones] = useState<number[]>([]);
  const dismissMilestone = (count: number) => setDismissedMilestones((prev) => [...prev, count]);

  // Post-walk suggestions
  const lastWatchedRef = useRef<City | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Deep-link: auto-select city, activate journey, or pre-filter continent on load
  const { selectCity, setActivePath } = useAppStore();
  useEffect(() => {
    if (initialContinent) setTagFilter(initialContinent);
    if (initialJourney) setActivePath(initialJourney);
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

  // Track visited city when watching begins
  useEffect(() => {
    if (phase === "watching" && selectedCity) {
      lastWatchedRef.current = selectedCity;
      markVisited(selectedCity.slug);
    }
  }, [phase, selectedCity, markVisited]);

  // Show post-walk suggestions when returning to globe
  useEffect(() => {
    if (phase === "idle" && lastWatchedRef.current) {
      setShowSuggestions(true);
      const t = setTimeout(() => setShowSuggestions(false), 9000);
      return () => clearTimeout(t);
    }
  }, [phase]);

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

  // Post-walk suggestions: same journey first, then same continent, then same tags
  const suggestedCities = useMemo(() => {
    const src = lastWatchedRef.current;
    if (!src) return [];
    const pool = cities.filter((c) => c.slug !== src.slug);
    const journeyCities = activePath
      ? pool.filter((c) => activePath.citySlugOrder.includes(c.slug))
      : [];
    const continentCities = pool.filter((c) => c.continent === src.continent && !journeyCities.find((j) => j.slug === c.slug));
    const tagCities = pool.filter(
      (c) => src.tags.some((t) => c.tags.includes(t)) && !journeyCities.find((j) => j.slug === c.slug) && !continentCities.find((cc) => cc.slug === c.slug)
    );
    return [...journeyCities, ...continentCities, ...tagCities].slice(0, 3);
  }, [cities, activePath]);

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

      {/* ── Empty Saved state ── */}
      <AnimatePresence>
        {phase === "idle" && activeTag === "__favorites__" && favoriteSlugs.length === 0 && (
          <motion.div
            key="empty-saved"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6"
            style={{ zIndex: 16, pointerEvents: "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-1">
              <Heart className="w-6 h-6 text-rose-400/60" />
            </div>
            <p className="text-white/80 font-semibold text-lg">No saved cities yet</p>
            <p className="text-white/35 text-sm max-w-xs leading-relaxed">
              Tap the heart icon while watching any city walk to save it here.
            </p>
            <button
              onClick={() => setTagFilter(null)}
              className="mt-2 glass px-4 py-2 rounded-full text-sm text-white/60 hover:text-white transition-colors"
              style={{ pointerEvents: "auto" }}
            >
              Browse all cities
            </button>
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
                Near<span className="text-amber-400">away</span>
              </span>
            </div>

            <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
              {/* About + Journeys links */}
              <Link
                href="/journeys"
                className="glass px-3 py-2 rounded-full text-white/40 hover:text-white/80 transition-colors text-xs hidden sm:block"
              >
                Journeys
              </Link>
              <Link
                href="/about"
                className="glass px-3 py-2 rounded-full text-white/40 hover:text-white/80 transition-colors text-xs hidden sm:block"
              >
                About
              </Link>

              {/* City of the day shortcut */}
              <button
                onClick={() => {
                  useAppStore.getState().selectCity(cityOfTheDay);
                  router.replace("/?today=1", { scroll: false });
                }}
                className="glass flex items-center gap-2 px-3 py-2 rounded-full text-white/60 hover:text-white transition-colors"
                title={`Today's walk: ${cityOfTheDay.name}`}
              >
                <Flag countryCode={cityOfTheDay.countryCode} flagEmoji={cityOfTheDay.flagEmoji} size={16} />
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
            className="absolute inset-x-0 bottom-0 w-full flex flex-col pb-safe"
            style={{ zIndex: 15, pointerEvents: "none" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Action row — full-width scrollable so all buttons are reachable on narrow screens */}
            <div
              className="w-full overflow-x-auto mb-2.5"
              style={{ pointerEvents: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2 px-4 w-max mx-auto whitespace-nowrap">
                <button
                  onClick={() => selectRandomCity(cities)}
                  className="glass flex items-center gap-1.5 px-3 py-2 rounded-full text-white/50 hover:text-white transition-colors text-xs"
                  title="Random city (R)"
                >
                  <Shuffle className="w-3 h-3" />
                  Shuffle
                </button>

                <button
                  onClick={handleToggleDiscover}
                  className={`glass flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors text-xs ${
                    discoverMode ? "text-amber-400" : "text-white/50 hover:text-white"
                  }`}
                >
                  {discoverMode ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {discoverMode ? "Stop" : "Discover"}
                </button>

                <button
                  onClick={() => setJourneyOpen(true)}
                  className={`glass flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors text-xs max-w-[130px] ${
                    activePath ? "text-amber-400" : "text-white/50 hover:text-white"
                  }`}
                >
                  {activePath ? <span>{activePath.emoji}</span> : <Compass className="w-3 h-3" />}
                  <span className="truncate">{activePath ? activePath.name : "Journeys"}</span>
                </button>

                {visitedSlugs.length > 0 && (
                  <div className="glass flex items-center gap-2 px-3 py-2 rounded-full text-xs">
                    {streak >= 2 && (
                      <>
                        <span className="flex items-center gap-1 text-orange-400 font-semibold">
                          <Flame className="w-3 h-3" />
                          {streak}
                        </span>
                        <span className="w-px h-3 bg-white/15" />
                      </>
                    )}
                    <span className="flex items-center gap-1 text-white/50">
                      <MapPin className="w-3 h-3" />
                      {visitedSlugs.length}/{cities.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Filter pills — full-width scrollable */}
            <div className="relative w-full mb-4" style={{ pointerEvents: "auto" }}>
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050508] to-transparent z-10" />
              <div
                className="w-full overflow-x-auto flex items-center gap-1.5 px-4"
                style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
              >
                <button
                  onClick={() => setTagFilter(null)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    activeTag === null
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "text-white/30 hover:text-white/60 border border-white/10"
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => setTagFilter(activeTag === "__favorites__" ? null : "__favorites__")}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
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
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      activeTag === continent
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "text-white/30 hover:text-white/60 border border-white/10"
                    }`}
                  >
                    {continent}
                  </button>
                ))}

                <span className="shrink-0 w-px h-4 bg-white/10 mx-0.5" />

                {VIBE_PILLS.map(({ label, tag }) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(activeTag === tag ? null : tag)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      activeTag === tag
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                        : "text-white/30 hover:text-white/60 border border-white/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Onboarding coach marks ── */}
      <CoachMark
        visible={showGlobeTip}
        message="Tap any city pin or flag to start your walk"
        subtext="Explore 62 cities around the world, hands-free"
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

      {/* ── Post-walk suggestions ── */}
      <AnimatePresence>
        {showSuggestions && suggestedCities.length > 0 && lastWatchedRef.current && (
          <motion.div
            key="post-walk-suggestions"
            className="absolute inset-x-0 bottom-32 flex justify-center px-4"
            style={{ zIndex: 16, pointerEvents: "none" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap" style={{ pointerEvents: "auto" }}>
              <span className="text-white/35 text-xs whitespace-nowrap">You might also like</span>
              {suggestedCities.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => { setShowSuggestions(false); useAppStore.getState().selectCity(city); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 hover:border-amber-500/40 transition-colors text-sm text-white/70 hover:text-white"
                >
                  <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={14} />
                  <span>{city.name}</span>
                </button>
              ))}
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-white/20 hover:text-white/50 transition-colors text-xs ml-1"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Journey milestone toast ── */}
      <MilestoneToast
        visible={!!newlyCompletedJourney}
        emoji={newlyCompletedJourney?.emoji ?? "🏆"}
        title={`${newlyCompletedJourney?.name ?? ""} — Complete!`}
        subtitle={`You've walked all ${newlyCompletedJourney?.citySlugOrder.length ?? 0} cities in this journey.`}
        accentColor={newlyCompletedJourney?.accentColor ?? "#f59e0b"}
        onDismiss={clearCompletedJourney}
      />

      {/* ── Cities explored milestone toasts ── */}
      <MilestoneToast
        visible={visitedSlugs.length === 1 && !dismissedMilestones.includes(1)}
        emoji="🌍"
        title="First walk complete!"
        subtitle="You've started your virtual adventure. Keep exploring."
        onDismiss={() => dismissMilestone(1)}
        autoDismissMs={5000}
      />
      <MilestoneToast
        visible={visitedSlugs.length === 10 && !dismissedMilestones.includes(10)}
        emoji="🔥"
        title="10 cities explored!"
        subtitle="You're a seasoned virtual traveller. The globe awaits."
        onDismiss={() => dismissMilestone(10)}
        autoDismissMs={5000}
      />
      <MilestoneToast
        visible={visitedSlugs.length === 25 && !dismissedMilestones.includes(25)}
        emoji="✈️"
        title="25 cities — world explorer!"
        subtitle="Nearly halfway around Nearaway.in. Impressive."
        onDismiss={() => dismissMilestone(25)}
        autoDismissMs={5000}
      />
    </div>
  );
}
