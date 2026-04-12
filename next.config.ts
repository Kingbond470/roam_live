import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "unpkg.com" },
    ],
  },
  // Turbopack config (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
