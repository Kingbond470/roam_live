"use client";

import { useState, useEffect, useCallback } from "react";

// Tracks which tip to show next. Persists across sessions.
// "globe" → "swipe" → "culture" → "done"
type Step = "globe" | "swipe" | "culture" | "done";
const KEY = "roam_onboarding_v1";

const read = (): Step => {
  try { return (localStorage.getItem(KEY) as Step) ?? "globe"; } catch { return "globe"; }
};
const write = (s: Step) => {
  try { localStorage.setItem(KEY, s); } catch { /* ignore */ }
};

export function useOnboarding(phase: string) {
  const [step, setStep] = useState<Step>("done"); // safe SSR default

  // Hydrate from localStorage after mount
  useEffect(() => { setStep(read()); }, []);

  // Auto-dismiss after 7s on any active tip
  useEffect(() => {
    if (step === "done") return;
    const t = setTimeout(() => dismiss(step), 7_000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Show swipe tip 2s after entering watching phase (if that's the pending step)
  useEffect(() => {
    if (phase !== "watching" || step !== "swipe") return;
    // Already on swipe step, tip shows immediately
  }, [phase, step]);

  // When user first selects a city, advance globe → swipe
  useEffect(() => {
    if (phase === "video-fadein" || phase === "watching") {
      setStep((cur) => {
        if (cur === "globe") {
          write("swipe");
          return "swipe";
        }
        return cur;
      });
    }
  }, [phase]);

  const dismiss = useCallback((current: Step) => {
    const next: Step =
      current === "globe"   ? "swipe" :
      current === "swipe"   ? "culture" :
      current === "culture" ? "done" : "done";
    write(next);
    // If advancing to swipe/culture, only show if we're in the right phase
    setStep(next === "done" ? "done" : next);
  }, []);

  return {
    showGlobeTip:   step === "globe" && (phase === "idle" || phase === "zooming"),
    showSwipeTip:   step === "swipe" && phase === "watching",
    showCultureTip: step === "culture" && phase === "watching",
    dismissGlobe:   () => dismiss("globe"),
    dismissSwipe:   () => dismiss("swipe"),
    dismissCulture: () => dismiss("culture"),
  };
}
