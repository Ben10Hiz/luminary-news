import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Newsroom sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2.5">
            <span className="headline text-3xl tracking-tight">
              News
            </span>
          </span>
          <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-ink-3">
            Newsroom
          </p>
        </div>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </main>
  );
}
