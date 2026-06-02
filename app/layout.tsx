import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartcode.vercel.app";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SmartCode | Competitive Coding Platform",
    template: "%s | SmartCode",
  },
  description:
    "SmartCode is a competitive coding platform for practice problems, live battles, performance tracking, and interview-style problem solving.",
  applicationName: "SmartCode",
  keywords: [
    "coding platform",
    "competitive programming",
    "coding interview practice",
    "problem solving",
    "developer leaderboard",
  ],
  authors: [{ name: "SmartCode" }],
  creator: "SmartCode",
  publisher: "SmartCode",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "SmartCode | Competitive Coding Platform",
    description:
      "Practice coding problems, enter live battles, and track your progress with SmartCode.",
    siteName: "SmartCode",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCode | Competitive Coding Platform",
    description:
      "Practice coding problems, enter live battles, and track your progress with SmartCode.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f3f1ec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
