import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-line bg-card">
      <div className="mx-auto max-w-[1180px] px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="headline text-2xl leading-none tracking-[-0.03em]">News</p>
          <p className="mt-4 max-w-md font-display text-[15px] leading-relaxed text-ink-2">
            {site.description}
          </p>
          <a
            href={site.parentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="meta mt-5 inline-block border-b border-line pb-0.5 uppercase tracking-[0.11em] hover:border-accent hover:text-accent transition-colors"
          >
            The Luminary Network
          </a>

          <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="meta">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <p className="meta">news.theluminary.network</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
