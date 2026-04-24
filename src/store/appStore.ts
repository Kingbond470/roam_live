"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { City } from "@/types/city";
import type { Journey } from "@/data/journeys";

export type TransitionPhase =
  | "idle"
  | "zooming"
  | "video-fadein"
  | "watching"
  | "video-fadeout"
  | "globe-return";

interface AppState {
  phase: TransitionPhase;
  selectedCity: City | null;
  cardOpen: boolean;
  compareCity: City | null;
  compareOpen: boolean;
  searchOpen: boolean;
  playerMuted: boolean;
  _togglePlayerMute: (() => void) | null;

  // Sprint 1C: video switcher
  activeVideoId: string | null;

  // Sprint 2B: globe tag filter
  activeTag: string | null;

  // Sprint 2C: favorites (persisted)
  favoriteSlugs: string[];

  // Thematic journey paths
  activePath: Journey | null;
  setActivePath: (path: Journey | null) => void;

  // City-to-city navigation
  navigateCity: (cities: City[], direction: "next" | "prev") => void;

  // Discover mode
  discoverMode: boolean;
  toggleDiscoverMode: () => void;

  selectCity: (city: City) => void;
  /** Skip the globe zoom animation — go straight to video. Used for deep-links. */
  selectCityDirect: (city: City) => void;
  advanceToVideo: () => void;
  setWatching: () => void;
  returnToGlobe: () => void;
  completeReturn: () => void;
  openCard: () => void;
  closeCard: () => void;
  openCompare: (city: City) => void;
  closeCompare: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  registerToggleMute: (fn: () => void) => void;
  toggleMute: () => void;

  // Sprint 1B: random city
  selectRandomCity: (cities: City[]) => void;

  // Sprint 1C: video switcher
  setActiveVideo: (id: string) => void;
  clearActiveVideo: () => void;

  // Sprint 2B: tag filter
  setTagFilter: (tag: string | null) => void;

  // Sprint 2C: favorites
  toggleFavorite: (slug: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      phase: "idle",
      selectedCity: null,
      cardOpen: false,
      compareCity: null,
      compareOpen: false,
      searchOpen: false,
      playerMuted: true,
      _togglePlayerMute: null,
      activeVideoId: null,
      activeTag: null,
      favoriteSlugs: [],
      discoverMode: false,
      activePath: null,

      selectCity: (city) =>
        set({
          selectedCity: city,
          phase: "zooming",
          cardOpen: false,
          playerMuted: true,
          activeVideoId: null,
        }),

      selectCityDirect: (city) =>
        set({
          selectedCity: city,
          phase: "video-fadein",
          cardOpen: false,
          playerMuted: true,
          activeVideoId: null,
        }),

      advanceToVideo: () =>
        set((s) => (s.phase === "zooming" ? { phase: "video-fadein" } : {})),

      setWatching: () =>
        set((s) => (s.phase === "video-fadein" ? { phase: "watching" } : {})),

      returnToGlobe: () =>
        set({ phase: "video-fadeout", cardOpen: false, compareOpen: false }),

      completeReturn: () =>
        set({
          phase: "idle",
          selectedCity: null,
          compareCity: null,
          _togglePlayerMute: null,
          activeVideoId: null,
        }),

      openCard: () => set({ cardOpen: true }),
      closeCard: () => set({ cardOpen: false }),
      openCompare: (city) => set({ compareCity: city, compareOpen: true }),
      closeCompare: () => set({ compareOpen: false, compareCity: null }),
      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false }),

      registerToggleMute: (fn) => set({ _togglePlayerMute: fn }),
      toggleMute: () => {
        const { _togglePlayerMute, playerMuted } = get();
        _togglePlayerMute?.();
        set({ playerMuted: !playerMuted });
      },

      selectRandomCity: (cities) => {
        const { selectedCity } = get();
        const pool = cities.filter((c) => c.slug !== selectedCity?.slug);
        if (!pool.length) return;
        const city = pool[Math.floor(Math.random() * pool.length)];
        get().selectCity(city);
      },

      setActiveVideo: (id) => set({ activeVideoId: id }),
      clearActiveVideo: () => set({ activeVideoId: null }),

      setTagFilter: (tag) => set({ activeTag: tag }),

      toggleFavorite: (slug) =>
        set((s) => ({
          favoriteSlugs: s.favoriteSlugs.includes(slug)
            ? s.favoriteSlugs.filter((x) => x !== slug)
            : [...s.favoriteSlugs, slug],
        })),

      toggleDiscoverMode: () => set((s) => ({ discoverMode: !s.discoverMode })),

      setActivePath: (path) => set({ activePath: path }),

      navigateCity: (cities, direction) => {
        const { selectedCity } = get();
        if (!selectedCity || !cities.length) return;
        const idx = cities.findIndex((c) => c.slug === selectedCity.slug);
        if (idx === -1) return; // current city not in nav list (e.g. non-path city while journey is active)
        const next =
          direction === "next"
            ? cities[(idx + 1) % cities.length]
            : cities[(idx - 1 + cities.length) % cities.length];
        set({
          selectedCity: next,
          activeVideoId: null,
          cardOpen: false,
          compareOpen: false,
          phase: "video-fadein",
        });
      },
    }),
    {
      name: "nearaway-store",
      // Only persist user preferences — not ephemeral UI state
      partialize: (s) => ({
        favoriteSlugs: s.favoriteSlugs,
        playerMuted: s.playerMuted,
      }),
    }
  )
);
