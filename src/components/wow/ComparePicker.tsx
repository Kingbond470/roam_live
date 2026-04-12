"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SplitSquareHorizontal } from "lucide-react";
import Fuse from "fuse.js";
import type { City } from "@/types/city";

interface Props {
  isOpen: boolean;
  cities: City[];          // all cities except the current one
  onSelect: (city: City) => void;
  onClose: () => void;
}

export function ComparePicker({ isOpen, cities, onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>(cities.slice(0, 8));
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useRef(
    new Fuse(cities, { keys: ["name", "country", "continent"], threshold: 0.35 })
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(cities.slice(0, 8));
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen, cities]);

  useEffect(() => {
    fuse.current = new Fuse(cities, { keys: ["name", "country", "continent"], threshold: 0.35 });
  }, [cities]);

  useEffect(() => {
    if (!query.trim()) { setResults(cities.slice(0, 8)); return; }
    setResults(fuse.current.search(query).map((r) => r.item).slice(0, 8));
  }, [query, cities]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            style={{ zIndex: 58 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 left-0 right-0 p-4 md:p-8"
            style={{ zIndex: 59 }}
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
          >
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <SplitSquareHorizontal className="w-4 h-4 text-amber-400" />
                <p className="text-white/60 text-sm tracking-wide">Compare with…</p>
                <button onClick={onClose} className="ml-auto p-2 -mr-2 text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search input */}
              <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3.5 mb-2">
                <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a city to compare..."
                  className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base"
                />
              </div>

              {/* Results */}
              <div className="glass rounded-2xl overflow-hidden">
                {results.length === 0 ? (
                  <div className="px-5 py-6 text-center text-white/30 text-sm">No cities found</div>
                ) : (
                  results.map((city, i) => (
                    <motion.button
                      key={city.slug}
                      className="w-full flex items-center gap-3 px-4 py-4 sm:py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left min-h-[52px]"
                      onClick={() => { onSelect(city); onClose(); }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <span className="text-xl">{city.flagEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{city.name}</p>
                        <p className="text-white/40 text-xs">{city.country} · {city.continent}</p>
                      </div>
                      <span className="text-white/20 text-xs shrink-0">vs you</span>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
