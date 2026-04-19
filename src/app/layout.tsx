import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nearaway.in"),
  title: "Nearaway.in — A Window to Every Place on Earth",
  description:
    "Explore 62 cities across 5 continents with immersive 4K virtual walks and cultural intelligence. No passport required.",
  keywords: ["virtual travel", "city walk", "4K walking tour", "travel from home", "world cities"],
  openGraph: {
    title: "Nearaway.in — A Window to Every Place on Earth",
    description: "Immersive 4K virtual walks across 62 cities. No passport required.",
    type: "website",
    url: "https://nearaway.in",
    siteName: "Nearaway.in",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Nearaway.in — Virtual City Walks" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nearawayin",
    title: "Nearaway.in — A Window to Every Place on Earth",
    description: "Immersive 4K virtual walks across 62 cities. No passport required.",
    images: ["/api/og"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#050508] text-white overflow-hidden" suppressHydrationWarning>
        {children}
        {/* YouTube IFrame API — loaded once globally */}
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="afterInteractive"
        />
        {/* Plausible Analytics — privacy-first, no cookie banner needed */}
        <Script
          defer
          data-domain="nearaway.in"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
