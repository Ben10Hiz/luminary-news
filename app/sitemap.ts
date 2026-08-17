import type { MetadataRoute } from "next";
import { getPublished, getSections } from "@/lib/stories";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, sections] = await Promise.all([
    getPublished(1000).catch(() => []),
    getSections().catch(() => []),
  ]);

  return [
    { url: absoluteUrl("/"), changeFrequency: "hourly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.3 },
    ...sections.map((s) => ({
      url: absoluteUrl(`/section/${s.slug}`),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...stories.map((s) => ({
      url: absoluteUrl(`/story/${s.slug}`),
      lastModified: new Date(s.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
