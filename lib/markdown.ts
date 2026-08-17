import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: true });

/**
 * Story bodies are authored as Markdown but may also contain pasted HTML
 * (from Word, Google Docs, a CMS export). Render both, then sanitize hard.
 */
export function renderBody(body: string): string {
  const html = marked.parse(body ?? "", { async: false }) as string;
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li", "blockquote",
      "strong", "em", "b", "i", "u", "s", "code", "pre", "br", "hr", "img",
      "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
      "sup", "sub", "span", "div", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "title", "allow", "allowfullscreen", "width", "height"],
      "*": ["class"],
    },
    allowedIframeHostnames: [
      "www.youtube.com", "youtube.com", "player.vimeo.com",
      "open.spotify.com", "w.soundcloud.com",
    ],
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//i.test(href);
        return {
          tagName: "a",
          attribs: external
            ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
            : attribs,
        };
      },
      img: (tagName, attribs) => ({
        tagName: "img",
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
  });
}

/** Plain text, for excerpts, meta descriptions and search snippets. */
export function toPlainText(body: string): string {
  const html = marked.parse(body ?? "", { async: false }) as string;
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

export function excerpt(story: { dek: string; body: string }, max = 180): string {
  const source = story.dek?.trim() ? story.dek : toPlainText(story.body);
  if (source.length <= max) return source;
  return source.slice(0, source.lastIndexOf(" ", max)).trimEnd() + "…";
}

export function readingMinutes(body: string): number {
  const words = toPlainText(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
