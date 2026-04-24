"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe, ArrowLeft, Play, Square, Download, Copy, Check, RotateCcw, Info } from "lucide-react";
import type { City } from "@/types/city";

// ─── Types ───────────────────────────────────────────────────────────────────

type Template = "cinematic" | "problem-solution";
type Platform = "reels" | "twitter" | "square";
type RecordState = "idle" | "preview" | "recording" | "done";

// ─── Constants ───────────────────────────────────────────────────────────────

const DURATION = 15;

const PLATFORMS: Record<Platform, { label: string; w: number; h: number; ratio: string }> = {
  reels:   { label: "Reels / TikTok", w: 360, h: 640, ratio: "9:16" },
  twitter: { label: "Twitter / X",    w: 640, h: 360, ratio: "16:9" },
  square:  { label: "Square",         w: 480, h: 480, ratio: "1:1"  },
};

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function ease(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function fade(t: number, inEnd: number, outStart: number, outEnd: number) {
  if (t < inEnd)     return ease(clamp(t / inEnd, 0, 1));
  if (t > outStart)  return ease(clamp(1 - (t - outStart) / (outEnd - outStart), 0, 1));
  return 1;
}

// ─── Template A: Cinematic ───────────────────────────────────────────────────
//
// Clean, no narration. City imagery, amber watermark, progress bar.
// Designed to feel like a premium travel channel clip.

function drawCinematic(
  ctx: CanvasRenderingContext2D,
  t: number,
  city: City | null,
  img: HTMLImageElement | null,
  w: number,
  h: number,
) {
  // Black base
  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, w, h);

  if (img) {
    const imgAlpha = clamp(t / 0.7, 0, 1);
    const endFade  = t > 13.5 ? clamp((t - 13.5) / 1.5, 0, 1) : 0;
    ctx.globalAlpha = imgAlpha * (1 - endFade);
    drawCover(ctx, img, w, h);
    ctx.globalAlpha = 1;
    if (endFade > 0) {
      ctx.fillStyle = `rgba(5,5,8,${endFade})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // Bottom gradient vignette
  const grad = ctx.createLinearGradient(0, h * 0.42, 0, h);
  grad.addColorStop(0, "rgba(5,5,8,0)");
  grad.addColorStop(1, "rgba(5,5,8,0.94)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Amber progress bar
  ctx.fillStyle = "rgba(245,158,11,0.9)";
  ctx.fillRect(0, 0, w * (t / DURATION), 3);

  if (!city) return;

  const textA = fade(t, 1.1, 12.8, 14.2);
  ctx.globalAlpha = textA;

  // City name
  const nameSize = Math.round(w * 0.108);
  ctx.font = `700 ${nameSize}px system-ui,sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign  = "left";
  ctx.textBaseline = "alphabetic";
  const nameY = h - Math.round(h * 0.118);
  ctx.fillText(city.name, 24, nameY);

  // Country
  ctx.font = `400 ${Math.round(w * 0.048)}px system-ui,sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.52)";
  ctx.fillText(city.country, 24, nameY + Math.round(nameSize * 1.1));

  // Channel-bug watermark — bottom right
  ctx.globalAlpha = textA * 0.5;
  ctx.font = `600 ${Math.round(w * 0.037)}px system-ui,sans-serif`;
  ctx.fillStyle = "#f59e0b";
  ctx.textAlign = "right";
  ctx.fillText("nearaway.in", w - 18, h - 14);

  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
}

// ─── Template B: Problem → Solution ─────────────────────────────────────────
//
// Phase 1 (0–5s):  Hook — "Wish you could travel more?"
// Phase 2 (5–11s): Solution — city walk reveal with stats pill
// Phase 3 (11–15s): CTA card — nearaway.in branding

function drawProblemSolution(
  ctx: CanvasRenderingContext2D,
  t: number,
  city: City | null,
  img: HTMLImageElement | null,
  w: number,
  h: number,
  totalCities: number,
) {
  const portrait = h > w;
  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, w, h);

  // ── Phase 1: Hook (0–5s) ──────────────────────────────────────────────────
  if (t < 5) {
    if (img) {
      ctx.globalAlpha = 0.13;
      drawCover(ctx, img, w, h);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = "rgba(5,5,8,0.6)";
    ctx.fillRect(0, 0, w, h);

    const a = fade(t, 0.55, 4.2, 5.0);
    ctx.globalAlpha = a;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const fs  = Math.round(portrait ? w * 0.094 : w * 0.068);
    const lh  = fs * 1.25;
    const yMid = portrait ? h * 0.39 : h * 0.36;

    ctx.font = `700 ${fs}px system-ui,sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Wish you could", w / 2, yMid);
    ctx.fillText("travel more?",   w / 2, yMid + lh);

    ctx.font = `400 ${Math.round(portrait ? w * 0.046 : w * 0.034)}px system-ui,sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("Most people can't afford to.", w / 2, yMid + lh * 2.3);

    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  // ── Phase 2: Solution (5–11s) ─────────────────────────────────────────────
  else if (t < 11) {
    const phaseT = t - 5;
    const imgA = clamp(phaseT / 0.9, 0, 1);
    if (img) {
      ctx.globalAlpha = imgA;
      drawCover(ctx, img, w, h);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = `rgba(5,5,8,${0.38 * imgA})`;
    ctx.fillRect(0, 0, w, h);

    const botGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
    botGrad.addColorStop(0, "rgba(5,5,8,0)");
    botGrad.addColorStop(1, "rgba(5,5,8,0.94)");
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, 0, w, h);

    const textA = clamp((phaseT - 0.75) / 0.55, 0, 1);
    ctx.globalAlpha = textA;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const nameFs = Math.round(portrait ? w * 0.104 : w * 0.072);
    ctx.font = `700 ${nameFs}px system-ui,sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(city?.name ?? "", w / 2, portrait ? h * 0.71 : h * 0.68);

    ctx.font = `400 ${Math.round(portrait ? w * 0.047 : w * 0.034)}px system-ui,sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(city?.country ?? "", w / 2, portrait ? h * 0.785 : h * 0.77);

    // Stats pill
    const pillText = `✓  ${totalCities} cities · Free · No passport`;
    const pillFs = Math.round(portrait ? w * 0.039 : w * 0.029);
    ctx.font = `600 ${pillFs}px system-ui,sans-serif`;
    const pillPad = 14;
    const pillW = ctx.measureText(pillText).width + pillPad * 2;
    const pillH = Math.round(pillFs * 1.75);
    const pillX = w / 2 - pillW / 2;
    const pillY = (portrait ? h * 0.864 : h * 0.86) - pillH / 2;

    ctx.fillStyle = "rgba(245,158,11,0.16)";
    rrect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(245,158,11,0.4)";
    ctx.lineWidth = 1;
    rrect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.stroke();
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(pillText, w / 2, pillY + pillH / 2);

    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  // ── Phase 3: CTA card (11–15s) ────────────────────────────────────────────
  else {
    const phaseT = t - 11;
    if (img) drawCover(ctx, img, w, h);
    ctx.fillStyle = "rgba(5,5,8,0.8)";
    ctx.fillRect(0, 0, w, h);

    const cardA = clamp(phaseT / 0.55, 0, 1);
    ctx.globalAlpha = cardA;

    const cardW = w * 0.82;
    const cardH = portrait ? h * 0.37 : h * 0.54;
    const cardX = (w - cardW) / 2;
    const cardY = (h - cardH) / 2;

    // Card background
    ctx.fillStyle = "rgba(8,8,16,0.94)";
    rrect(ctx, cardX, cardY, cardW, cardH, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(245,158,11,0.32)";
    ctx.lineWidth = 1.5;
    rrect(ctx, cardX, cardY, cardW, cardH, 20);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const cx = w / 2;

    // Label
    ctx.font = `600 ${Math.round(portrait ? w * 0.038 : w * 0.028)}px system-ui,sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillText("VIRTUAL TRAVEL · FREE", cx, cardY + cardH * 0.2);

    // Headline
    const hlFs = Math.round(portrait ? w * 0.084 : w * 0.06);
    ctx.font = `700 ${hlFs}px system-ui,sans-serif`;
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(`${totalCities} cities.`, cx, cardY + cardH * 0.41);

    ctx.font = `700 ${Math.round(portrait ? w * 0.068 : w * 0.05)}px system-ui,sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("No passport.", cx, cardY + cardH * 0.59);

    // URL
    ctx.font = `600 ${Math.round(portrait ? w * 0.055 : w * 0.042)}px system-ui,sans-serif`;
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("nearaway.in", cx, cardY + cardH * 0.8);

    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  // Amber progress bar (always on top)
  ctx.fillStyle = "rgba(245,158,11,0.9)";
  ctx.fillRect(0, 0, w * (t / DURATION), 3);
}

// ─── Caption generator ────────────────────────────────────────────────────────

function buildCaption(template: Template, city: City, totalCities: number, platform: Platform): string {
  if (template === "cinematic") {
    if (platform === "twitter") {
      return `Just took a virtual walk through ${city.name}, ${city.country} 🌍\n\nNo flight. No hotel. No passport.\n\n${totalCities} cities, free forever → nearaway.in`;
    }
    if (platform === "square") {
      return `${city.name}, ${city.country} 🌍\n\nYou don't need a flight to feel like you're there.\n\n${totalCities} cities to explore — completely free.\nLink in bio → nearaway.in\n\n#VirtualTravel #Travel #${city.country.replace(/\s/g, "")}`;
    }
    // reels
    return `Just explored ${city.name} from my couch 🌍\n\nNo flight. No passport. No planning.\n\nNearaway has ${totalCities} real cities in 4K — free to explore right now.\n\nWhich city would you visit first? 👇\n\n#VirtualTravel #Travel #${city.country.replace(/\s/g, "")} #Wanderlust #TravelVicariously`;
  }

  // problem-solution
  if (platform === "twitter") {
    return `Can't afford to travel right now?\n\nnearaway.in — ${totalCities} cities. 4K walks. Free forever. 🌍\n\nNo sign-up. No passport. Just explore.`;
  }
  if (platform === "square") {
    return `The travel hack nobody talks about 🤫\n\n${totalCities} cities. Free. No passport.\n\nnearaway.in — link in bio!\n\n#VirtualTravel #TravelHack #FreeTravel #ExploreMore`;
  }
  // reels
  return `POV: You want to travel but flights cost $1,200 ✈️💸\n\nNearaway — ${totalCities} cities, 4K virtual walks, completely free. No sign-up, no passport, no hotel.\n\nStart with ${city.name} 👇\n\n#VirtualTravel #TravelHack #BudgetTravel #FreeTravel #Wanderlust`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StudioClient({ cities }: { cities: City[] }) {
  const [template,     setTemplate]     = useState<Template>("cinematic");
  const [platform,     setPlatform]     = useState<Platform>("reels");
  const [selectedSlug, setSelectedSlug] = useState(cities[0]?.slug ?? "");
  const [recordState,  setRecordState]  = useState<RecordState>("idle");
  const [downloadUrl,  setDownloadUrl]  = useState<string | null>(null);
  const [progress,     setProgress]     = useState(0);
  const [copied,       setCopied]       = useState(false);
  const [imgLoaded,    setImgLoaded]    = useState(false);

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number | null>(null);
  const startRef    = useRef(0);
  const modeRef     = useRef<"preview" | "recording" | "off">("off");
  const imgRef      = useRef<HTMLImageElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs that mirror state so the RAF loop never reads stale closures
  const templateRef = useRef(template);
  const platformRef = useRef(platform);
  const cityRef     = useRef<City | null>(cities[0] ?? null);
  const totalCities = cities.length;

  useEffect(() => { templateRef.current = template; }, [template]);
  useEffect(() => { platformRef.current = platform; }, [platform]);
  useEffect(() => {
    cityRef.current = cities.find((c) => c.slug === selectedSlug) ?? null;
  }, [selectedSlug, cities]);

  // Load thumbnail via Next.js image proxy (same-origin → no canvas taint)
  useEffect(() => {
    const city = cities.find((c) => c.slug === selectedSlug);
    if (!city?.videos.length) return;
    setImgLoaded(false);
    const src = `/_next/image?url=${encodeURIComponent(
      `https://img.youtube.com/vi/${city.videos[0].youtubeId}/maxresdefault.jpg`
    )}&w=1280&q=80`;
    const img = new Image();
    img.onload  = () => { imgRef.current = img; setImgLoaded(true); };
    img.onerror = () => { imgRef.current = null; setImgLoaded(false); };
    img.src = src;
  }, [selectedSlug, cities]);

  // ── Core drawing function (reads from refs — safe inside RAF) ────────────
  const drawFrame = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = PLATFORMS[platformRef.current];
    if (templateRef.current === "cinematic") {
      drawCinematic(ctx, t, cityRef.current, imgRef.current, w, h);
    } else {
      drawProblemSolution(ctx, t, cityRef.current, imgRef.current, w, h, totalCities);
    }
  }, [totalCities]);

  // ── Animation loop ───────────────────────────────────────────────────────
  const animate = useCallback((ts: number) => {
    const elapsed = (ts - startRef.current) / 1000;
    const mode    = modeRef.current;
    const t       = mode === "preview" ? elapsed % DURATION : Math.min(elapsed, DURATION);

    drawFrame(t);

    if (mode === "recording" && t >= DURATION) {
      recorderRef.current?.stop();
      modeRef.current = "off";
    } else if (mode !== "off") {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [drawFrame]);

  const stopAnimation = useCallback(() => {
    modeRef.current = "off";
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // ── Preview (loops) ──────────────────────────────────────────────────────
  const startPreview = useCallback(() => {
    stopAnimation();
    modeRef.current = "preview";
    startRef.current = performance.now();
    setRecordState("preview");
    setDownloadUrl(null);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate, stopAnimation]);

  // ── Record ───────────────────────────────────────────────────────────────
  const startRecording = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    stopAnimation();

    const stream   = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9" : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setDownloadUrl(URL.createObjectURL(blob));
      setRecordState("done");
      setProgress(100);
    };
    recorder.start(100);
    recorderRef.current = recorder;

    modeRef.current  = "recording";
    startRef.current = performance.now();
    setRecordState("recording");
    setProgress(0);

    const t0 = Date.now();
    timerRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - t0) / (DURATION * 1000)) * 100, 99);
      setProgress(pct);
    }, 200);

    rafRef.current = requestAnimationFrame(animate);
  }, [animate, stopAnimation]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    stopAnimation();
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setRecordState("idle");
    setProgress(0);
    requestAnimationFrame(() => drawFrame(0));
  }, [stopAnimation, downloadUrl, drawFrame]);

  // Draw static first frame when config changes (not during animation)
  useEffect(() => {
    if (recordState === "preview" || recordState === "recording") return;
    const id = requestAnimationFrame(() => drawFrame(recordState === "done" ? DURATION : 0));
    return () => cancelAnimationFrame(id);
  }, [template, platform, selectedSlug, imgLoaded, recordState, drawFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopAnimation(); recorderRef.current?.stop(); };
  }, [stopAnimation]);

  // ── Derived values ───────────────────────────────────────────────────────
  const plat      = PLATFORMS[platform];
  const maxH      = 560;
  const scale     = Math.min(1, maxH / plat.h, 380 / plat.w);
  const displayW  = Math.round(plat.w * scale);
  const displayH  = Math.round(plat.h * scale);
  const city      = cities.find((c) => c.slug === selectedSlug) ?? cities[0];
  const filename  = `nearaway-${city.slug}-${template === "cinematic" ? "A" : "B"}-${platform}.webm`;
  const caption   = city ? buildCaption(template, city, totalCities, platform) : "";
  const canRecord = imgLoaded && typeof MediaRecorder !== "undefined";

  const copyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // ── UI ───────────────────────────────────────────────────────────────────

  const configDisabled = recordState === "recording";

  return (
    <div className="h-full overflow-y-auto bg-[#050508] text-white">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#050508]/90 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-lg tracking-tight">
            Near<span className="text-amber-400">away</span>
          </span>
        </Link>
        <p className="text-white/35 text-xs font-semibold tracking-widest uppercase">Content Studio</p>
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Globe</span>
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-20">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-amber-400/80 text-xs tracking-widest uppercase font-semibold mb-1.5">Internal Tool</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Social Video Studio</h1>
            <p className="text-white/40 text-sm mt-1">
              15-second ready-to-post clips — no editing, no tools, no effort.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-xs font-semibold">{totalCities} cities available</span>
          </div>
        </div>

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_250px] gap-6 items-start">

          {/* ── LEFT: Config ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Template selector */}
            <div>
              <p className="text-xs tracking-widest uppercase text-white/35 font-semibold mb-3">Template</p>
              <div className="flex flex-col gap-2">
                {(["cinematic", "problem-solution"] as Template[]).map((t) => (
                  <button
                    key={t}
                    disabled={configDisabled}
                    onClick={() => { setTemplate(t); stopAnimation(); setRecordState("idle"); }}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      template === t
                        ? "border-amber-500/40 bg-amber-500/8 text-white"
                        : "border-white/8 bg-white/2 text-white/50 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <p className="font-semibold text-sm">
                      {t === "cinematic" ? "🎬  Video A — Cinematic" : "🧩  Video B — Problem / Solution"}
                    </p>
                    <p className="text-[11px] mt-1 opacity-55 leading-relaxed">
                      {t === "cinematic"
                        ? "Clean city walk. No pitch. Subtle watermark."
                        : "Hook → Walk reveal → CTA card with stats."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform selector */}
            <div>
              <p className="text-xs tracking-widest uppercase text-white/35 font-semibold mb-3">Platform Format</p>
              <div className="flex flex-col gap-1.5">
                {(Object.entries(PLATFORMS) as [Platform, (typeof PLATFORMS)[Platform]][]).map(([key, p]) => (
                  <button
                    key={key}
                    disabled={configDisabled}
                    onClick={() => { setPlatform(key); stopAnimation(); setRecordState("idle"); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                      platform === key
                        ? "border-amber-500/40 bg-amber-500/8 text-white"
                        : "border-white/8 text-white/50 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span className="font-medium">{p.label}</span>
                    <span className="text-xs font-mono text-white/35">{p.ratio}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* City picker */}
            <div>
              <p className="text-xs tracking-widest uppercase text-white/35 font-semibold mb-3">City</p>
              <div className="relative">
                <select
                  value={selectedSlug}
                  disabled={configDisabled}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-3 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-amber-500/40 disabled:opacity-40"
                >
                  {cities.map((c) => (
                    <option key={c.slug} value={c.slug} className="bg-[#0a0a12]">
                      {c.flagEmoji}  {c.name}, {c.country}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">▼</div>
              </div>
              {!imgLoaded && (
                <p className="text-xs text-white/30 mt-1.5">Loading thumbnail…</p>
              )}
            </div>

            {/* Posting schedule guide */}
            <div className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4">
              <p className="text-xs tracking-widest uppercase text-white/30 font-semibold mb-3">Daily Schedule</p>
              <div className="flex flex-col gap-3">
                {[
                  { n: "1", time: "8–10 AM", label: "Video A — Cinematic", note: "Morning scroll, pure inspiration" },
                  { n: "2", time: "7–9 PM",  label: "Video B — Problem/Solution", note: "Evening FOMO, highest engagement" },
                ].map((item) => (
                  <div key={item.n} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500/12 border border-amber-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-400 text-[10px] font-bold">{item.n}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/65">{item.time} · {item.label}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CENTER: Canvas preview ───────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4">
            {/* Canvas frame */}
            <div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black flex-shrink-0"
              style={{ width: displayW, height: displayH }}
            >
              <canvas
                ref={canvasRef}
                width={plat.w}
                height={plat.h}
                style={{ width: displayW, height: displayH, display: "block" }}
              />
            </div>

            {/* Format meta */}
            <div className="flex items-center gap-3 text-white/25 text-xs font-mono">
              <span>{plat.w} × {plat.h} px</span>
              <span>·</span>
              <span>{plat.ratio}</span>
              <span>·</span>
              <span>15 s</span>
              <span>·</span>
              <span>WebM</span>
            </div>

            {/* Recording progress */}
            {recordState === "recording" && (
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Recording
                  </span>
                  <span className="text-xs text-white/40 font-mono">
                    {Math.round(progress / 100 * DURATION)}s / {DURATION}s
                  </span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {recordState === "done" && (
              <p className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Recording complete — download ready
              </p>
            )}
          </div>

          {/* ── RIGHT: Controls + Caption ────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Recording controls */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 flex flex-col gap-2.5">
              <p className="text-xs tracking-widest uppercase text-white/30 font-semibold mb-0.5">Controls</p>

              <button
                onClick={startPreview}
                disabled={recordState === "recording"}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/65 hover:text-white hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 flex-shrink-0" />
                {recordState === "preview" ? "Previewing (loop)" : "Preview"}
              </button>

              <button
                onClick={startRecording}
                disabled={recordState === "recording" || !canRecord}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/12 border border-red-500/25 text-red-400 hover:bg-red-500/22 transition-all text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Square className="w-4 h-4 flex-shrink-0" fill="currentColor" />
                {recordState === "recording" ? "Recording…" : "Record 15s"}
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={filename}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/12 border border-amber-500/25 text-amber-400 hover:bg-amber-500/22 transition-all text-sm font-semibold"
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  Download .webm
                </a>
              )}

              {(recordState === "preview" || recordState === "done") && (
                <button
                  onClick={reset}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/3 border border-white/6 text-white/35 hover:text-white/60 transition-all text-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
                  Reset
                </button>
              )}

              {typeof MediaRecorder === "undefined" && (
                <p className="text-xs text-orange-400/80 text-center mt-1">
                  Recording not supported in this browser. Try Chrome or Edge.
                </p>
              )}
            </div>

            {/* Caption */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest uppercase text-white/30 font-semibold">Caption</p>
                <span className="text-[10px] text-amber-400/55 font-medium">{PLATFORMS[platform].label}</span>
              </div>
              <textarea
                readOnly
                value={caption}
                className="w-full bg-black/30 border border-white/6 rounded-xl p-3 text-xs text-white/55 leading-relaxed resize-none focus:outline-none scrollable"
                rows={9}
              />
              <button
                onClick={copyCaption}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white/55 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                {copied
                  ? <><Check className="w-4 h-4 text-green-400" /> Copied!</>
                  : <><Copy className="w-4 h-4" /> Copy caption</>}
              </button>
            </div>

            {/* Platform tips */}
            <div className="rounded-2xl border border-white/6 bg-white/[0.015] p-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Info className="w-3.5 h-3.5 text-white/25" />
                <p className="text-xs tracking-widest uppercase text-white/25 font-semibold">Quick Tips</p>
              </div>
              <ul className="text-[11px] text-white/30 leading-relaxed space-y-1.5">
                <li>• .webm uploads directly to Instagram, TikTok, Twitter</li>
                <li>• Need .mp4? Free convert at cloudconvert.com</li>
                <li>• Tokyo, Dubai, Rio — high contrast = thumb-stopping</li>
                <li>• Post Reel + Story same session for 2× reach</li>
                <li>• Pin first comment with your caption on Instagram</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
