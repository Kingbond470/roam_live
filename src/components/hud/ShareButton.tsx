"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link, Check } from "lucide-react";

interface Props {
  citySlug: string;
  cityName: string;
}

export function ShareButton({ citySlug, cityName }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?city=${citySlug}`
      : `https://roam.live/?city=${citySlug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Walk ${cityName} on Roam.Live`,
        text: `Take a virtual walk through ${cityName} — no passport required.`,
        url: shareUrl,
      });
      setOpen(false);
    } else {
      handleCopy();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto glass rounded-full p-2.5 text-white/70 hover:text-white transition-colors"
        title="Share this city"
      >
        <Share2 className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-12 right-0 glass rounded-2xl p-3 flex flex-col gap-2 min-w-[200px] pointer-events-auto"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <p className="text-white/40 text-xs px-1 tracking-widest uppercase">Share walk</p>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors text-left"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Link className="w-4 h-4 text-white/60" />
              )}
              <span className="text-sm text-white/80">
                {copied ? "Copied!" : "Copy link"}
              </span>
            </button>

            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors text-left"
              >
                <Share2 className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/80">Share via…</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
