"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { City } from "@/types/city";
import { Flag } from "@/components/ui/Flag";

interface Props {
  city: City;
  isVisible: boolean;
}

export function VideoLoadingScreen({ city, isVisible }: Props) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 32, background: "var(--color-void)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        >
          {/* Ambient radial glow — pulses slowly */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 400,
              height: 400,
              background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Flag — large, glows in */}
          <motion.div
            className="mb-6 relative"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Flag countryCode={city.countryCode} flagEmoji={city.flagEmoji} size={80} className="rounded-md shadow-2xl" />
          </motion.div>

          {/* City name */}
          <motion.h1
            className="text-white text-3xl sm:text-4xl font-bold tracking-[0.15em] uppercase mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {city.name}
          </motion.h1>

          {/* Country */}
          <motion.p
            className="text-white/40 text-sm tracking-widest uppercase mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {city.country}
          </motion.p>

          {/* Film-strip shimmer bar */}
          <motion.div
            className="relative overflow-hidden rounded-full"
            style={{ width: 180, height: 2, background: "rgba(255,255,255,0.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-y-0 rounded-full"
              style={{ width: "45%", background: "linear-gradient(90deg, transparent, #f59e0b, transparent)" }}
              animate={{ x: ["-100%", "280%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.2 }}
            />
          </motion.div>

          {/* Tuning in label */}
          <motion.p
            className="text-white/25 text-xs tracking-[0.3em] uppercase mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Tuning in
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
