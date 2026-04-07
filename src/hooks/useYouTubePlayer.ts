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
  const [isLoading, setIsLoading] = useState(true);   // true until first PLAYING event
  const [isBuffering, setIsBuffering] = useState(false); // mid-playback network stall
  const hasPlayedRef = useRef(false);
  const bufferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const destroyPlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch { /* already destroyed */ }
      playerRef.current = null;
      setIsReady(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    // Fallback: if video never fires PLAYING within 15s (geo-block, silent restriction),
    // dismiss the loading screen so user isn't stuck forever
    loadTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && !hasPlayedRef.current) setIsLoading(false);
    }, 15_000);

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
          start: 90,
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
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (!mountedRef.current) return;
            const state = event.data;
            if (state === window.YT.PlayerState.PLAYING) {
              if (!hasPlayedRef.current) {
                hasPlayedRef.current = true;
                if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
                setIsLoading(false);
              }
              // clear any pending buffer timer and hide overlay
              if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
              setIsBuffering(false);
            } else if (state === window.YT.PlayerState.BUFFERING) {
              if (hasPlayedRef.current) {
                // debounce 800ms — fast networks recover before this fires
                bufferTimerRef.current = setTimeout(() => {
                  if (mountedRef.current) setIsBuffering(true);
                }, 800);
              }
            } else if (state === window.YT.PlayerState.PAUSED) {
              if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
              setIsBuffering(false);
            }
          },
          onError: () => {
            if (!mountedRef.current) return;
            setHasError(true);
            setIsLoading(false);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      mountedRef.current = false;
      if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      hasPlayedRef.current = false;
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

  return { player: playerRef, isReady, hasError, isLoading, isBuffering, toggleMute };
}
