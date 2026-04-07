"use client";

import { useEffect, useRef } from "react";
import type { City } from "@/types/city";

// Free-to-use ambient audio from Pixabay / public domain sources
// Keyed by the first matching tag on the city
const AMBIENT_BY_TAG: Record<string, string> = {
  "rain":        "https://www.soundjay.com/nature/sounds/rain-01.mp3",
  "neon":        "https://assets.mixkit.co/active_storage/sfx/2583/2583-preview.mp3",
  "beaches":     "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3",
  "bazaar":      "https://assets.mixkit.co/active_storage/sfx/2630/2630-preview.mp3",
  "souks":       "https://assets.mixkit.co/active_storage/sfx/2630/2630-preview.mp3",
  "carnival":    "https://assets.mixkit.co/active_storage/sfx/2638/2638-preview.mp3",
  "canals":      "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3",
  "temples":     "https://assets.mixkit.co/active_storage/sfx/2654/2654-preview.mp3",
  "default":     "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // city traffic
};

function getAmbientUrl(city: City): string {
  for (const tag of city.tags) {
    if (AMBIENT_BY_TAG[tag]) return AMBIENT_BY_TAG[tag];
  }
  return AMBIENT_BY_TAG["default"];
}

export function useAmbientSound(city: City | null, muted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!city) return;

    const audio = new Audio(getAmbientUrl(city));
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [city?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade in when muted, fade out when unmuted
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      audio.play().catch(() => {/* autoplay blocked — user hasn't interacted yet */});
      // Gentle fade in over 1s
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(0.35, vol + 0.035);
        audio.volume = vol;
        if (vol >= 0.35) clearInterval(fadeIn);
      }, 100);
      return () => clearInterval(fadeIn);
    } else {
      // Gentle fade out over 1s
      let vol = audio.volume;
      const fadeOut = setInterval(() => {
        vol = Math.max(0, vol - 0.035);
        audio.volume = vol;
        if (vol <= 0) { audio.pause(); clearInterval(fadeOut); }
      }, 100);
      return () => clearInterval(fadeOut);
    }
  }, [muted]);
}
