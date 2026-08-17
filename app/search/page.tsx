import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { StoryRow } from "@/components/StoryCard";
import { search } from "@/lib/stories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await search(query).catch(() => []) : [];

  return (
    <>
      <Masthead compact />
      <main className="mx-auto max-w-[52rem] px-5 pb-20">
        <header className="rule-top mt-8 pt-5">
          <p className="kicker">Search</p>
          <form action="/search" className="mt-3">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <input
                name="q"
                type="search"
                defaultValue={query}
                autoFocus
                placeholder="Search every story…"
                className="headline w-full border-0 bg-transparent text-[2rem] leading-tight text-ink placeholder:text-ink-4 focus:outline-none sm:text-[2.6rem]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-paper hover:bg-accent transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </header>

        {query && (
          <p className="meta mt-5">
            {results.length} {results.length === 1 ? "result" : "results"} for “
            <span className="text-ink">{query}</span>”
          </p>
        )}

        <div className="mt-3">
          {results.map((s) => (
            <StoryRow key={s.id} story={s} />
          ))}
        </div>

        {query && results.length === 0 && (
          <p className="py-20 text-center font-display text-lg text-ink-2">
            Nothing matched. Try a shorter or more general term.
          </p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
