"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  visible: boolean;
  emoji: string;
  title: string;
  subtitle: string;
  accentColor?: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function MilestoneToast({
  visible, emoji, title, subtitle, accentColor = "#f59e0b", onDismiss, autoDismissMs = 6000,
}: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [visible, onDismiss, autoDismissMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] pointer-events-auto"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div
            className="flex items-center gap-4 rounded-2xl px-5 py-4 shadow-2xl border min-w-[280px] max-w-[340px]"
            style={{
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}0a)`,
              borderColor: accentColor + "50",
              backdropFilter: "blur(16px)",
              backgroundColor: "rgba(5,5,8,0.9)",
            }}
          >
            <span className="text-3xl leading-none flex-shrink-0">{emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm leading-tight">{title}</p>
              <p className="text-white/50 text-xs mt-0.5 leading-snug">{subtitle}</p>
            </div>
            <button
              onClick={onDismiss}
              className="flex-shrink-0 text-white/30 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
