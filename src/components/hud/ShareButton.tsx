"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link, Check, ExternalLink } from "lucide-react";

interface Props {
  citySlug: string;
  cityName: string;
  flagEmoji?: string;
}

export function ShareButton({ citySlug, cityName, flagEmoji = "" }: Props) {
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
      : `https://nearaway.in/?city=${citySlug}`;

  const landingUrl = `https://nearaway.in/walk/${citySlug}`;

  const twitterText = encodeURIComponent(
    `${flagEmoji} Just virtually walked through ${cityName} on Nearaway.in — no passport required 🌍\n\n#VirtualTravel #${cityName.replace(/\s+/g, "")} #RoamLive`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(landingUrl)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Walk ${cityName} on Nearaway.in`,
        text: `${flagEmoji} Take a virtual walk through ${cityName} — no passport required.`,
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
            className="absolute top-12 right-0 glass rounded-2xl p-3 flex flex-col gap-1 min-w-[210px] pointer-events-auto"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <p className="text-white/40 text-xs px-1 tracking-widest uppercase mb-1">Share walk</p>

            {/* Copy link */}
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

            {/* Share on X/Twitter */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors text-left"
            >
              <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-sm text-white/80">Share on X</span>
              <ExternalLink className="w-3 h-3 text-white/30 ml-auto" />
            </a>

            {/* Native share (mobile) */}
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
