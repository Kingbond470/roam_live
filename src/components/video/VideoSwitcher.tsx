"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { City, CityVideo, VideoTimeOfDay, VideoType } from "@/types/city";
import { getMoodLabel } from "@/lib/utils";

interface Props {
  city: City;
  activeVideoId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (video: CityVideo) => void;
}

// Mood label → accent colour class
const MOOD_COLOURS: Record<string, string> = {
  "No Crowds":   "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "After Dark":  "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Golden Hour": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Deep Dive":   "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Adventure":   "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "Iconic":      "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "City Walk":   "bg-white/10 text-white/50 border-white/10",
};

// Group order for display
const GROUP_ORDER: VideoTimeOfDay[] = ["morning", "day", "golden-hour", "night", "any"];
const GROUP_LABELS: Record<VideoTimeOfDay, string> = {
  morning:       "Morning",
  day:           "Day",
  "golden-hour": "Evening",
  night:         "Night",
  any:           "Anytime",
};

// Only show grouping headers when city has 4+ videos
const MIN_FOR_GROUPS = 4;

export function VideoSwitcher({ city, activeVideoId, isOpen, onClose, onSelect }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const showGroups = city.videos.length >= MIN_FOR_GROUPS;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // Group videos by timeOfDay (only if city has enough)
  const grouped = GROUP_ORDER.reduce<Record<string, CityVideo[]>>((acc, tod) => {
    const vids = city.videos.filter((v) => v.timeOfDay === tod);
    if (vids.length > 0) acc[tod] = vids;
    return acc;
  }, {});

  const handleSelect = (video: CityVideo) => {
    onSelect(video);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0"
            style={{ zIndex: 44, background: "rgba(0,0,0,0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Bottom sheet panel */}
          <motion.div
            ref={panelRef}
            className="fixed inset-x-0 bottom-0 rounded-t-3xl border-t border-white/10 overflow-hidden"
            style={{
              zIndex: 45,
              background: "rgba(10,10,18,0.96)",
              backdropFilter: "blur(24px)",
              maxHeight: "70vh",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
              <div>
                <p className="font-bold text-white">
                  {city.flagEmoji} {city.name}
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {city.videos.length} {city.videos.length === 1 ? "video" : "videos"} available
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/8 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable video list */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 100px)" }}>
              {showGroups ? (
                // Grouped view — cities with 4+ videos
                GROUP_ORDER.filter((tod) => grouped[tod]).map((tod) => (
                  <div key={tod}>
                    <p className="px-5 pt-4 pb-2 text-xs tracking-widest uppercase text-white/30">
                      {GROUP_LABELS[tod]}
                    </p>
                    <VideoGrid
                      videos={grouped[tod]}
                      activeVideoId={activeVideoId}
                      onSelect={handleSelect}
                    />
                  </div>
                ))
              ) : (
                // Flat list — cities with 1–3 videos
                <div className="pt-3">
                  <VideoGrid
                    videos={city.videos}
                    activeVideoId={activeVideoId}
                    onSelect={handleSelect}
                  />
                </div>
              )}
              <div className="h-6" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function VideoGrid({
  videos,
  activeVideoId,
  onSelect,
}: {
  videos: CityVideo[];
  activeVideoId: string;
  onSelect: (v: CityVideo) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4">
      {videos.map((video) => {
        const isActive = video.youtubeId === activeVideoId;
        const mood = getMoodLabel(video.timeOfDay, video.type);
        const moodClass = MOOD_COLOURS[mood] ?? MOOD_COLOURS["City Walk"];

        return (
          <button
            key={video.youtubeId}
            onClick={() => onSelect(video)}
            className={`relative rounded-2xl overflow-hidden text-left transition-all duration-200 ${
              isActive
                ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-black"
                : "hover:scale-[1.02] hover:ring-1 hover:ring-white/20"
            }`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt={video.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
              )}
            </div>

            {/* Info */}
            <div className="absolute bottom-0 inset-x-0 p-2">
              {/* Mood pill */}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-medium mb-1 ${moodClass}`}>
                {mood}
              </span>
              <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                {video.label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
