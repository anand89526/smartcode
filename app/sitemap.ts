import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartcode.vercel.app";

const routes = [
  "",
  "/login",
  "/signup",
  "/dashboard",
  "/problems",
  "/solve",
  "/battle",
  "/leaderboard",
  "/settings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.7,
  }));
}
