"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Heart } from "lucide-react";
import Fuse from "fuse.js";
import type { City } from "@/types/city";
import { useAppStore } from "@/store/appStore";

interface Props {
  cities: City[];
  isOpen: boolean;
  onClose: () => void;
}

const CONTINENT_COLORS: Record<string, string> = {
  Asia: "bg-orange-500/20 text-orange-300",
  Europe: "bg-blue-500/20 text-blue-300",
  Americas: "bg-green-500/20 text-green-300",
  Africa: "bg-yellow-500/20 text-yellow-300",
  Oceania: "bg-purple-500/20 text-purple-300",
};

export function CitySearch({ cities, isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>(cities.slice(0, 6));
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectCity, favoriteSlugs } = useAppStore();

  const fuse = useRef(
    new Fuse(cities, {
      keys: ["name", "country", "continent", "tags"],
      threshold: 0.35,
      includeScore: true,
    })
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults(cities.slice(0, 6));
    }
  }, [isOpen, cities]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(cities.slice(0, 6));
      return;
    }
    const r = fuse.current.search(query).map((r) => r.item);
    setResults(r.slice(0, 6));
  }, [query, cities]);

  const handleSelect = (city: City) => {
    onClose();
    selectCity(city);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            style={{ zIndex: 58 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Search panel */}
          <motion.div
            className="fixed top-0 left-0 right-0 p-4 md:p-8"
            style={{ zIndex: 59 }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="max-w-xl mx-auto">
              {/* Input */}
              <div className="flex items-center gap-3 glass rounded-2xl px-5 py-4 mb-3">
                <Search className="w-5 h-5 text-white/50 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any city in the world..."
                  className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-lg"
                />
                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              <div className="glass rounded-2xl overflow-hidden">
                {results.length === 0 ? (
                  <div className="px-5 py-8 text-center text-white/30 text-sm">
                    No cities found. Try a different search.
                  </div>
                ) : (
                  results.map((city, i) => (
                    <motion.button
                      key={city.slug}
                      className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      onClick={() => handleSelect(city)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <span className="text-2xl">{city.flagEmoji}</span>
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium">{city.name}</p>
                        <p className="text-white/40 text-sm">{city.country}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {favoriteSlugs.includes(city.slug) && (
                          <Heart className="w-3.5 h-3.5 text-rose-400" fill="#f43f5e" />
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${CONTINENT_COLORS[city.continent] ?? "bg-white/10 text-white/60"}`}
                        >
                          {city.continent}
                        </span>
                        <MapPin className="w-3.5 h-3.5 text-white/20" />
                      </div>
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
