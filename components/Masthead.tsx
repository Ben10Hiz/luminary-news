import Link from "next/link";
import { site } from "@/lib/site";

export default function Masthead({ compact = false }: { compact?: boolean }) {
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
          <a
            href={site.parentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="meta hover:text-ink transition-colors"
          >
            The Luminary Network
          </a>
        </div>
      </div>

      {/* Wordmark */}
      <div className="mx-auto max-w-[1180px] px-5">
        <div className={compact ? "py-5 text-center" : "py-9 text-center sm:py-12"}>
          <Link href="/" className="inline-block">
            <h1
              className={`headline leading-none tracking-[-0.035em] ${
                compact ? "text-[1.9rem]" : "text-[3rem] sm:text-[5rem]"
              }`}
            >
              News
            </h1>
          </Link>
          {!compact && (
            <p className="meta mx-auto mt-3.5 max-w-md text-[10px] uppercase tracking-[0.22em]">
              {site.tagline}
            </p>
          )}
        </div>
      </div>

      <div className="rule-top" />
    </header>
  );
}
