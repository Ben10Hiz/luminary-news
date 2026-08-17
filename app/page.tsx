import Link from "next/link";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { allStories } from "@/content/stories";
import { excerpt, readingMinutes } from "@/lib/markdown";
import { formatShortDate, isoDate } from "@/lib/site";

export default function Home() {
  const [lead, ...rest] = allStories();

  if (!lead) {
    return (
      <>
        <Masthead />
        <main className="mx-auto max-w-lg px-5 py-28 text-center">
          <p className="kicker">The presses are warm</p>
          <h2 className="headline mt-4 text-4xl leading-tight">
            No stories published yet.
          </h2>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-[1180px] px-5 pb-24">
        {/* Lead */}
        <article className="mx-auto max-w-3xl pt-12 text-center sm:pt-16">
          <p className="kicker">{lead.kicker}</p>

          <h2 className="headline mt-4 text-[2.2rem] leading-[1.05] sm:text-[3.6rem]">
            <Link
              href={`/story/${lead.slug}`}
              className="hover:text-accent transition-colors"
            >
              {lead.title}
            </Link>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-display text-[1.2rem] leading-relaxed text-ink-2">
            {lead.dek}
          </p>

          <p className="meta mt-5">
            {lead.author}
            <span className="px-1.5 text-ink-4">·</span>
            <time dateTime={isoDate(lead.publishedAt)}>
              {formatShortDate(lead.publishedAt)}
            </time>
            <span className="px-1.5 text-ink-4">·</span>
            {readingMinutes(lead.body)} min read
          </p>

          <Link
            href={`/story/${lead.slug}`}
            className="mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-paper hover:bg-accent transition-colors"
          >
            Read the story
          </Link>
        </article>

        {/* Everything else */}
        {rest.length > 0 && (
          <section className="mx-auto mt-20 max-w-3xl">
            <div className="rule-top pt-3">
              <h2 className="headline text-[1.35rem] leading-none">More stories</h2>
            </div>
            <div className="mt-2">
              {rest.map((s) => (
                <article
                  key={s.slug}
                  className="border-b border-line py-7 last:border-b-0"
                >
                  <p className="kicker">{s.kicker}</p>
                  <h3 className="headline mt-2 text-[1.55rem] leading-[1.15]">
                    <Link
                      href={`/story/${s.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-2.5 font-display text-[1.0625rem] leading-snug text-ink-2 line-clamp-3">
                    {excerpt({ dek: s.dek, body: s.body }, 200)}
                  </p>
                  <p className="meta mt-3">
                    {s.author}
                    <span className="px-1.5 text-ink-4">·</span>
                    <time dateTime={isoDate(s.publishedAt)}>
                      {formatShortDate(s.publishedAt)}
                    </time>
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
