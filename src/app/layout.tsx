import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nearaway",
  legalName: "Nearaway",
  url: "https://nearaway.in",
  logo: "https://nearaway.in/android-chrome-192x192.png",
  sameAs: ["https://twitter.com/nearawayin"],
  description: "Nearaway is a virtual travel platform offering immersive 4K walking tours of cities around the world.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nearaway",
  url: "https://nearaway.in",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://nearaway.in/?city={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

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
  alternates: {
    canonical: "https://nearaway.in",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "b54Xd3DCpQLIoV64OifDmdtWER8gksBno_lmohVEkWI",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
