"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createStory,
  updateStory,
  deleteStory,
  clearOtherFeatured,
  type StoryInput,
} from "@/lib/stories";
import { createSession, destroySession, passwordMatches } from "@/lib/auth";

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || "Editor";
  const next = String(formData.get("next") ?? "/admin");

  if (!password) return { error: "Enter the newsroom password." };

  try {
    if (!passwordMatches(password)) {
      await new Promise((r) => setTimeout(r, 600));
      return { error: "That password isn't right." };
    }
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Login is not configured on this server.",
    };
  }

  await createSession(name);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

function parseForm(formData: FormData): StoryInput {
  const status = formData.get("status") === "published" ? "published" : "draft";
  const publishedRaw = String(formData.get("published_at") ?? "").trim();

  return {
    title: String(formData.get("title") ?? "").trim(),
    dek: String(formData.get("dek") ?? "").trim(),
    body: String(formData.get("body") ?? ""),
    cover_url: String(formData.get("cover_url") ?? "").trim() || null,
    cover_alt: String(formData.get("cover_alt") ?? "").trim(),
    cover_credit: String(formData.get("cover_credit") ?? "").trim(),
    section: String(formData.get("section") ?? "news").trim() || "news",
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 12),
    author: String(formData.get("author") ?? "").trim() || "The Luminary Network",
    author_title: String(formData.get("author_title") ?? "").trim(),
    status,
    featured: formData.get("featured") === "on",
    published_at: publishedRaw ? new Date(publishedRaw) : null,
    slug: String(formData.get("slug") ?? "").trim() || undefined,
  };
}

export async function saveStoryAction(_prev: unknown, formData: FormData) {
  const idRaw = String(formData.get("id") ?? "").trim();
  const input = parseForm(formData);

  if (!input.title) return { error: "A story needs a headline." };
  if (!input.body.trim()) return { error: "A story needs a body." };

  let story;
  try {
    story = idRaw
      ? await updateStory(Number(idRaw), input)
      : await createStory(input);
    if (story.featured) await clearOtherFeatured(story.id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save the story." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/story/${story.slug}`);
  revalidatePath(`/section/${story.section}`);
  redirect(`/admin/stories/${story.id}?saved=1`);
}

export async function deleteStoryAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (Number.isFinite(id)) {
    await deleteStory(id);
    revalidatePath("/");
    revalidatePath("/admin");
  }
  redirect("/admin?deleted=1");
}
