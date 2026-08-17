import { getPublished } from "@/lib/stories";
import { renderBody, excerpt } from "@/lib/markdown";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-dynamic";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const stories = await getPublished(50).catch(() => []);
  const updated = stories[0]?.published_at ?? new Date();

  const items = stories
    .map((s) => {
      const url = absoluteUrl(`/story/${s.slug}`);
      return `    <item>
      <title>${esc(s.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(s.published_at ?? s.created_at).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${s.author}]]></dc:creator>
      <category>${esc(s.section)}</category>
      <description><![CDATA[${excerpt(s, 300)}]]></description>
      <content:encoded><![CDATA[${renderBody(s.body)}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.newsroom)}</title>
    <link>${site.url}</link>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>${esc(site.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
