"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, null as
    | { error?: string }
    | null);

  return (
    <form
      action={action}
      className="rounded-[3px] border border-line bg-card p-7 backdrop-blur"
    >
      <input type="hidden" name="next" value={next} />

      <label
        htmlFor="name"
        className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3"
      >
        Your name
      </label>
      <input
        id="name"
        name="name"
        autoComplete="name"
        placeholder="Ben"
        className="mt-2 w-full rounded-[3px] border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-4 focus:border-accent focus:outline-none"
      />

      <label
        htmlFor="password"
        className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3"
      >
        Newsroom password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="mt-2 w-full rounded-[3px] border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink focus:border-accent focus:outline-none"
      />

      {state?.error && (
        <p
          role="alert"
          className="mt-4 rounded-[3px] border border-flag/30 bg-flag/10 px-3 py-2 text-sm text-flag"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-[3px] bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent disabled:opacity-50 transition-colors"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
