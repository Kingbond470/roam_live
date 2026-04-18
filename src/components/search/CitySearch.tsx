"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Heart, Play } from "lucide-react";
import Fuse from "fuse.js";
import type { City } from "@/types/city";
import { useAppStore } from "@/store/appStore";

interface Props {
  cities: City[];
  isOpen: boolean;
  onClose: () => void;
}

function thumbUrl(city: City): string | null {
  const id = city.videos[0]?.youtubeId;
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

export function CitySearch({ cities, isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>(cities.slice(0, 8));
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
      setResults(cities.slice(0, 8));
    }
  }, [isOpen, cities]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(cities.slice(0, 8));
      return;
    }
    const r = fuse.current.search(query).map((r) => r.item);
    setResults(r.slice(0, 8));
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
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
            <div className="max-w-2xl mx-auto">
              {/* Input */}
              <div className="flex items-center gap-3 glass rounded-2xl px-5 py-4 mb-3">
                <Search className="w-5 h-5 text-white/50 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any city, country, or vibe…"
                  className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-lg"
                />
                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results — thumbnail cards */}
              <div className="glass rounded-2xl overflow-hidden">
                {results.length === 0 ? (
                  <div className="px-5 py-8 text-center text-white/30 text-sm">
                    No cities found. Try a different search.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5">
                    {results.map((city, i) => {
                      const thumb = thumbUrl(city);
                      const isFav = favoriteSlugs.includes(city.slug);
                      return (
                        <motion.button
                          key={city.slug}
                          className="relative group aspect-video overflow-hidden bg-black/60 hover:z-10"
                          onClick={() => handleSelect(city)}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          {/* Thumbnail */}
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={city.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2" />
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Play icon on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                          </div>

                          {/* City info */}
                          <div className="absolute bottom-0 left-0 right-0 p-2.5">
                            <div className="flex items-end justify-between gap-1">
                              <div className="min-w-0">
                                <p className="text-white font-semibold text-sm leading-tight truncate">
                                  {city.flagEmoji} {city.name}
                                </p>
                                <p className="text-white/50 text-xs truncate">{city.country}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                {isFav && <Heart className="w-3 h-3 text-rose-400" fill="#f43f5e" />}
                                {city.tags.includes("new") && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium leading-none">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Hint */}
                {!query && (
                  <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-4 text-white/20 text-xs">
                    <span>Try: &ldquo;Tokyo&rdquo; · &ldquo;beaches&rdquo; · &ldquo;historic&rdquo; · &ldquo;Europe&rdquo;</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
