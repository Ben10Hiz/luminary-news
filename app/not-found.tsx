import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="max-w-md text-center">
        <p className="kicker">Error 404</p>
        <h1 className="headline mt-4 text-[2.75rem] leading-[1.05] sm:text-[3.5rem]">
          This page isn&apos;t in print.
        </h1>
        <p className="mt-4 font-display text-[1.15rem] leading-relaxed text-ink-2">
          The story you&apos;re after may have moved, or never ran.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-paper hover:bg-accent transition-colors"
        >
          Back to the front page
        </Link>
      </div>
    </main>
  );
}
