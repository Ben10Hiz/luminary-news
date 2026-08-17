import Link from "next/link";
import { getAllForAdmin } from "@/lib/stories";
import { formatShortDate } from "@/lib/site";
import { excerpt } from "@/lib/markdown";

export const dynamic = "force-dynamic";

function StatusPill({ status, featured }: { status: string; featured: boolean }) {
  const published = status === "published";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
          published
            ? "bg-card text-accent ring-accent/30"
            : "bg-paper-3 text-ink-3 ring-white/10"
        }`}
      >
        {published ? "Live" : "Draft"}
      </span>
      {featured && (
        <span className="rounded-full bg-flag/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-flag ring-1 ring-inset ring-flag/30">
          Lead
        </span>
      )}
    </span>
  );
}

export default async function AdminDesk({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;

  let stories: Awaited<ReturnType<typeof getAllForAdmin>> = [];
  let error: string | null = null;
  try {
    stories = await getAllForAdmin();
  } catch (err) {
    error = err instanceof Error ? err.message : "Database unavailable";
  }

  const live = stories.filter((s) => s.status === "published").length;
  const drafts = stories.length - live;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-3xl tracking-tight text-ink">
            The desk
          </h1>
          <p className="mt-1.5 text-sm text-ink-2">
            {live} live · {drafts} {drafts === 1 ? "draft" : "drafts"}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent transition-colors"
        >
          + New story
        </Link>
      </div>

      {deleted && (
        <p className="mt-6 rounded-[3px] border border-line bg-card px-4 py-2.5 text-sm text-ink-2">
          Story deleted.
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-[3px] border border-flag/30 bg-flag/5 p-5">
          <p className="text-sm text-ink">Can&apos;t reach the story database.</p>
          <p className="mt-2 font-mono text-xs text-ink-3">{error}</p>
        </div>
      )}

      {!error && stories.length === 0 && (
        <div className="mt-10 rounded-[3px] border border-dashed border-line bg-card p-14 text-center">
          <h2 className="headline text-2xl text-ink">Nothing filed yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-2">
            Write your first story here, or upload a Word doc, Markdown file or
            plain text and we&apos;ll turn it into a draft.
          </p>
          <Link
            href="/admin/new"
            className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent transition-colors"
          >
            Start a story
          </Link>
        </div>
      )}

      {stories.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-[3px] border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-card text-[11px] uppercase tracking-wider text-ink-3">
              <tr>
                <th className="px-5 py-3 font-semibold">Story</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">
                  Section
                </th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                  Status
                </th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-line align-top transition-colors hover:bg-card"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/stories/${s.id}`}
                      className="headline text-[17px] leading-snug text-ink hover:text-accent transition-colors"
                    >
                      {s.title}
                    </Link>
                    <p className="mt-1 max-w-xl text-xs leading-relaxed text-ink-3 line-clamp-2">
                      {excerpt(s, 130)}
                    </p>
                    <div className="mt-2 flex items-center gap-3 sm:hidden">
                      <StatusPill status={s.status} featured={s.featured} />
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 text-ink-2 md:table-cell">
                    {s.section}
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell">
                    <StatusPill status={s.status} featured={s.featured} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-3">
                    {formatShortDate(s.published_at ?? s.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
