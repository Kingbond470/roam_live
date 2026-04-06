"use client";

import { create } from "zustand";
import type { City } from "@/types/city";

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
  // BUG-04 FIX: store player mute toggle fn set by CityVideoPlayer on mount
  playerMuted: boolean;
  _togglePlayerMute: (() => void) | null;

  selectCity: (city: City) => void;
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
}

export const useAppStore = create<AppState>((set, get) => ({
  phase: "idle",
  selectedCity: null,
  cardOpen: false,
  compareCity: null,
  compareOpen: false,
  searchOpen: false,
  playerMuted: true,
  _togglePlayerMute: null,

  selectCity: (city) =>
    set({ selectedCity: city, phase: "zooming", cardOpen: false, playerMuted: true }),

  advanceToVideo: () =>
    set((s) => (s.phase === "zooming" ? { phase: "video-fadein" } : {})),

  // BUG-09 FIX: explicit action instead of direct setState
  setWatching: () =>
    set((s) => (s.phase === "video-fadein" ? { phase: "watching" } : {})),

  returnToGlobe: () =>
    set({ phase: "video-fadeout", cardOpen: false, compareOpen: false }),

  completeReturn: () =>
    set({ phase: "idle", selectedCity: null, compareCity: null, _togglePlayerMute: null }),

  openCard: () => set({ cardOpen: true }),
  closeCard: () => set({ cardOpen: false }),
  openCompare: (city) => set({ compareCity: city, compareOpen: true }),
  closeCompare: () => set({ compareOpen: false, compareCity: null }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  // BUG-04 FIX: CityVideoPlayer calls this to register its toggleMute fn
  registerToggleMute: (fn) => set({ _togglePlayerMute: fn }),

  toggleMute: () => {
    const { _togglePlayerMute, playerMuted } = get();
    _togglePlayerMute?.();
    set({ playerMuted: !playerMuted });
  },
}));
