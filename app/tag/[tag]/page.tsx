import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { StoryRow } from "@/components/StoryCard";
import { getByTag } from "@/lib/stories";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return { title: `${decoded} — Topic`, description: `Stories tagged ${decoded}.` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const stories = await getByTag(decoded, 60).catch(() => []);

  return (
    <>
      <Masthead compact />
      <main className="mx-auto max-w-[1180px] px-5 pb-20">
        <header className="rule-top mt-8 pt-5">
          <p className="kicker">Topic</p>
          <h1 className="headline mt-2 text-[2.6rem] leading-none sm:text-[3.4rem]">
            {decoded}
          </h1>
          <p className="meta mt-4 border-t border-line pt-3">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
          </p>
        </header>

        {stories.length === 0 ? (
          <p className="py-24 text-center font-display text-lg text-ink-2">
            No stories tagged “{decoded}” yet.
          </p>
        ) : (
          <div className="mt-4">
            {stories.map((s) => (
              <StoryRow key={s.id} story={s} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
