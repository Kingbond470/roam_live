import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Roam.Live — A Window to Every Place on Earth",
  description:
    "Explore any city, town, or village on Earth — live or archival — with AI-powered cultural intelligence. No passport required.",
  openGraph: {
    title: "Roam.Live",
    description: "A window to every place on Earth.",
    type: "website",
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
      <body className="h-full bg-[#050508] text-white overflow-hidden">
        {children}
        {/* YouTube IFrame API — loaded once globally */}
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
