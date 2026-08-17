import Link from "next/link";
import type { Story } from "@/lib/stories";
import { excerpt, readingMinutes } from "@/lib/markdown";
import { formatShortDate, isoDate } from "@/lib/site";

/**
 * Links are never nested — the section label is its own anchor, so it always
 * sits beside the story link rather than inside it.
 */

/**
 * Renders nothing when a story has no cover. An empty grey rectangle is
 * worse than no rectangle — without art, the headline should lead.
 */
function Cover({
  story,
  ratio = "aspect-[3/2]",
  className = "",
}: {
  story: Story;
  ratio?: string;
  className?: string;
}) {
  if (!story.cover_url) return null;
  return (
    <Link
      href={`/story/${story.slug}`}
      tabIndex={-1}
      aria-hidden
      className={`ph relative block overflow-hidden ${ratio} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={story.cover_url}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]"
      />
    </Link>
  );
}

function Byline({ story, dot = true }: { story: Story; dot?: boolean }) {
  return (
    <p className="meta">
      {story.author}
      {dot && <span className="px-1.5 text-ink-4">·</span>}
      {dot && `${readingMinutes(story.body)} min read`}
    </p>
  );
}

function SectionLink({ story }: { story: Story }) {
  return (
    <Link href={`/section/${story.section}`} className="kicker hover:underline">
      {story.section}
    </Link>
  );
}

/* --------------------------------------------------------------------------
   Lead — the story above the fold
   -------------------------------------------------------------------------- */
export function LeadStory({ story }: { story: Story }) {
  return (
    <article className="group">
      <Cover story={story} ratio="aspect-[21/9]" />

      <div
        className={`mx-auto max-w-3xl text-center ${story.cover_url ? "mt-6" : ""}`}
      >
        <div className="flex items-center justify-center gap-2.5">
          <SectionLink story={story} />
          <span className="text-ink-4" aria-hidden>
            ·
          </span>
          <time dateTime={isoDate(story.published_at)} className="meta">
            {formatShortDate(story.published_at)}
          </time>
        </div>

        <h2 className="headline mt-3.5 text-[2.1rem] leading-[1.06] sm:text-[3.35rem]">
          <Link href={`/story/${story.slug}`} className="hover:text-accent transition-colors">
            {story.title}
          </Link>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl font-display text-[1.1875rem] leading-relaxed text-ink-2">
          {excerpt(story, 230)}
        </p>

        <div className="mt-4">
          <Byline story={story} />
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Standard card — used in grids
   -------------------------------------------------------------------------- */
export function StoryCard({
  story,
  size = "md",
}: {
  story: Story;
  size?: "md" | "lg";
}) {
  return (
    <article className="group flex flex-col">
      <Cover story={story} ratio={size === "lg" ? "aspect-[16/10]" : "aspect-[3/2]"} />

      <div className={`flex flex-1 flex-col ${story.cover_url ? "mt-4" : ""}`}>
        <SectionLink story={story} />

        <h3
          className={`headline mt-2 ${
            size === "lg" ? "text-[1.7rem] leading-[1.13]" : "text-[1.3rem] leading-[1.2]"
          }`}
        >
          <Link href={`/story/${story.slug}`} className="hover:text-accent transition-colors">
            {story.title}
          </Link>
        </h3>

        <p
          className={`mt-2.5 font-display leading-snug text-ink-2 ${
            size === "lg" ? "text-[1.0625rem] line-clamp-3" : "text-[15px] line-clamp-3"
          }`}
        >
          {excerpt(story, size === "lg" ? 190 : 150)}
        </p>

        <div className="mt-3.5 flex items-center gap-2">
          <Byline story={story} dot={false} />
          <span className="text-ink-4" aria-hidden>
            ·
          </span>
          <time dateTime={isoDate(story.published_at)} className="meta">
            {formatShortDate(story.published_at)}
          </time>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Compact list item — sidebars and section rails
   -------------------------------------------------------------------------- */
export function StoryListItem({
  story,
  index,
  showThumb = false,
}: {
  story: Story;
  index?: number;
  showThumb?: boolean;
}) {
  return (
    <article className="group flex gap-4 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0">
      {typeof index === "number" && (
        <span className="headline shrink-0 pt-0.5 text-2xl leading-none text-paper-4">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <SectionLink story={story} />
        <h3 className="headline mt-1.5 text-[1.0625rem] leading-[1.28]">
          <Link href={`/story/${story.slug}`} className="hover:text-accent transition-colors">
            {story.title}
          </Link>
        </h3>
        <p className="meta mt-1.5">
          {story.author}
          <span className="px-1.5 text-ink-4">·</span>
          {formatShortDate(story.published_at)}
        </p>
      </div>

      {showThumb && (
        <Cover story={story} ratio="aspect-square" className="h-[74px] w-[74px] shrink-0" />
      )}
    </article>
  );
}

/* --------------------------------------------------------------------------
   Wide row — search results and section pages
   -------------------------------------------------------------------------- */
export function StoryRow({ story }: { story: Story }) {
  return (
    <article
      className={`group grid gap-5 border-b border-line py-7 last:border-b-0 ${
        story.cover_url ? "sm:grid-cols-[1fr_13rem]" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <SectionLink story={story} />
          <span className="text-ink-4" aria-hidden>
            ·
          </span>
          <time dateTime={isoDate(story.published_at)} className="meta">
            {formatShortDate(story.published_at)}
          </time>
        </div>

        <h3 className="headline mt-2 text-[1.55rem] leading-[1.15]">
          <Link href={`/story/${story.slug}`} className="hover:text-accent transition-colors">
            {story.title}
          </Link>
        </h3>

        <p className="mt-2.5 max-w-2xl font-display text-[1.0625rem] leading-snug text-ink-2 line-clamp-2">
          {excerpt(story, 200)}
        </p>

        <div className="mt-3">
          <Byline story={story} />
        </div>
      </div>

      {story.cover_url && (
        <Cover story={story} ratio="aspect-[4/3]" className="order-first sm:order-none" />
      )}
    </article>
  );
}
