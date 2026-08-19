"use client";

import { useEffect } from "react";

/**
 * Lights the emotional phrase in each account as it scrolls into view —
 * the same behaviour as the original piece: the marked span fades from body
 * ink to the editorial red, once, and stays lit.
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

  return null;
}
