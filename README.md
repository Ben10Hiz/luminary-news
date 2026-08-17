# Luminary News

The newsroom for The Luminary Network — `news.theluminary.network`.

A Next.js news site with a built-in editor. You sign in at `/admin`, write or
upload a story, hit publish, and it is live. No CMS account, no git push, no
deploy step between writing and publishing.

## What it does

**Public site**

- Front page with a pinned lead story, a row of recent cards, and a rail per section
- Story pages with standfirst, byline, cover image, drop cap, share links and related stories
- Section pages, tag pages, and full-text search
- RSS feed at `/feed.xml`, `sitemap.xml`, `robots.txt`
- Open Graph + Twitter cards and `NewsArticle` structured data on every story
- Dark editorial design, self-hosted fonts, no third-party requests

**Newsroom (`/admin`)**

- Password sign-in, session held in a signed HTTP-only cookie
- Write in Markdown with a formatting toolbar and live preview
- **Upload a document** — `.docx`, `.md`, `.txt` or `.html` becomes a draft, with the
  headline lifted off the top and formatting converted to Markdown
- Drag, paste or pick images; they go to Vercel Blob and drop into the body
- Cover image with caption and credit
- Draft / publish / schedule, lead-story pin, sections, tags, byline, custom slug
- Delete with a confirmation step

Drafts and scheduled stories are invisible to the public — no URL, no front page,
no feed — until their publish time passes.

## Running it locally

You need Node 20+ and a Postgres database.

```bash
npm install
cp .env.example .env.local     # then fill it in
npm run dev
```

`.env.local` needs:

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Random string, 32+ chars. `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | The password your editors type at `/admin` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, used by RSS/sitemap/social cards |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token. Optional locally — without it, images are written to `.data/uploads` and served from `/media` |

The database schema creates itself on first run. There is no migration step.

Optional sample content, so you can see the design with stories in it:

```bash
npm run seed
```

Delete those from `/admin` before you publish for real — they are placeholders.

## Deploying

1. Push to GitHub, import the repo into Vercel.
2. Add a Postgres database (Neon works) from the Vercel **Storage** tab and
   connect it to the project. That sets `DATABASE_URL` automatically.
3. Add a **Blob** store from the same tab. That sets `BLOB_READ_WRITE_TOKEN`.
   Without it, image uploads fail in production — Vercel's filesystem is read-only.
4. Set `AUTH_SECRET`, `ADMIN_PASSWORD` and `NEXT_PUBLIC_SITE_URL` as environment
   variables.
5. Add `news.theluminary.network` as a domain on the project and create the DNS
   record Vercel asks for.

## Verifying

```bash
npm run build && npm run start          # in one shell
node scripts/verify.mjs                 # in another
```

Drives a real browser through the public site, the sign-in gate, a `.docx`
upload, an image upload, publish, delete, and the draft/embargo privacy checks.
Screenshots land in `/home/claude/shots`, failures print with a `!!` prefix.

## Layout

```
app/
  page.tsx                 front page
  story/[slug]/            story pages
  section/[slug]/          section pages
  tag/[tag]/               tag pages
  search/                  search
  feed.xml/                RSS
  media/[file]/            serves locally-uploaded images (dev fallback)
  api/upload/              image uploads -> Vercel Blob
  api/import/              .docx / .md / .txt / .html -> Markdown
  admin/                   the newsroom
lib/
  db.ts                    connection + self-creating schema
  stories.ts               every query
  auth.ts                  password check + signed session
  markdown.ts              Markdown -> sanitized HTML
  upload.ts                Blob with local fallback
proxy.ts                   gates /admin
```

## Notes

- Story bodies are rendered from Markdown and sanitized server-side on every
  request, so pasted Word/Google Docs HTML is safe to store.
- Only one story holds the lead slot; pinning a new one clears the last.
- Sessions last 7 days. Changing `AUTH_SECRET` signs everyone out.
