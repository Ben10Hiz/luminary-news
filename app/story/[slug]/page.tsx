import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { allStoryPaths, getStory } from "@/content/stories";
import { renderBody, excerpt, readingMinutes } from "@/lib/markdown";
import { formatDate, isoDate, absoluteUrl, site } from "@/lib/site";
import Highlights from "@/components/Highlights";
import StoryDock from "@/components/StoryDock";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allStoryPaths().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "Story not found", robots: { index: false } };

  const url = absoluteUrl(`/story/${story.slug}`);
  const description = excerpt({ dek: story.dek, body: story.body }, 200);
  return {
    title: story.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: story.title,
      description,
      publishedTime: isoDate(story.publishedAt),
      authors: [story.author],
    },
    twitter: { card: "summary_large_image", title: story.title, description },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const html = renderBody(story.body);
  const url = absoluteUrl(`/story/${story.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.title,
    description: excerpt({ dek: story.dek, body: story.body }, 200),
    datePublished: isoDate(story.publishedAt),
    author: [{ "@type": "Organization", name: story.author }],
    publisher: { "@type": "Organization", name: site.newsroom },
    mainEntityOfPage: url,
  };

  return (
    <>
      <Masthead compact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-[1180px] px-5">
        <article>
          <header className="mx-auto max-w-[40rem] pt-12 sm:pt-16">
            <div className="flex items-center gap-2.5">
              <span className="kicker">{story.kicker}</span>
              <span className="text-ink-4" aria-hidden>
                ·
              </span>
              <time dateTime={isoDate(story.publishedAt)} className="meta">
                {formatDate(story.publishedAt)}
              </time>
            </div>

            <h1 className="headline mt-4 text-[2.35rem] leading-[1.04] sm:text-[3.6rem]">
              {story.title}
            </h1>

            {story.dek && (
              <p className="mt-5 font-display text-[1.3rem] leading-[1.45] text-ink-2 sm:text-[1.45rem]">
                {story.dek}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-y border-line py-3.5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink">
                {story.author}
              </p>
              {story.authorTitle && <p className="meta">{story.authorTitle}</p>}
              <span className="text-ink-4" aria-hidden>
                ·
              </span>
              <p className="meta">{readingMinutes(story.body)} min read</p>
            </div>
          </header>

          <div
            className="article dropcap mx-auto mt-11 max-w-[40rem]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <Highlights />

          <div className="mx-auto mt-14 max-w-[40rem] border-t border-line pt-6">
            <p className="meta">
              Published {formatDate(story.publishedAt)} by{" "}
              <span className="text-ink">{story.author}</span>
            </p>
            <Link
              href="/"
              className="meta mt-4 inline-block uppercase tracking-[0.11em] hover:text-accent transition-colors"
            >
              ← Back to the front page
            </Link>

            <StoryDock />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
