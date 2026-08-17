import slugify from "slugify";
import { sql, ensureSchema } from "./db";

export type Story = {
  id: number;
  slug: string;
  title: string;
  dek: string;
  body: string;
  cover_url: string | null;
  cover_alt: string;
  cover_credit: string;
  section: string;
  tags: string[];
  author: string;
  author_title: string;
  status: "draft" | "published";
  featured: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type Section = {
  slug: string;
  name: string;
  blurb: string;
  sort_order: number;
};

export async function getSections(): Promise<Section[]> {
  await ensureSchema();
  return sql<Section[]>`SELECT * FROM sections ORDER BY sort_order, name`;
}

/**
 * Sections that actually have something published in them. The masthead and
 * footer use this so navigation never points at an empty page.
 */
export async function getLiveSections(): Promise<Section[]> {
  await ensureSchema();
  return sql<Section[]>`
    SELECT s.*
    FROM sections s
    WHERE EXISTS (
      SELECT 1 FROM stories st
      WHERE st.section = s.slug
        AND st.status = 'published'
        AND st.published_at <= NOW()
    )
    ORDER BY s.sort_order, s.name`;
}

export async function getSection(slug: string): Promise<Section | null> {
  await ensureSchema();
  const rows = await sql<Section[]>`SELECT * FROM sections WHERE slug = ${slug}`;
  return rows[0] ?? null;
}

/** Published stories, newest first. */
export async function getPublished(limit = 24, offset = 0): Promise<Story[]> {
  await ensureSchema();
  return sql<Story[]>`
    SELECT * FROM stories
    WHERE status = 'published' AND published_at <= NOW()
    ORDER BY published_at DESC, id DESC
    LIMIT ${limit} OFFSET ${offset}`;
}

export async function countPublished(): Promise<number> {
  await ensureSchema();
  const r = await sql<{ n: number }[]>`
    SELECT COUNT(*)::int AS n FROM stories
    WHERE status = 'published' AND published_at <= NOW()`;
  return r[0].n;
}

export async function getLead(): Promise<Story | null> {
  await ensureSchema();
  const rows = await sql<Story[]>`
    SELECT * FROM stories
    WHERE status = 'published' AND published_at <= NOW()
    ORDER BY featured DESC, published_at DESC, id DESC
    LIMIT 1`;
  return rows[0] ?? null;
}

export async function getBySection(section: string, limit = 30): Promise<Story[]> {
  await ensureSchema();
  return sql<Story[]>`
    SELECT * FROM stories
    WHERE status = 'published' AND published_at <= NOW() AND section = ${section}
    ORDER BY published_at DESC, id DESC
    LIMIT ${limit}`;
}

export async function getByTag(tag: string, limit = 30): Promise<Story[]> {
  await ensureSchema();
  return sql<Story[]>`
    SELECT * FROM stories
    WHERE status = 'published' AND published_at <= NOW() AND ${tag} = ANY(tags)
    ORDER BY published_at DESC, id DESC
    LIMIT ${limit}`;
}

export async function search(q: string, limit = 40): Promise<Story[]> {
  await ensureSchema();
  const term = `%${q}%`;
  return sql<Story[]>`
    SELECT * FROM stories
    WHERE status = 'published' AND published_at <= NOW()
      AND (title ILIKE ${term} OR dek ILIKE ${term} OR body ILIKE ${term})
    ORDER BY published_at DESC, id DESC
    LIMIT ${limit}`;
}

export async function getBySlug(slug: string): Promise<Story | null> {
  await ensureSchema();
  const rows = await sql<Story[]>`SELECT * FROM stories WHERE slug = ${slug}`;
  return rows[0] ?? null;
}

/**
 * A story is publicly readable only once it is both published AND past its
 * publish time — otherwise a scheduled story would be reachable by URL
 * before its embargo lifts.
 */
export function isPubliclyVisible(story: Story | null): story is Story {
  if (!story) return false;
  if (story.status !== "published") return false;
  if (!story.published_at) return false;
  return new Date(story.published_at).getTime() <= Date.now();
}

export async function getById(id: number): Promise<Story | null> {
  await ensureSchema();
  const rows = await sql<Story[]>`SELECT * FROM stories WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function getRelated(story: Story, limit = 3): Promise<Story[]> {
  await ensureSchema();
  return sql<Story[]>`
    SELECT * FROM stories
    WHERE status = 'published' AND published_at <= NOW()
      AND id <> ${story.id}
    ORDER BY (section = ${story.section}) DESC, published_at DESC
    LIMIT ${limit}`;
}

/** Every story, any status — for the admin desk. */
export async function getAllForAdmin(): Promise<Story[]> {
  await ensureSchema();
  return sql<Story[]>`
    SELECT * FROM stories
    ORDER BY COALESCE(published_at, updated_at) DESC, id DESC`;
}

export async function uniqueSlug(title: string, ignoreId?: number): Promise<string> {
  await ensureSchema();
  const base =
    slugify(title, { lower: true, strict: true, trim: true }).slice(0, 70) || "story";
  let candidate = base;
  for (let n = 2; n < 200; n++) {
    const rows = ignoreId
      ? await sql<{ id: number }[]>`SELECT id FROM stories WHERE slug = ${candidate} AND id <> ${ignoreId}`
      : await sql<{ id: number }[]>`SELECT id FROM stories WHERE slug = ${candidate}`;
    if (rows.length === 0) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

export type StoryInput = {
  title: string;
  dek: string;
  body: string;
  cover_url: string | null;
  cover_alt: string;
  cover_credit: string;
  section: string;
  tags: string[];
  author: string;
  author_title: string;
  status: "draft" | "published";
  featured: boolean;
  published_at: Date | null;
  slug?: string;
};

export async function createStory(input: StoryInput): Promise<Story> {
  await ensureSchema();
  const slug = input.slug?.trim()
    ? await uniqueSlug(input.slug)
    : await uniqueSlug(input.title);
  const rows = await sql<Story[]>`
    INSERT INTO stories
      (slug, title, dek, body, cover_url, cover_alt, cover_credit, section,
       tags, author, author_title, status, featured, published_at)
    VALUES
      (${slug}, ${input.title}, ${input.dek}, ${input.body}, ${input.cover_url},
       ${input.cover_alt}, ${input.cover_credit}, ${input.section},
       ${input.tags as unknown as string[]}, ${input.author}, ${input.author_title},
       ${input.status}, ${input.featured},
       ${input.status === "published" ? input.published_at ?? new Date() : input.published_at})
    RETURNING *`;
  return rows[0];
}

export async function updateStory(id: number, input: StoryInput): Promise<Story> {
  await ensureSchema();
  const current = await getById(id);
  const slug = input.slug?.trim()
    ? await uniqueSlug(input.slug, id)
    : current?.slug ?? (await uniqueSlug(input.title, id));
  const publishedAt =
    input.published_at ??
    (input.status === "published" ? current?.published_at ?? new Date() : null);
  const rows = await sql<Story[]>`
    UPDATE stories SET
      slug = ${slug},
      title = ${input.title},
      dek = ${input.dek},
      body = ${input.body},
      cover_url = ${input.cover_url},
      cover_alt = ${input.cover_alt},
      cover_credit = ${input.cover_credit},
      section = ${input.section},
      tags = ${input.tags as unknown as string[]},
      author = ${input.author},
      author_title = ${input.author_title},
      status = ${input.status},
      featured = ${input.featured},
      published_at = ${publishedAt},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *`;
  return rows[0];
}

export async function deleteStory(id: number): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM stories WHERE id = ${id}`;
}

/** Only one story can hold the featured slot at a time. */
export async function clearOtherFeatured(id: number): Promise<void> {
  await ensureSchema();
  await sql`UPDATE stories SET featured = FALSE WHERE id <> ${id}`;
}
