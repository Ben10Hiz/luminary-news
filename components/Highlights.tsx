"use client";

import { useEffect } from "react";

/**
 * Two behaviours the original piece has, restored here.
 *
 * 1. The emotional phrase in each account lights as it scrolls into view —
 *    the marked span fades from body ink to the editorial red, once.
 * 2. The All / Parents & families / Teachers & school staff buttons filter
 *    the card wall in place.
 */
export default function Highlights() {
  useEffect(() => {
    const marks = Array.from(document.querySelectorAll<HTMLElement>("mark.hl"));
    if (marks.length === 0) return;

    // Respect a reduced-motion preference by lighting everything immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      marks.forEach((m) => m.classList.add("lit"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lit");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.6 }
    );

    marks.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".article .filt");
    if (!bar) return;

    const buttons = Array.from(bar.querySelectorAll<HTMLButtonElement>("button[data-f]"));
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".article figure.card[data-v]")
    );

    function apply(filter: string) {
      buttons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.f === filter))
      );
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.v === filter;
        card.hidden = !show;
      });
    }

    function onClick(e: MouseEvent) {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "button[data-f]"
      );
      if (button?.dataset.f) apply(button.dataset.f);
    }

    bar.addEventListener("click", onClick);
    return () => bar.removeEventListener("click", onClick);
  }, []);

  return null;
}
