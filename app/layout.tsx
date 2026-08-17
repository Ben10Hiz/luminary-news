import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";

// Fonts are vendored into the repo rather than fetched from Google at build
// time: one less build-time network dependency, and nothing about a reader's
// visit leaves our own domain.
const inter = localFont({
  src: [{ path: "./fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
});

const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin-wght-normal.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/newsreader-latin-wght-italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `News — ${site.name}`,
    template: `%s — ${site.newsroom}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.newsroom,
    locale: site.locale,
    url: site.url,
    title: `News — ${site.name}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    types: { "application/rss+xml": `${site.url}/feed.xml` },
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
