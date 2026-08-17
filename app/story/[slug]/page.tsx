import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { StoryCard } from "@/components/StoryCard";
import { getBySlug, getRelated, isPubliclyVisible } from "@/lib/stories";
import { renderBody, excerpt, readingMinutes } from "@/lib/markdown";
import { formatDate, isoDate, absoluteUrl, site } from "@/lib/site";
import ShareBar from "@/components/ShareBar";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let story = null;
  try {
    story = await getBySlug(slug);
  } catch {
    /* database not ready */
  }
  if (!isPubliclyVisible(story)) {
    return { title: "Story not found", robots: { index: false } };
  }
  const url = absoluteUrl(`/story/${story.slug}`);
  const description = excerpt(story, 200);
  return {
    title: story.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: story.title,
      description,
      publishedTime: isoDate(story.published_at),
      modifiedTime: isoDate(story.updated_at),
      authors: [story.author],
      section: story.section,
      tags: story.tags,
      images: story.cover_url ? [{ url: story.cover_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description,
      images: story.cover_url ? [story.cover_url] : undefined,
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getBySlug(slug).catch(() => null);
  if (!isPubliclyVisible(story)) notFound();

  const related = await getRelated(story, 3).catch(() => []);
  const html = renderBody(story.body);
  const url = absoluteUrl(`/story/${story.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.title,
    description: excerpt(story, 200),
    image: story.cover_url ? [absoluteUrl(story.cover_url)] : undefined,
    datePublished: isoDate(story.published_at),
    dateModified: isoDate(story.updated_at),
    author: [{ "@type": "Person", name: story.author }],
    publisher: { "@type": "Organization", name: site.newsroom },
    mainEntityOfPage: url,
    articleSection: story.section,
    keywords: story.tags.join(", "),
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
          {/* ---------- Headline block ---------- */}
          <header className="mx-auto max-w-[40rem] pt-12 sm:pt-16">
            <div className="flex items-center gap-2.5">
              <Link
                href={`/section/${story.section}`}
                className="kicker hover:underline"
              >
                {story.section}
              </Link>
              <span className="text-ink-4" aria-hidden>
                ·
              </span>
              <time dateTime={isoDate(story.published_at)} className="meta">
                {formatDate(story.published_at)}
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

            <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-line py-3.5">
              <div className="flex items-baseline gap-2.5">
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink">
                  {story.author}
                </p>
                {story.author_title && (
                  <p className="meta">{story.author_title}</p>
                )}
                <span className="text-ink-4" aria-hidden>
                  ·
                </span>
                <p className="meta">{readingMinutes(story.body)} min read</p>
              </div>
              <ShareBar url={url} title={story.title} />
            </div>
          </header>

          {/* ---------- Cover ---------- */}
          {story.cover_url && (
            <figure className="mx-auto mt-10 max-w-[56rem]">
              <div className="ph relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.cover_url}
                  alt={story.cover_alt || ""}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              {(story.cover_alt || story.cover_credit) && (
                <figcaption className="mx-auto mt-2.5 max-w-[40rem] text-[13px] leading-relaxed text-ink-3">
                  {story.cover_alt}
                  {story.cover_credit && (
                    <span className="text-ink-4">
                      {story.cover_alt ? "  " : ""}
                      {story.cover_credit}
                    </span>
                  )}
                </figcaption>
              )}
            </figure>
          )}

          {/* ---------- Body ---------- */}
          <div
            className="article dropcap mx-auto mt-11 max-w-[40rem]"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* ---------- Footer of the piece ---------- */}
          <div className="mx-auto mt-14 max-w-[40rem]">
            {story.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-line pt-6">
                <span className="meta uppercase tracking-[0.11em]">Filed under</span>
                {story.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/tag/${encodeURIComponent(t)}`}
                    className="rounded-full border border-line px-3 py-1 text-[12px] text-ink-2 hover:border-accent hover:text-accent transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <p className="meta">
                Published {formatDate(story.published_at)} by{" "}
                <span className="text-ink">{story.author}</span>
              </p>
              <ShareBar url={url} title={story.title} label />
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-20 pb-20">
            <div className="rule-top pt-3">
              <h2 className="headline text-[1.35rem] leading-none">
                More from the newsroom
              </h2>
            </div>
            <div className="col-rule mt-8 grid gap-y-9 md:grid-cols-3">
              {related.map((s, i) => (
                <div key={s.id} className={i > 0 ? "md:pl-7" : "md:pr-7"}>
                  <StoryCard story={s} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
