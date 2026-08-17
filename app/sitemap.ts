import type { MetadataRoute } from "next";
import { allStories } from "@/content/stories";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    ...allStories().map((s) => ({
      url: absoluteUrl(`/story/${s.slug}`),
      lastModified: new Date(s.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
