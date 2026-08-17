import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 20 * 1024 * 1024;

/** Turn the HTML mammoth produces out of a .docx into clean Markdown. */
function htmlToMarkdown(html: string): string {
  let md = html;

  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_m, t) => `\n\n# ${strip(t)}\n\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_m, t) => `\n\n## ${strip(t)}\n\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_m, t) => `\n\n### ${strip(t)}\n\n`);
  md = md.replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, (_m, t) => `\n\n#### ${strip(t)}\n\n`);
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, t) =>
    `\n\n> ${strip(t)}\n\n`
  );
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, t) => `\n- ${strip(t)}`);
  md = md.replace(/<\/(ul|ol)>/gi, "\n\n");
  md = md.replace(/<(ul|ol)[^>]*>/gi, "\n");
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, (_m, _t, t) => `**${strip(t)}**`);
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, (_m, _t, t) => `*${strip(t)}*`);
  md = md.replace(
    /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href, t) => `[${strip(t)}](${href})`
  );
  md = md.replace(
    /<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
    (_m, src, alt) => `\n\n![${alt}](${src})\n\n`
  );
  md = md.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi, (_m, src) => `\n\n![](${src})\n\n`);
  md = md.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");
  md = md.replace(/<br\s*\/?>/gi, "  \n");
  md = md.replace(/<\/p>/gi, "\n\n");
  md = md.replace(/<[^>]+>/g, "");

  return decode(md)
    .replace(/ /g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function strip(s: string) {
  return decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

function decode(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’");
}

/** Pull a headline off the top of the document and remove it from the body. */
function splitTitle(md: string): { title: string; body: string } {
  const lines = md.split("\n");
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  const first = (lines[i] ?? "").trim();

  const heading = first.match(/^#{1,2}\s+(.+)$/);
  if (heading) {
    return { title: heading[1].trim(), body: lines.slice(i + 1).join("\n").trim() };
  }
  // A short, punctuation-light opening line is almost always the headline.
  if (first && first.length <= 120 && !/[.!?]$/.test(first) && lines[i + 1]?.trim() === "") {
    return { title: first, body: lines.slice(i + 1).join("\n").trim() };
  }
  return { title: "", body: md };
}

export async function POST(req: Request) {
  const session = await getSession().catch(() => null);
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "That file is larger than 20 MB." }, { status: 400 });
    }

    const name = (file.name || "").toLowerCase();
    let markdown: string;

    if (name.endsWith(".docx")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { value } = await mammoth.convertToHtml({ buffer });
      markdown = htmlToMarkdown(value);
    } else if (name.endsWith(".html") || name.endsWith(".htm")) {
      markdown = htmlToMarkdown(await file.text());
    } else if (/\.(md|markdown|txt)$/.test(name)) {
      markdown = (await file.text()).replace(/\r\n/g, "\n").trim();
    } else if (name.endsWith(".doc")) {
      return NextResponse.json(
        { error: "Legacy .doc isn't supported — save it as .docx and try again." },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Upload a .docx, .md, .txt or .html file." },
        { status: 400 }
      );
    }

    if (!markdown.trim()) {
      return NextResponse.json({ error: "That document looks empty." }, { status: 400 });
    }

    const { title, body } = splitTitle(markdown);
    const words = body.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({ title, body, words });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not read that document." },
      { status: 400 }
    );
  }
}
