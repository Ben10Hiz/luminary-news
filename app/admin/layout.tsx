import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Newsroom",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession().catch(() => null);

  // The login screen renders standalone — no chrome around it.
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="headline text-lg tracking-tight">
              News
            </span>
            <span className="ml-1 rounded bg-paper-3 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-2">
              Newsroom
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/admin"
              className="rounded-[3px] px-3 py-1.5 text-ink-2 hover:bg-paper-3 hover:text-ink transition-colors"
            >
              Stories
            </Link>
            <Link
              href="/admin/new"
              className="rounded-[3px] px-3 py-1.5 text-ink-2 hover:bg-paper-3 hover:text-ink transition-colors"
            >
              New
            </Link>
            <Link
              href="/"
              target="_blank"
              className="rounded-[3px] px-3 py-1.5 text-ink-2 hover:bg-paper-3 hover:text-ink transition-colors"
            >
              View site ↗
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-ink-3 sm:block">
              {session.name}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-[3px] border border-line px-3 py-1.5 text-xs text-ink-2 hover:text-ink transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
