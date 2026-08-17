import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { StoryCard, StoryRow } from "@/components/StoryCard";
import { getBySection, getSection } from "@/lib/stories";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = await getSection(slug).catch(() => null);
  if (!section) return { title: "Section not found", robots: { index: false } };
  return {
    title: section.name,
    description: section.blurb,
    alternates: { canonical: absoluteUrl(`/section/${section.slug}`) },
  };
}

export default async function SectionPage({ params }: Props) {
  const { slug } = await params;
  const section = await getSection(slug).catch(() => null);
  if (!section) notFound();

  const stories = await getBySection(slug, 60).catch(() => []);
  const [lead, ...rest] = stories;
  const grid = rest.slice(0, 3);
  const list = rest.slice(3);

  return (
    <>
      <Masthead compact />
      <main className="mx-auto max-w-[1180px] px-5 pb-20">
        <header className="rule-top mt-8 pt-5">
          <p className="kicker">Section</p>
          <h1 className="headline mt-2 text-[2.6rem] leading-none sm:text-[3.4rem]">
            {section.name}
          </h1>
          {section.blurb && (
            <p className="mt-3 max-w-xl font-display text-[1.15rem] leading-relaxed text-ink-2">
              {section.blurb}
            </p>
          )}
          <p className="meta mt-4 border-t border-line pt-3">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
          </p>
        </header>

        {stories.length === 0 ? (
          <p className="py-24 text-center font-display text-lg text-ink-2">
            Nothing published in {section.name} yet.
          </p>
        ) : (
          <>
            <div className="mt-10">
              <StoryCard story={lead} size="lg" />
            </div>

            {grid.length > 0 && (
              <div className="col-rule mt-14 grid gap-y-9 md:grid-cols-3">
                {grid.map((s, i) => (
                  <div key={s.id} className={i > 0 ? "md:pl-7" : "md:pr-7"}>
                    <StoryCard story={s} />
                  </div>
                ))}
              </div>
            )}

            {list.length > 0 && (
              <div className="mt-14">
                <div className="rule-top pt-3">
                  <h2 className="headline text-[1.35rem] leading-none">
                    More in {section.name}
                  </h2>
                </div>
                <div className="mt-2">
                  {list.map((s) => (
                    <StoryRow key={s.id} story={s} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
