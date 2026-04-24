"use client";

import { useEffect } from "react";
import { RefreshCw, ArrowLeft, WifiOff } from "lucide-react";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { useAppStore } from "@/store/appStore";
import { VideoScrubber } from "@/components/hud/VideoScrubber";
import { VideoLoadingScreen } from "@/components/video/VideoLoadingScreen";
import { BufferingOverlay } from "@/components/video/BufferingOverlay";

function VideoErrorState({ onRetry }: { onRetry: () => void }) {
  const { returnToGlobe } = useAppStore();
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508] px-6 text-center gap-3"
      style={{ zIndex: 33 }}
    >
      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
        <WifiOff className="w-6 h-6 text-white/40" />
      </div>
      <p className="font-semibold text-white/80 text-lg">Video unavailable</p>
      <p className="text-white/40 text-sm max-w-xs leading-relaxed">
        This walk couldn&apos;t load — check your connection or try a different city.
      </p>
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
        <button
          onClick={returnToGlobe}
          className="inline-flex items-center gap-2 glass text-white/70 hover:text-white px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Globe
        </button>
      </div>
    </div>
  );
}

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

      {/* Wrapper controls visibility — opacity here survives YouTube replacing the inner div with an iframe */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-700"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <div id={containerId} className="absolute inset-0 w-full h-full" />
      </div>

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
        <VideoErrorState onRetry={() => useAppStore.getState().returnToGlobe()} />
      )}
    </div>
  );
}
