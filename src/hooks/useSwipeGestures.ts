"use client";

import { useEffect, useRef } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeDown?: () => void;
}

const MIN_DISTANCE = 60;  // px
const MAX_TIME = 400;     // ms

export function useSwipeGestures({ onSwipeLeft, onSwipeRight, onSwipeDown }: SwipeHandlers) {
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null);

  // Keep handler refs stable so listeners are never torn down/re-added on re-renders
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  const onSwipeDownRef = useRef(onSwipeDown);
  onSwipeLeftRef.current = onSwipeLeft;
  onSwipeRightRef.current = onSwipeRight;
  onSwipeDownRef.current = onSwipeDown;

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!startRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startRef.current.x;
      const dy = t.clientY - startRef.current.y;
      const dt = Date.now() - startRef.current.t;
      startRef.current = null;

      if (dt > MAX_TIME) return;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDy > absDx && absDy > MIN_DISTANCE && dy > 0) {
        onSwipeDownRef.current?.();
      } else if (absDx > absDy && absDx > MIN_DISTANCE) {
        if (dx < 0) onSwipeLeftRef.current?.();
        else onSwipeRightRef.current?.();
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []); // empty deps — listeners registered once, refs always current
}
