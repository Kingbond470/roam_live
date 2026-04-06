import { NextRequest, NextResponse } from "next/server";
import { getCityBySlug } from "@/lib/cities";

export async function POST(req: NextRequest) {
  try {
    const { citySlug } = await req.json();
    if (!citySlug) {
      return NextResponse.json({ error: "citySlug required" }, { status: 400 });
    }

    const city = getCityBySlug(citySlug);
    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    // Phase 0: return hardcoded data (no API cost)
    // Phase 1: uncomment Claude API call below for dynamic cities
    return NextResponse.json({ data: city.culture });

    /*
    // Phase 1 — Claude-powered cultural intelligence
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `You are a cultural intelligence assistant for a travel platform.
For the city: ${city.name}, ${city.country}
Return ONLY a valid JSON object with these exact keys:
{
  "greeting": "most common local greeting",
  "currency": "currency name and symbol",
  "bestSeason": "best time to visit in 1 sentence",
  "mustEat": ["dish1", "dish2", "dish3", "dish4"],
  "localTip": "one specific, useful tip for first-time visitors",
  "funFact": "one surprising, specific fact about this city",
  "culturalDos": ["do1", "do2", "do3"],
  "culturalDonts": ["dont1", "dont2", "dont3"]
}
Be specific and opinionated. No markdown, just raw JSON.`
      }]
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const data = JSON.parse(text);
    return NextResponse.json({ data });
    */
  } catch (err) {
    console.error("[culture API]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
