"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wifi } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  isBuffering: boolean;
}

const DOT_COUNT = 3;

export function BufferingOverlay({ isBuffering }: Props) {
  // Show "Poor connection" message only after 3s of continuous buffering
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!isBuffering) { setShowMessage(false); return; }
    const t = setTimeout(() => setShowMessage(true), 3000);
    return () => clearTimeout(t);
  }, [isBuffering]);

  return (
    <AnimatePresence>
      {isBuffering && (
        <motion.div
          key="buffering"
          className="absolute bottom-20 left-1/2 -translate-x-1/2"
          style={{ zIndex: 42 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          <div className="glass flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/10">
            {/* Three bouncing amber dots */}
            <div className="flex items-center gap-1">
              {Array.from({ length: DOT_COUNT }).map((_, i) => (
                <motion.span
                  key={i}
                  className="block w-1.5 h-1.5 rounded-full bg-amber-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {showMessage ? (
                <motion.div
                  key="poor"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Wifi className="w-3 h-3 text-amber-400/70" />
                  <span className="text-white/50 text-xs tracking-wide">Poor connection</span>
                </motion.div>
              ) : (
                <motion.span
                  key="reconnecting"
                  className="text-white/40 text-xs tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Reconnecting
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
