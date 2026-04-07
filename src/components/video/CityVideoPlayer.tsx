"use client";

import { useEffect } from "react";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { useAppStore } from "@/store/appStore";
import { VideoScrubber } from "@/components/hud/VideoScrubber";
import { VideoLoadingScreen } from "@/components/video/VideoLoadingScreen";
import { BufferingOverlay } from "@/components/video/BufferingOverlay";

interface Props {
  videoId: string;
  citySlug: string;
  onReady?: () => void;
}

export function CityVideoPlayer({ videoId, citySlug, onReady }: Props) {
  const containerId = `yt-player-${citySlug}`;
  const { toggleMute: hookToggleMute, hasError, player, isReady, isLoading, isBuffering } =
    useYouTubePlayer(containerId, videoId, onReady);
  const { registerToggleMute, selectedCity, playerMuted } = useAppStore();

  // Register the hook's toggleMute fn in the store so CityHUD can call it
  useEffect(() => {
    registerToggleMute(hookToggleMute);
    return () => {
      useAppStore.getState().registerToggleMute(() => {});
    };
  }, [hookToggleMute, registerToggleMute]);

  // Ambient sound: plays when video is muted, fades out when unmuted or compare is open
  const { compareOpen } = useAppStore();
  useAmbientSound(selectedCity, playerMuted && !compareOpen);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050508]" style={{ zIndex: 30 }}>

      {/* YouTube iframe — hidden behind loading screen until video plays */}
      <div
        id={containerId}
        className="absolute inset-0 w-full h-full transition-opacity duration-700"
        style={{ opacity: isLoading ? 0 : 1 }}
      />

      {/* Transparent overlay — blocks YouTube's hover UI */}
      <div className="absolute inset-0" style={{ zIndex: 31, pointerEvents: "auto" }} />

      {/* Cinematic seek bar */}
      <VideoScrubber player={player} isReady={isReady} />

      {/* Cinematic loading screen — fades out once video starts playing */}
      {selectedCity && (
        <VideoLoadingScreen city={selectedCity} isVisible={isLoading} />
      )}

      {/* Mid-playback buffering / network stall overlay */}
      <BufferingOverlay isBuffering={isBuffering} />

      {hasError && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508] text-white/60 gap-3"
          style={{ zIndex: 33 }}
        >
          <span className="text-4xl">🎬</span>
          <p className="text-sm tracking-wide">Video unavailable for this city</p>
        </div>
      )}
    </div>
  );
}
