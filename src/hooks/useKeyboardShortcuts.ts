"use client";

import { useEffect } from "react";
import type { City } from "@/types/city";
import { useAppStore } from "@/store/appStore";

export function useKeyboardShortcuts(cities: City[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;

      const { phase, selectedCity, returnToGlobe, toggleMute, selectRandomCity, toggleFavorite } =
        useAppStore.getState();

      const { navigateCity } = useAppStore.getState();

      // BUG-02 FIX: respect active journey path for arrow navigation
      const getNavCities = () => {
        const { activePath: ap } = useAppStore.getState();
        if (!ap) return cities;
        return ap.citySlugOrder
          .map((s) => cities.find((c) => c.slug === s))
          .filter(Boolean) as City[];
      };

      switch (e.key) {
        case "Escape":
          if (phase === "watching") returnToGlobe();
          break;
        case "m":
        case "M":
          if (phase === "watching") toggleMute();
          break;
        case "r":
        case "R":
          if (phase === "idle") selectRandomCity(cities);
          break;
        case "f":
        case "F":
          if (phase === "watching" && selectedCity) toggleFavorite(selectedCity.slug);
          break;
        case "ArrowRight":
          if (phase === "watching") navigateCity(getNavCities(), "next");
          break;
        case "ArrowLeft":
          if (phase === "watching") navigateCity(getNavCities(), "prev");
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cities]);
}
