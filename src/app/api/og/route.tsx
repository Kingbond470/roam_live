import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import citiesData from "@/data/cities.json";

export const runtime = "edge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cities = citiesData as any[];

const CONTINENT_EMOJI: Record<string, string> = {
  asia: "🌏",
  europe: "🌍",
  americas: "🌎",
  africa: "🌍",
  oceania: "🌏",
};

const CONTINENT_CITIES: Record<string, string> = {
  asia: "Tokyo · Seoul · Bangkok · Singapore · Dubai",
  europe: "Paris · Rome · London · Barcelona · Amsterdam",
  americas: "New York · Miami · Chicago · Rio · Havana",
  africa: "Cairo · Cape Town · Marrakech · Nairobi",
  oceania: "Sydney · Auckland",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "city";
  const slug = searchParams.get("city") ?? "";
  const name = searchParams.get("name") ?? "";

  // ── City OG card ──
  if (type === "city" || !type || slug) {
    const city = cities.find((c) => c.slug === slug) ?? {
      name: "Nearaway.in",
      country: "A Window to Every Place on Earth",
      flagEmoji: "🌍",
      videos: [],
    };
    const thumbId = city.videos?.[0]?.youtubeId;
    const thumbUrl = thumbId
      ? `https://img.youtube.com/vi/${thumbId}/maxresdefault.jpg`
      : null;

    return new ImageResponse(
      (
        <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "#050508", position: "relative", fontFamily: "system-ui, sans-serif" }}>
          {thumbUrl && (
            <img src={thumbUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.5) 50%, transparent 100%)" }} />
          <div style={{ position: "relative", padding: "48px 60px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f43f5e" }} />
              <span style={{ color: "#f43f5e", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em" }}>LIVE WALK</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
              <span style={{ fontSize: 72 }}>{city.flagEmoji}</span>
              <span style={{ fontSize: 80, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1 }}>{city.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 24 }}>{city.country}</span>
              <span style={{ color: "#f59e0b", fontSize: 20, fontWeight: 700, letterSpacing: "0.04em" }}>Nearaway.in</span>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // ── Continent OG card ──
  if (type === "continent") {
    const key = name.toLowerCase();
    const emoji = CONTINENT_EMOJI[key] ?? "🌍";
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    const subtitle = CONTINENT_CITIES[key] ?? "";
    const continentCities = cities.filter((c) => c.continent?.toLowerCase() === key || (key === "americas" && c.continent === "Americas"));
    const count = continentCities.length;

    return new ImageResponse(
      (
        <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#050508", fontFamily: "system-ui, sans-serif", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", position: "relative" }}>
            <span style={{ fontSize: 100 }}>{emoji}</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: 72, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1 }}>{displayName}</span>
              <span style={{ fontSize: 24, color: "rgba(245,158,11,0.8)", fontWeight: 500 }}>{count} cities · Virtual 4K Walks</span>
            </div>
            {subtitle && (
              <span style={{ fontSize: 20, color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em" }}>{subtitle}</span>
            )}
            <span style={{ fontSize: 18, color: "#f59e0b", fontWeight: 700, letterSpacing: "0.06em", marginTop: "8px" }}>Nearaway.in</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // ── Country OG card ──
  if (type === "country") {
    const countryCities = cities.filter((c) => c.country?.toLowerCase() === name.toLowerCase());
    const flagEmoji = countryCities[0]?.flagEmoji ?? "🌍";
    const totalVideos = countryCities.reduce((s: number, c: any) => s + (c.videos?.length ?? 0), 0);
    const thumbId = countryCities[0]?.videos?.[0]?.youtubeId;
    const thumbUrl = thumbId ? `https://img.youtube.com/vi/${thumbId}/maxresdefault.jpg` : null;

    return new ImageResponse(
      (
        <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "#050508", position: "relative", fontFamily: "system-ui, sans-serif" }}>
          {thumbUrl && (
            <img src={thumbUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.6) 50%, transparent 100%)" }} />
          <div style={{ position: "relative", padding: "48px 60px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
              <span style={{ fontSize: 72 }}>{flagEmoji}</span>
              <span style={{ fontSize: 80, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1 }}>{name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(245,158,11,0.8)", fontSize: 22 }}>{countryCities.length} {countryCities.length === 1 ? "city" : "cities"} · {totalVideos} walks</span>
              <span style={{ color: "#f59e0b", fontSize: 20, fontWeight: 700, letterSpacing: "0.04em" }}>Nearaway.in</span>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // ── Journeys OG card ──
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#050508", fontFamily: "system-ui, sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(168,85,247,0.07) 0%, transparent 70%)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", position: "relative" }}>
          <div style={{ display: "flex", gap: "12px", fontSize: 56 }}>
            <span>🌙</span><span>🍜</span><span>🏛️</span><span>🌊</span><span>🎵</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: 68, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1 }}>Curated Journeys</span>
            <span style={{ fontSize: 26, color: "rgba(255,255,255,0.45)" }}>5 themed routes · 62 cities · No passport</span>
          </div>
          <span style={{ fontSize: 18, color: "#f59e0b", fontWeight: 700, letterSpacing: "0.06em", marginTop: "8px" }}>Nearaway.in</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
