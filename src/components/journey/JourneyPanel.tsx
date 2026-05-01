"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Compass } from "lucide-react";
import { journeys, type Journey } from "@/data/journeys";
import type { City } from "@/types/city";
import { useAppStore } from "@/store/appStore";
import { Flag } from "@/components/ui/Flag";

interface Props {
  cities: City[];
  isOpen: boolean;
  onClose: () => void;
}

export function JourneyPanel({ cities, isOpen, onClose }: Props) {
  const { activePath, setActivePath, selectCity } = useAppStore();

  const handleSelect = (journey: Journey) => {
    // If already active, clear it
    if (activePath?.id === journey.id) {
      setActivePath(null);
      onClose();
      return;
    }
    setActivePath(journey);
    // Auto-select the first city in the path
    const firstCity = cities.find((c) => c.slug === journey.citySlugOrder[0]);
    if (firstCity) selectCity(firstCity);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0"
            style={{ zIndex: 44, background: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            className="glass-solid fixed inset-x-0 bottom-0 rounded-t-3xl border-t border-white/10 overflow-hidden"
            style={{
              zIndex: 45,
              maxHeight: "80vh",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="font-bold text-white text-sm">Thematic Journeys</p>
                  <p className="text-white/35 text-xs mt-0.5">Curated city routes — follow the path</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/8 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Journey cards */}
            <div className="overflow-y-auto pb-safe-sm" style={{ maxHeight: "calc(80vh - 80px)" }}>
              <div className="p-4 flex flex-col gap-3">
                {journeys.map((journey) => {
                  const isActive = activePath?.id === journey.id;
                  const pathCities = journey.citySlugOrder
                    .map((slug) => cities.find((c) => c.slug === slug))
                    .filter(Boolean) as City[];

                  return (
                    <button
                      key={journey.id}
                      onClick={() => handleSelect(journey)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
                        isActive
                          ? "border-opacity-60 ring-1"
                          : "border-white/8 hover:border-white/20 hover:bg-white/3"
                      }`}
                      style={
                        isActive
                          ? {
                              borderColor: journey.accentColor + "60",
                              boxShadow: `0 0 0 1px ${journey.accentColor}40`,
                              background: journey.accentColor + "0d",
                            }
                          : {}
                      }
                    >
                      <div className="flex items-start gap-3">
                        {/* Emoji + accent dot */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: journey.accentColor + "18" }}
                        >
                          {journey.emoji}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-bold text-white text-sm">{journey.name}</p>
                            {isActive && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                                style={{
                                  background: journey.accentColor + "25",
                                  color: journey.accentColor,
                                  border: `1px solid ${journey.accentColor}50`,
                                }}
                              >
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-white/40 text-xs mb-2.5">{journey.tagline}</p>

                          {/* City flag previews */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {pathCities.map((city, i) => (
                              <span
                                key={city.slug}
                                className="flex items-center gap-1 text-xs text-white/50"
                              >
                                <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={14} />
                                <span>{city.name}</span>
                                {i < pathCities.length - 1 && (
                                  <span className="text-white/15 ml-0.5">→</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* City count */}
                        <div
                          className="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-lg"
                          style={{
                            background: journey.accentColor + "15",
                            color: journey.accentColor,
                          }}
                        >
                          {pathCities.length} cities
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
