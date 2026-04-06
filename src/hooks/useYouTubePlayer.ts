"use client";

/// <reference types="youtube" />

import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiReadyPromise: Promise<void> | null = null;

function waitForYTApi(): Promise<void> {
  if (apiReadyPromise) return apiReadyPromise;
  apiReadyPromise = new Promise((resolve) => {
    if (typeof window !== "undefined" && window.YT?.Player) {
      resolve();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
  });
  return apiReadyPromise;
}

export function useYouTubePlayer(
  containerId: string,
  videoId: string,
  onReady?: () => void
) {
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const destroyPlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch { /* already destroyed */ }
      playerRef.current = null;
      setIsReady(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    waitForYTApi().then(() => {
      if (cancelled) return;
      const el = document.getElementById(containerId);
      if (!el) return;

      playerRef.current = new window.YT.Player(containerId, {
        // BUG-07 FIX: explicit dimensions so iframe fills its container
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            if (cancelled) return;
            event.target.mute();
            event.target.playVideo();
            setIsReady(true);
            onReady?.();
          },
          onError: () => { setHasError(true); },
        },
      });
    });

    return () => {
      cancelled = true;
      destroyPlayer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, videoId]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (playerRef.current.isMuted()) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
  }, []);

  return { player: playerRef, isReady, hasError, toggleMute };
}
