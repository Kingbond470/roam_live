"use client";

import { useState, useEffect } from "react";

type Step = "globe" | "swipe" | "culture" | "done";
const KEY = "roam_onboarding_v1";

const read = (): Step => {
  try { return (localStorage.getItem(KEY) as Step) ?? "globe"; } catch { return "globe"; }
};
const write = (s: Step) => {
  try { localStorage.setItem(KEY, s); } catch { /* ignore */ }
};

const nextStep = (s: Step): Step =>
  s === "globe" ? "swipe" : s === "swipe" ? "culture" : "done";

export function useOnboarding(phase: string) {
  const [step, setStep] = useState<Step>("done"); // "done" = safe SSR/pre-hydration default

  // Hydrate from localStorage once after mount
  useEffect(() => { setStep(read()); }, []);

  // Derived: is the current tip actually on screen?
  const isVisible =
    (step === "globe"   && (phase === "idle" || phase === "zooming")) ||
    (step === "swipe"   && phase === "watching") ||
    (step === "culture" && phase === "watching");

  // Auto-dismiss ONLY when the tip is actually visible — prevents background chain-dismissal
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => {
      const next = nextStep(step);
      write(next);
      setStep(next);
    }, 7_000);
    return () => clearTimeout(t);
  }, [isVisible, step]); // re-arms when tip becomes visible

  // When city is selected and phase enters video, advance globe tip → swipe tip
  // (user saw the globe, acted on it — no need to show globe tip again)
  useEffect(() => {
    if (step !== "globe") return;
    if (phase === "video-fadein" || phase === "watching") {
      write("swipe");
      setStep("swipe");
    }
  }, [phase, step]);

  const advance = () => {
    const next = nextStep(step);
    write(next);
    setStep(next);
  };

  return {
    showGlobeTip:   step === "globe"   && (phase === "idle" || phase === "zooming"),
    showSwipeTip:   step === "swipe"   && phase === "watching",
    showCultureTip: step === "culture" && phase === "watching",
    dismissGlobe:   advance,
    dismissSwipe:   advance,
    dismissCulture: advance,
  };
}
