"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { marked } from "marked";
import { saveStoryAction, deleteStoryAction } from "@/app/admin/actions";
import type { Story, Section } from "@/lib/stories";

marked.setOptions({ gfm: true, breaks: true });

type Props = {
  story?: Story | null;
  sections: Section[];
  saved?: boolean;
};

const label =
  "block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3";
const field =
  "mt-2 w-full rounded-[3px] border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-4 focus:border-accent focus:outline-none";

function toLocalInput(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = new Date(d);
  const off = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - off).toISOString().slice(0, 16);
}

export default function StoryEditor({ story, sections, saved }: Props) {
  const [title, setTitle] = useState(story?.title ?? "");
  const [body, setBody] = useState(story?.body ?? "");
  const [coverUrl, setCoverUrl] = useState(story?.cover_url ?? "");
  const [showPreview, setShowPreview] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [state, action, pending] = useActionState(saveStoryAction, null as
    | { error?: string }
    | null);

  const [flash, setFlash] = useState(saved ?? false);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  /** Wrap or insert text at the cursor in the body textarea. */
  function surround(before: string, after = "", placeholder = "") {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end) || placeholder;
    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  }

  function insertAtCursor(text: string) {
    const el = bodyRef.current;
    if (!el) {
      setBody(body + "\n\n" + text);
      return;
    }
    const start = el.selectionStart;
    setBody(body.slice(0, start) + text + body.slice(start));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + text.length;
    });
  }

  async function uploadImage(file: File, target: "cover" | "inline") {
    setBusy(target === "cover" ? "Uploading cover…" : "Uploading image…");
    setNotice(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      if (target === "cover") setCoverUrl(json.url);
      else insertAtCursor(`\n\n![${file.name.replace(/\.[^.]+$/, "")}](${json.url})\n\n`);
      setNotice("Image uploaded.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  async function importDocument(file: File) {
    setBusy("Reading document…");
    setNotice(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/import", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Import failed");
      if (json.title && !title.trim()) setTitle(json.title);
      setBody((prev) => (prev.trim() ? prev + "\n\n" + json.body : json.body));
      setNotice(
        `Imported ${json.words.toLocaleString()} words from ${file.name}. Review before publishing.`
      );
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setBusy(null);
    }
  }

  /** Paste an image straight into the body. */
  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(e.clipboardData.items).find((i) =>
      i.type.startsWith("image/")
    );
    if (item) {
      const file = item.getAsFile();
      if (file) {
        e.preventDefault();
        void uploadImage(file, "inline");
      }
    }
  }

  const toolbarBtn =
    "rounded-[3px] border border-line bg-paper px-2.5 py-1 text-xs text-ink-2 hover:border-accent hover:text-ink transition-colors";

  return (
    <form action={action} className="mx-auto max-w-6xl px-5 py-8">
      {story && <input type="hidden" name="id" value={story.id} />}
      <input type="hidden" name="cover_url" value={coverUrl} />

      {/* --- Sticky action bar --- */}
      <div className="sticky top-[57px] z-30 -mx-5 mb-8 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="headline text-xl tracking-tight text-ink">
            {story ? "Edit story" : "New story"}
          </h1>

          {flash && (
            <span className="rounded-full bg-card px-3 py-1 text-xs text-accent ring-1 ring-inset ring-accent/30">
              Saved ✓
            </span>
          )}
          {busy && <span className="text-xs text-ink-3">{busy}</span>}

          <div className="ml-auto flex items-center gap-2">
            {story?.status === "published" && (
              <Link
                href={`/story/${story.slug}`}
                target="_blank"
                className="rounded-[3px] border border-line px-3 py-2 text-xs text-ink-2 hover:text-ink transition-colors"
              >
                View live ↗
              </Link>
            )}
            <button
              type="submit"
              name="status"
              value="draft"
              disabled={pending}
              className="rounded-[3px] border border-line bg-card px-4 py-2 text-sm text-ink-2 hover:text-ink disabled:opacity-50 transition-colors"
            >
              Save draft
            </button>
            <button
              type="submit"
              name="status"
              value="published"
              disabled={pending}
              className="rounded-[3px] bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent disabled:opacity-50 transition-colors"
            >
              {pending ? "Saving…" : story?.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        {(state?.error || notice) && (
          <p
            role="status"
            className={`mt-3 rounded-[3px] px-3 py-2 text-sm ${
              state?.error
                ? "border border-flag/30 bg-flag/10 text-flag"
                : "border border-line bg-card text-ink-2"
            }`}
          >
            {state?.error ?? notice}
          </p>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        {/* ---------------- Main column ---------------- */}
        <div className="min-w-0">
          <label htmlFor="title" className={label}>
            Headline
          </label>
          <textarea
            id="title"
            name="title"
            required
            rows={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write the headline…"
            className="mt-2 w-full resize-none rounded-[3px] border border-line bg-paper px-4 py-3 headline text-3xl leading-tight tracking-tight text-ink placeholder:text-ink-4 focus:border-accent focus:outline-none"
          />

          <label htmlFor="dek" className={`${label} mt-6`}>
            Standfirst
            <span className="ml-2 normal-case tracking-normal text-ink-4">
              one or two sentences under the headline
            </span>
          </label>
          <textarea
            id="dek"
            name="dek"
            rows={2}
            defaultValue={story?.dek ?? ""}
            placeholder="What the story is about, in a sentence."
            className={`${field} resize-none headline text-lg`}
          />

          {/* Body toolbar */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <span className={label}>Story</span>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className={toolbarBtn}
            >
              {showPreview ? "Write" : "Preview"}
            </button>
          </div>

          <div className="mt-2 rounded-[3px] border border-line bg-card">
            <div className="flex flex-wrap items-center gap-1.5 border-b border-line p-2">
              <button type="button" className={toolbarBtn} onClick={() => surround("## ", "", "Section heading")}>
                H2
              </button>
              <button type="button" className={toolbarBtn} onClick={() => surround("### ", "", "Subheading")}>
                H3
              </button>
              <button type="button" className={toolbarBtn} onClick={() => surround("**", "**", "bold")}>
                Bold
              </button>
              <button type="button" className={toolbarBtn} onClick={() => surround("*", "*", "italic")}>
                Italic
              </button>
              <button type="button" className={toolbarBtn} onClick={() => surround("[", "](https://)", "link text")}>
                Link
              </button>
              <button type="button" className={toolbarBtn} onClick={() => surround("> ", "", "Pull quote")}>
                Quote
              </button>
              <button type="button" className={toolbarBtn} onClick={() => surround("- ", "", "List item")}>
                List
              </button>
              <button type="button" className={toolbarBtn} onClick={() => insertAtCursor("\n\n---\n\n")}>
                Divider
              </button>

              <span className="mx-1 h-4 w-px bg-white/10" aria-hidden />

              <label className={`${toolbarBtn} cursor-pointer`}>
                Insert image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadImage(f, "inline");
                    e.target.value = "";
                  }}
                />
              </label>

              <label className="cursor-pointer rounded-[3px] border border-accent bg-card px-2.5 py-1 text-xs text-accent hover:bg-card transition-colors">
                Upload a document
                <input
                  type="file"
                  accept=".docx,.md,.markdown,.txt,.html,.htm"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void importDocument(f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {showPreview ? (
              <div
                className="article min-h-[28rem] p-6"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(body || "_Nothing to preview yet._", {
                    async: false,
                  }) as string,
                }}
              />
            ) : (
              <textarea
                id="body"
                name="body"
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onPaste={onPaste}
                required
                rows={26}
                placeholder={
                  "Write the story here.\n\nMarkdown works: **bold**, *italic*, ## headings, > quotes, - lists, [links](https://example.com).\n\nYou can also paste an image straight in, or upload a Word doc with the button above."
                }
                className="w-full resize-y bg-transparent p-6 font-mono text-[14px] leading-[1.75] text-ink placeholder:text-ink-4 focus:outline-none"
              />
            )}
          </div>
          <p className="mt-2 text-xs text-ink-3">
            {body.trim() ? body.trim().split(/\s+/).length.toLocaleString() : 0} words ·
            about {Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 220))} min
            read
          </p>
        </div>

        {/* ---------------- Sidebar ---------------- */}
        <aside className="space-y-7">
          {/* Cover */}
          <div className="rounded-[3px] border border-line bg-card p-5">
            <span className={label}>Cover image</span>
            <div className="mt-3">
              {coverUrl ? (
                <div className="relative overflow-hidden rounded-[3px] border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl} alt="" className="aspect-[16/10] w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverUrl("")}
                    className="absolute right-2 top-2 rounded-[3px] bg-card/85 px-2 py-1 text-xs text-ink-2 hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[3px] border border-dashed border-line bg-paper text-center transition-colors hover:border-accent">
                  <span className="text-sm text-ink-2">Choose an image</span>
                  <span className="text-xs text-ink-3">JPG, PNG or WebP · max 12 MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void uploadImage(f, "cover");
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
            <input
              name="cover_alt"
              defaultValue={story?.cover_alt ?? ""}
              placeholder="Caption / alt text"
              className={`${field} text-sm`}
            />
            <input
              name="cover_credit"
              defaultValue={story?.cover_credit ?? ""}
              placeholder="Credit"
              className={`${field} text-sm`}
            />
          </div>

          {/* Placement */}
          <div className="rounded-[3px] border border-line bg-card p-5">
            <span className={label}>Placement</span>

            <label htmlFor="section" className="mt-4 block text-xs text-ink-3">
              Section
            </label>
            <select
              id="section"
              name="section"
              defaultValue={story?.section ?? "news"}
              className={`${field} text-sm`}
            >
              {sections.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-2">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={story?.featured ?? false}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-paper accent-[#5b21b6]"
              />
              <span>
                Lead story
                <span className="block text-xs text-ink-3">
                  Pins it to the top of the front page.
                </span>
              </span>
            </label>

            <label htmlFor="tags" className="mt-4 block text-xs text-ink-3">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              defaultValue={story?.tags.join(", ") ?? ""}
              placeholder="product, research"
              className={`${field} text-sm`}
            />
          </div>

          {/* Byline */}
          <div className="rounded-[3px] border border-line bg-card p-5">
            <span className={label}>Byline</span>
            <input
              name="author"
              defaultValue={story?.author ?? ""}
              placeholder="Author name"
              className={`${field} text-sm`}
            />
            <input
              name="author_title"
              defaultValue={story?.author_title ?? ""}
              placeholder="Role or title"
              className={`${field} text-sm`}
            />
          </div>

          {/* Publishing */}
          <div className="rounded-[3px] border border-line bg-card p-5">
            <span className={label}>Publishing</span>

            <label htmlFor="published_at" className="mt-4 block text-xs text-ink-3">
              Publish date &amp; time
            </label>
            <input
              id="published_at"
              name="published_at"
              type="datetime-local"
              defaultValue={toLocalInput(story?.published_at)}
              className={`${field} text-sm [color-scheme:dark]`}
            />
            <p className="mt-1.5 text-xs text-ink-3">
              Leave blank to stamp it now. A future time schedules the story.
            </p>

            <label htmlFor="slug" className="mt-4 block text-xs text-ink-3">
              URL slug
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={story?.slug ?? ""}
              placeholder="auto from headline"
              className={`${field} font-mono text-xs`}
            />
          </div>

          {story && (
            <div className="rounded-[3px] border border-flag/20 bg-flag/5 p-5">
              <span className={label}>Danger zone</span>
              <p className="mt-2 text-xs text-ink-3">
                Deleting removes the story and its URL permanently.
              </p>
              {confirmDelete ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-flag">
                    This can&apos;t be undone. Delete “{story.title}”?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      formAction={deleteStoryAction}
                      formNoValidate
                      className="flex-1 rounded-[3px] bg-flag px-4 py-2 text-sm font-medium text-paper hover:bg-flag/90 transition-colors"
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="rounded-[3px] border border-line px-4 py-2 text-sm text-ink-2 hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="mt-3 w-full rounded-[3px] border border-flag/40 px-4 py-2 text-sm text-flag hover:bg-flag/10 transition-colors"
                >
                  Delete this story
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </form>
  );
}
