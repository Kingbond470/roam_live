"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  visible: boolean;
  message: string;
  subtext?: string;
  position?: "top" | "center" | "bottom";
  onDismiss: () => void;
}

export function CoachMark({ visible, message, subtext, position = "bottom", onDismiss }: Props) {
  const positionClass = {
    top: "top-24 left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-36 left-1/2 -translate-x-1/2",
  }[position];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="coach-mark"
          className={`fixed ${positionClass} z-50 max-w-xs w-[calc(100vw-2rem)] pointer-events-auto`}
          initial={{ opacity: 0, y: position === "top" ? -12 : 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === "top" ? -8 : 8, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={onDismiss}
        >
          <div className="glass rounded-2xl px-5 py-4 border border-amber-500/20 shadow-lg shadow-black/40">
            {/* Amber accent line */}
            <div className="w-8 h-0.5 rounded-full bg-amber-400 mb-3" />

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white text-sm font-medium leading-snug">{message}</p>
                {subtext && (
                  <p className="text-white/40 text-xs mt-1 leading-snug">{subtext}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tap to dismiss hint */}
            <p className="text-white/20 text-xs mt-3 tracking-wide">Tap anywhere to dismiss</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
