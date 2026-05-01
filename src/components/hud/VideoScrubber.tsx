"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  player: React.MutableRefObject<YT.Player | null>;
  isReady: boolean;
}

export function VideoScrubber({ player, isReady }: Props) {
  const [progress, setProgress] = useState(0); // 0–1
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Poll playback position every 500ms
  useEffect(() => {
    if (!isReady) return;

    const tick = () => {
      const p = player.current;
      if (p) {
        try {
          const cur = p.getCurrentTime?.() ?? 0;
          const dur = p.getDuration?.() ?? 0;
          if (dur > 0 && !dragging) setProgress(cur / dur);
        } catch { /* player not ready */ }
      }
      rafRef.current = window.setTimeout(tick, 500);
    };
    tick();

    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [isReady, dragging, player]);

  // Show scrubber briefly after mount, then hide after 3s (re-shows on hover)
  useEffect(() => {
    if (!isReady) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [isReady]);

  const seek = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!barRef.current || !player.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setProgress(pct);
    try {
      const dur = player.current.getDuration?.() ?? 0;
      if (dur > 0) player.current.seekTo(pct * dur, true);
    } catch { /* ignore */ }
  }, [player]);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-1"
      style={{ zIndex: 41, pointerEvents: "none" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Hover zone — slightly taller than bar for easier targeting */}
      <div
        className="py-3 cursor-pointer"
        style={{ pointerEvents: "auto" }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => !dragging && setVisible(false)}
        onMouseDown={(e) => { setDragging(true); seek(e); }}
        onMouseMove={(e) => { if (dragging) seek(e); }}
        onMouseUp={() => setDragging(false)}
        onTouchStart={(e) => { setDragging(true); seek(e); }}
        onTouchMove={(e) => { if (dragging) seek(e); }}
        onTouchEnd={() => setDragging(false)}
      >
        <div
          ref={barRef}
          className="relative h-0.5 rounded-full overflow-hidden transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.12)",
            height: visible || dragging ? "3px" : "2px",
            opacity: visible || dragging ? 1 : 0.3,
            transition: "opacity 0.4s, height 0.2s",
          }}
        >
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: "color-mix(in srgb, var(--color-ember) 90%, transparent)",
              transition: dragging ? "none" : "width 0.5s linear",
            }}
          />
          {/* Thumb */}
          {(visible || dragging) && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md"
              style={{ left: `calc(${progress * 100}% - 5px)`, transition: dragging ? "none" : "left 0.5s linear" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
