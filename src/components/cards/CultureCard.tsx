"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Utensils, Lightbulb, Sparkles, CheckCircle, XCircle, Landmark } from "lucide-react";
import type { City } from "@/types/city";

interface Props {
  city: City;
  isOpen: boolean;
  onClose: () => void;
  onCompare?: () => void;
}

export function CultureCard({ city, isOpen, onClose, onCompare }: Props) {
  const { culture } = city;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            style={{ zIndex: 48 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-[#0a0a10] border border-white/10"
            style={{ zIndex: 49, maxHeight: "85dvh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-4 sm:px-5 py-3 border-b border-white/8">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
                  {city.flagEmoji} {city.name}
                </h2>
                <p className="text-white/40 text-sm mt-0.5">{city.country} · {city.continent}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 -mr-1 rounded-full bg-white/8 hover:bg-white/12 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="scrollable overflow-y-auto px-4 sm:px-5 py-4 flex flex-col gap-4 sm:gap-5" style={{ maxHeight: "calc(85dvh - 100px)" }}>
              {/* Origin Story */}
              {city.origin && (
                <div className="rounded-xl border border-amber-500/20 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/8 border-b border-amber-500/15">
                    <Landmark className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                    <span className="text-amber-400/90 text-xs font-semibold uppercase tracking-wider">Origin Story</span>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400/70 border border-amber-500/20 font-medium">
                      {city.origin.era}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
                      <span>📅 Founded {city.origin.founded}</span>
                      {city.origin.originalName && (
                        <span>· Originally <em className="text-white/60 not-italic font-medium">{city.origin.originalName}</em></span>
                      )}
                      <span>· {city.origin.founders}</span>
                    </div>
                    <p className="text-white/75 text-sm leading-relaxed">{city.origin.story}</p>
                  </div>
                </div>
              )}

              {/* Greeting + Currency row */}
              <div className="grid grid-cols-2 gap-3">
                <InfoTile label="Local greeting" value={culture.greeting} />
                <InfoTile label="Currency" value={culture.currency} />
              </div>

              {/* Best season */}
              <InfoTile label="Best time to visit" value={culture.bestSeason} icon="🌤" />

              {/* Fun fact */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                    Did you know?
                  </span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{culture.funFact}</p>
              </div>

              {/* Must eat */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-4 h-4 text-white/50" />
                  <span className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                    Must eat
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {culture.mustEat.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/80 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Local tip */}
              <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    Local tip
                  </span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{culture.localTip}</p>
              </div>

              {/* Dos & Don'ts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DosDonts
                  title="Do"
                  items={culture.culturalDos}
                  type="do"
                />
                <DosDonts
                  title="Don't"
                  items={culture.culturalDonts}
                  type="dont"
                />
              </div>

              {/* CTA */}
              {onCompare && (
                <button
                  onClick={onCompare}
                  className="w-full py-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold text-sm hover:bg-amber-500/25 transition-colors"
                >
                  Compare with another city →
                </button>
              )}

              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoTile({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/8 p-3.5">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-sm font-medium">
        {icon && <span className="mr-1.5">{icon}</span>}
        {value}
      </p>
    </div>
  );
}

function DosDonts({ title, items, type }: { title: string; items: string[]; type: "do" | "dont" }) {
  const isDo = type === "do";
  return (
    <div className={`rounded-xl border p-3.5 ${isDo ? "bg-green-500/8 border-green-500/20" : "bg-red-500/8 border-red-500/20"}`}>
      <div className="flex items-center gap-1.5 mb-2.5">
        {isDo ? (
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-red-400" />
        )}
        <span className={`text-xs font-semibold uppercase tracking-wider ${isDo ? "text-green-400" : "text-red-400"}`}>
          {title}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="text-white/70 text-xs flex items-start gap-1.5">
            <span className="mt-0.5 flex-shrink-0 opacity-50">{isDo ? "✓" : "×"}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
