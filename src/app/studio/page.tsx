import type { Metadata } from "next";
import { cities } from "@/lib/cities";
import { StudioClient } from "./StudioClient";

export const metadata: Metadata = {
  title: "Studio — Nearaway Content Creator",
  description: "Internal social media video creation studio for Nearaway.",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioClient cities={cities} />;
}
