import Link from "next/link";
import { getLiveSections } from "@/lib/stories";
import { site } from "@/lib/site";
import SearchToggle from "./SearchToggle";

export default async function Masthead({ compact = false }: { compact?: boolean }) {
  let sections: { slug: string; name: string }[] = [];
  try {
    sections = await getLiveSections();
  } catch {
    sections = [];
  }

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Indianapolis",
  }).format(new Date());

  return (
    <header className="bg-paper">
      {/* Utility line */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-2.5">
          <p className="meta hidden sm:block">{today}</p>
          <div className="flex items-center gap-5">
            <a
              href={site.parentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="meta hover:text-ink transition-colors"
            >
              The Luminary Network
            </a>
            <Link href="/feed.xml" className="meta hover:text-ink transition-colors">
              RSS
            </Link>
            <SearchToggle />
          </div>
        </div>
      </div>

      {/* Wordmark */}
      <div className="mx-auto max-w-[1180px] px-5">
        <div className={compact ? "py-5 text-center" : "py-9 text-center sm:py-12"}>
          <Link href="/" className="inline-block group">
            <h1
              className={`headline leading-none tracking-[-0.035em] ${
                compact ? "text-[1.9rem]" : "text-[3rem] sm:text-[5rem]"
              }`}
            >
              News
            </h1>
          </Link>
          {!compact && (
            <p className="meta mx-auto mt-3.5 max-w-md uppercase tracking-[0.22em] text-[10px]">
              {site.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Section nav — heavy rule above, hairline below, the classic sandwich */}
      <nav aria-label="Sections" className="rule-top border-b border-line">
        <div className="mx-auto max-w-[1180px] px-5">
          <ul className="flex items-center justify-start gap-0 overflow-x-auto sm:justify-center">
            <li>
              <Link
                href="/"
                className="block whitespace-nowrap px-3.5 py-3 text-[12.5px] font-semibold uppercase tracking-[0.09em] text-ink hover:text-accent transition-colors"
              >
                Latest
              </Link>
            </li>
            {sections.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/section/${s.slug}`}
                  className="block whitespace-nowrap px-3.5 py-3 text-[12.5px] font-semibold uppercase tracking-[0.09em] text-ink-2 hover:text-flag transition-colors"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
