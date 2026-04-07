import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import citiesData from "@/data/cities.json";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("city") ?? "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const city = (citiesData as any[]).find((c) => c.slug === slug) ?? {
    name: "Roam.Live",
    country: "Earth",
    flagEmoji: "🌍",
    tags: ["explore"],
  };

  const thumbId = city.videos?.[0]?.youtubeId;
  const thumbUrl = thumbId
    ? `https://img.youtube.com/vi/${thumbId}/maxresdefault.jpg`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#050508",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background thumbnail */}
        {thumbUrl && (
          <img
            src={thumbUrl}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.5,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.5) 50%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            padding: "48px 60px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#f43f5e",
              }}
            />
            <span style={{ color: "#f43f5e", fontSize: "13px", fontWeight: 600, letterSpacing: "0.12em" }}>
              LIVE WALK
            </span>
          </div>

          {/* City name */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
            <span style={{ fontSize: "72px" }}>{city.flagEmoji}</span>
            <span
              style={{
                fontSize: "80px",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {city.name}
            </span>
          </div>

          {/* Country + brand */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "24px" }}>
              {city.country}
            </span>
            <span style={{ color: "#f59e0b", fontSize: "20px", fontWeight: 700, letterSpacing: "0.04em" }}>
              Roam.Live
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
