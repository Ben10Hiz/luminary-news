import Link from "next/link";
import { getLiveSections } from "@/lib/stories";
import { site } from "@/lib/site";

export default async function SiteFooter() {
  let sections: { slug: string; name: string }[] = [];
  try {
    sections = await getLiveSections();
  } catch {
    sections = [];
  }

  return (
    <footer className="mt-4 border-t border-line bg-card">
      <div className="mx-auto max-w-[1180px] px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="headline text-2xl leading-none tracking-[-0.03em]">News</p>
            <p className="mt-4 max-w-sm font-display text-[15px] leading-relaxed text-ink-2">
              {site.description}
            </p>
            <Link
              href="/feed.xml"
              className="meta mt-5 inline-block border-b border-line pb-0.5 uppercase tracking-[0.11em] hover:border-accent hover:text-accent transition-colors"
            >
              Subscribe by RSS
            </Link>
          </div>

          <div className={sections.length === 0 ? "hidden" : ""}>
            <h2 className="meta uppercase tracking-[0.13em] text-ink">Sections</h2>
            <ul className="mt-4 space-y-2.5">
              {sections.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/section/${s.slug}`}
                    className="text-[15px] text-ink-2 hover:text-accent transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="meta uppercase tracking-[0.13em] text-ink">More</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-[15px] text-ink-2 hover:text-accent transition-colors"
                >
                  About this newsroom
                </Link>
              </li>
              <li>
                <a
                  href={site.parentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-ink-2 hover:text-accent transition-colors"
                >
                  The Luminary Network
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-[15px] text-ink-3 hover:text-accent transition-colors"
                >
                  Editor sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="meta">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="meta">news.theluminary.network</p>
        </div>
      </div>
    </footer>
  );
}
