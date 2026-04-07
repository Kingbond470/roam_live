"use client";

import { useEffect } from "react";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { useAppStore } from "@/store/appStore";

interface Props {
  videoId: string;
  citySlug: string;
  onReady?: () => void;
}

export function CityVideoPlayer({ videoId, citySlug, onReady }: Props) {
  const containerId = `yt-player-${citySlug}`;
  const { toggleMute: hookToggleMute, hasError } = useYouTubePlayer(containerId, videoId, onReady);
  const { registerToggleMute } = useAppStore();

  // BUG-04 FIX: register the hook's toggleMute fn in the store so CityHUD can call it
  useEffect(() => {
    registerToggleMute(hookToggleMute);
    return () => {
      // Deregister on unmount so stale fn isn't called
      useAppStore.getState().registerToggleMute(() => {});
    };
  }, [hookToggleMute, registerToggleMute]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black" style={{ zIndex: 30 }}>
      <div id={containerId} className="absolute inset-0 w-full h-full" />

      {/* Transparent overlay — blocks YouTube's hover UI (title bar, watermark, progress bar)
          from activating inside the iframe while our HUD (z-index 40) sits above this */}
      <div className="absolute inset-0" style={{ zIndex: 1, pointerEvents: "auto" }} />

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508] text-white/60 gap-3" style={{ zIndex: 2 }}>
          <span className="text-4xl">🎬</span>
          <p className="text-sm tracking-wide">Video unavailable for this city</p>
        </div>
      )}
    </div>
  );
}
