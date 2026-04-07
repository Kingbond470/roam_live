"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

// Deterministic base count per city (so even 1 real user sees a realistic crowd size)
function cityBase(citySlug: string): number {
  let h = 0;
  for (let i = 0; i < citySlug.length; i++) h = (h * 31 + citySlug.charCodeAt(i)) >>> 0;
  return 300 + (h % 900); // 300 – 1199
}

// Stable anonymous session ID (per browser tab)
function getSessionId(): string {
  const key = "roam_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function useViewerCount(citySlug: string) {
  const base = cityBase(citySlug);
  const [realCount, setRealCount] = useState(0);
  const channelRef = useRef<ReturnType<NonNullable<typeof supabase>["channel"]> | null>(null);

  useEffect(() => {
    if (!supabase) {
      // ── Fallback: simulated drift when Supabase isn't configured ──
      setRealCount(0);
      const id = setInterval(() => {
        setRealCount((prev) => {
          const delta = Math.floor(Math.random() * 21) - 10;
          return Math.max(-base + 50, Math.min(800, prev + delta));
        });
      }, 4000);
      return () => clearInterval(id);
    }

    // ── Real-time Presence ──
    const sessionId = getSessionId();
    const channel = supabase.channel(`city:${citySlug}`, {
      config: { presence: { key: sessionId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setRealCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ joined_at: Date.now() });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.untrack();
      supabase!.removeChannel(channel);
      channelRef.current = null;
    };
  }, [citySlug, base]);

  // Display = deterministic base + real presence offset
  return base + realCount;
}
