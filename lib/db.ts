import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __lumeSql: ReturnType<typeof postgres> | undefined;
  // eslint-disable-next-line no-var
  var __lumeReady: Promise<void> | undefined;
}

function connectionString() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error(
      "No database connection string. Set DATABASE_URL (or POSTGRES_URL) in your environment."
    );
  }
  return url;
}

function client() {
  if (!global.__lumeSql) {
    const url = connectionString();
    global.__lumeSql = postgres(url, {
      ssl: url.includes("localhost") ? false : "require",
      max: 5,
      idle_timeout: 20,
      connect_timeout: 15,
    });
  }
  return global.__lumeSql;
}

/**
 * Lazy client. The connection is not opened — and DATABASE_URL is not even
 * read — until the first query actually runs.
 *
 * This matters at build time: `next build` imports every route module to
 * collect page data, and the build machine has no database. Connecting at
 * module scope would fail the build outright instead of letting each page
 * catch the error and render its "newsroom offline" state at runtime.
 */
export const sql = new Proxy(function () {} as unknown as ReturnType<typeof postgres>, {
  apply(_target, _thisArg, args: unknown[]) {
    return (client() as unknown as (...a: unknown[]) => unknown)(...args);
  },
  get(_target, prop: string | symbol) {
    const value = (client() as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client()) : value;
  },
}) as ReturnType<typeof postgres>;

/**
 * Creates the schema on first use. Safe to call on every request — the work
 * happens once per process and every statement is IF NOT EXISTS.
 */
export function ensureSchema() {
  if (!global.__lumeReady) {
    global.__lumeReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS stories (
          id            SERIAL PRIMARY KEY,
          slug          TEXT NOT NULL UNIQUE,
          title         TEXT NOT NULL,
          dek           TEXT NOT NULL DEFAULT '',
          body          TEXT NOT NULL DEFAULT '',
          cover_url     TEXT,
          cover_alt     TEXT NOT NULL DEFAULT '',
          cover_credit  TEXT NOT NULL DEFAULT '',
          section       TEXT NOT NULL DEFAULT 'news',
          tags          TEXT[] NOT NULL DEFAULT '{}',
          author        TEXT NOT NULL DEFAULT 'The Luminary Network',
          author_title  TEXT NOT NULL DEFAULT '',
          status        TEXT NOT NULL DEFAULT 'draft',
          featured      BOOLEAN NOT NULL DEFAULT FALSE,
          published_at  TIMESTAMPTZ,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`;
      await sql`CREATE INDEX IF NOT EXISTS stories_published_idx ON stories (status, published_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS stories_section_idx ON stories (section)`;
      await sql`
        CREATE TABLE IF NOT EXISTS sections (
          slug        TEXT PRIMARY KEY,
          name        TEXT NOT NULL,
          blurb       TEXT NOT NULL DEFAULT '',
          sort_order  INT NOT NULL DEFAULT 100
        )`;
      const existing = await sql<{ n: number }[]>`SELECT COUNT(*)::int AS n FROM sections`;
      if (existing[0].n === 0) {
        await sql`
          INSERT INTO sections (slug, name, blurb, sort_order) VALUES
            ('news',        'News',        'What happened, and what it means.',        10),
            ('features',    'Features',    'Longer looks at the stories behind the story.', 20),
            ('research',    'Research',    'Findings, data and analysis from our work.',    30),
            ('announcements','Announcements','Product releases and network updates.',       40),
            ('voices',      'Voices',      'Perspective and opinion from our people.',      50)
          ON CONFLICT (slug) DO NOTHING`;
      }
    })().catch((err) => {
      global.__lumeReady = undefined;
      throw err;
    });
  }
  return global.__lumeReady;
}
