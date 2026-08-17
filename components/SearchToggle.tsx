"use client";

import { useEffect, useRef, useState } from "react";

export default function SearchToggle() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="meta hover:text-ink transition-colors"
      >
        {open ? "Close" : "Search"}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper shadow-[0_12px_34px_-20px_rgba(0,0,0,0.4)]">
          <form action="/search" className="mx-auto flex max-w-[1180px] items-center gap-3 px-5 py-4">
            <input
              ref={inputRef}
              name="q"
              type="search"
              placeholder="Search every story…"
              className="headline w-full border-0 bg-transparent text-2xl text-ink placeholder:text-ink-4 focus:outline-none sm:text-3xl"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-paper hover:bg-accent transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="meta shrink-0 hover:text-ink"
              aria-label="Close search"
            >
              Esc
            </button>
          </form>
        </div>
      )}
    </>
  );
}
