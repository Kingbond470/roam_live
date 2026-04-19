"use client";

import { useState, useEffect, useCallback } from "react";
import { journeys } from "@/data/journeys";

interface Stored {
  visitedSlugs: string[];
  lastVisitDate: string;
  streak: number;
  toastedJourneyIds: string[];
}

export interface WalkStats {
  visitedSlugs: string[];
  streak: number;
  markVisited: (slug: string) => void;
  newlyCompletedJourney: (typeof journeys)[number] | null;
  clearCompletedJourney: () => void;
}

const KEY = "nearaway-walk-stats";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function load(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { visitedSlugs: [], lastVisitDate: "", streak: 0, toastedJourneyIds: [] };
}

export function useWalkStats(): WalkStats {
  const [stored, setStored] = useState<Stored>({
    visitedSlugs: [], lastVisitDate: "", streak: 0, toastedJourneyIds: [],
  });
  const [newlyCompleted, setNewlyCompleted] = useState<(typeof journeys)[number] | null>(null);

  useEffect(() => { setStored(load()); }, []);

  const markVisited = useCallback((slug: string) => {
    setStored((prev) => {
      const t = todayStr();
      const newStreak =
        prev.lastVisitDate === t ? prev.streak :
        prev.lastVisitDate === yesterdayStr() ? prev.streak + 1 : 1;

      const newVisited = prev.visitedSlugs.includes(slug)
        ? prev.visitedSlugs
        : [...prev.visitedSlugs, slug];

      // Check if this completes any journey for the first time
      const visitedSet = new Set(newVisited);
      const justCompleted = journeys.find(
        (j) =>
          !prev.toastedJourneyIds.includes(j.id) &&
          j.citySlugOrder.every((s) => visitedSet.has(s))
      ) ?? null;

      const next: Stored = {
        visitedSlugs: newVisited,
        lastVisitDate: t,
        streak: newStreak,
        toastedJourneyIds: justCompleted
          ? [...prev.toastedJourneyIds, justCompleted.id]
          : prev.toastedJourneyIds,
      };

      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      if (justCompleted) setNewlyCompleted(justCompleted);
      return next;
    });
  }, []);

  return {
    visitedSlugs: stored.visitedSlugs,
    streak: stored.streak,
    markVisited,
    newlyCompletedJourney: newlyCompleted,
    clearCompletedJourney: () => setNewlyCompleted(null),
  };
}
