import Link from "next/link";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import {
  LeadStory,
  StoryCard,
  StoryListItem,
  StoryRow,
} from "@/components/StoryCard";
import { getLead, getPublished, getSections } from "@/lib/stories";
import type { Story } from "@/lib/stories";

export const dynamic = "force-dynamic";

function SectionHead({
  title,
  href,
  note,
}: {
  title: string;
  href?: string;
  note?: string;
}) {
  return (
    <div className="rule-top flex items-baseline justify-between gap-4 pt-3">
      <h2 className="headline text-[1.35rem] leading-none">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="meta uppercase tracking-[0.11em] hover:text-accent transition-colors"
        >
          All {title} →
        </Link>
      ) : (
        note && <span className="meta uppercase tracking-[0.11em]">{note}</span>
      )}
    </div>
  );
}

function EmptyNewsroom() {
  return (
    <div className="mx-auto max-w-lg py-24 text-center">
      <p className="kicker">The presses are warm</p>
      <h2 className="headline mt-4 text-4xl leading-tight">
        No stories published yet.
      </h2>
      <p className="mt-4 font-display text-lg leading-relaxed text-ink-2">
        The front page fills itself the moment you publish your first story.
      </p>
      <Link
        href="/admin"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-paper hover:bg-accent transition-colors"
      >
        Open the newsroom
      </Link>
    </div>
  );
}

export default async function Home() {
  let lead: Story | null = null;
  let stories: Story[] = [];
  let sections: { slug: string; name: string; blurb: string }[] = [];
  let dbError: string | null = null;

  try {
    [lead, stories, sections] = await Promise.all([
      getLead(),
      getPublished(60),
      getSections(),
    ]);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database unavailable";
  }

  const rest = stories.filter((s) => s.id !== lead?.id);

  // Front page shape: lead + a three-up row, a wide "more" column beside the
  // latest list, then one rail per section for everything that's left.
  const topRow = rest.slice(0, 3);
  const feature = rest[3];
  const latestList = rest.slice(4, 9);
  const railPool = rest.slice(4);

  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-[1180px] px-5 pb-20">
        {dbError ? (
          <div className="mx-auto max-w-lg py-24 text-center">
            <p className="kicker text-flag">Newsroom offline</p>
            <h2 className="headline mt-4 text-3xl">
              The story database isn&apos;t reachable.
            </h2>
            <p className="mt-3 font-mono text-xs text-ink-3">{dbError}</p>
          </div>
        ) : !lead ? (
          <EmptyNewsroom />
        ) : (
          <>
            <div className="py-10 sm:py-14">
              <LeadStory story={lead} />
            </div>

            {topRow.length > 0 && (
              <section>
                <SectionHead title="Latest" note="Updated continuously" />
                <div className="col-rule mt-7 grid gap-y-9 md:grid-cols-3">
                  {topRow.map((s, i) => (
                    <div key={s.id} className={i > 0 ? "md:pl-7" : "md:pr-7"}>
                      <StoryCard story={s} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(feature || latestList.length > 0) && (
              <section className="mt-14">
                <div
                  className={`grid gap-10 ${
                    latestList.length > 0 ? "lg:grid-cols-[1fr_20rem]" : ""
                  }`}
                >
                  {feature && (
                    <div>
                      <SectionHead title="In depth" />
                      <div className="mt-7">
                        <StoryCard story={feature} size="lg" />
                      </div>
                    </div>
                  )}

                  {latestList.length > 0 && (
                    <aside className="lg:border-l lg:border-line lg:pl-9">
                      <SectionHead title="More stories" />
                      <div className="mt-5">
                        {latestList.map((s, i) => (
                          <StoryListItem key={s.id} story={s} index={i} />
                        ))}
                      </div>
                    </aside>
                  )}
                </div>
              </section>
            )}

            {sections.map((section) => {
              const items = railPool.filter(
                (s) => s.section === section.slug && s.id !== feature?.id
              );
              if (items.length === 0) return null;
              return (
                <section key={section.slug} className="mt-14">
                  <SectionHead
                    title={section.name}
                    href={`/section/${section.slug}`}
                  />
                  <div className="mt-2">
                    {items.slice(0, 4).map((s) => (
                      <StoryRow key={s.id} story={s} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
