"use client";

import { useEffect } from "react";

/**
 * The accounts section.
 *
 * 1. The emotional phrase in each account lights as it scrolls into view —
 *    the marked span fades from body ink to the editorial red, once.
 * 2. All / Parents & families / Teachers & school staff filters the wall.
 * 3. The cards are laid out into columns by height rather than by the CSS
 *    column rules. The browser cannot split a card across columns, so a
 *    tall one at the foot of a column leaves a hole — several hundred pixels
 *    of blank paper mid-page. Placing each card into whichever column is
 *    currently shortest closes that up and keeps document order.
 */
const BREAKPOINT = 860;

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
    const decks = Array.from(
      document.querySelectorAll<HTMLElement>(".article .opening, .article .wall")
    );
    if (decks.length === 0) return;

    // Remember every card and the order it was written in, once.
    const original = decks.map((deck) => ({
      deck,
      cards: Array.from(deck.querySelectorAll<HTMLElement>("figure.card")),
    }));

    let filter = "all";

    function place(deck: HTMLElement, cards: HTMLElement[]) {
      const visible = cards.filter(
        (c) => filter === "all" || c.dataset.v === filter
      );

      // One column: no scaffolding needed, just the cards back in order.
      if (window.innerWidth <= BREAKPOINT) {
        deck.classList.remove("masonry");
        deck.replaceChildren(...visible);
        return;
      }

      deck.classList.add("masonry");
      const columns = [document.createElement("div"), document.createElement("div")];
      columns.forEach((c) => (c.className = "col"));
      deck.replaceChildren(...columns);

      visible.forEach((card) => {
        const shortest =
          columns[0].getBoundingClientRect().height <=
          columns[1].getBoundingClientRect().height
            ? columns[0]
            : columns[1];
        shortest.appendChild(card);
      });
    }

    function layout() {
      original.forEach(({ deck, cards }) => place(deck, cards));
    }

    // Type metrics decide the heights, so wait for the real faces.
    if (document.fonts?.ready) document.fonts.ready.then(layout);
    else layout();
    layout();

    let timer: number | undefined;
    function onResize() {
      window.clearTimeout(timer);
      timer = window.setTimeout(layout, 150);
    }
    window.addEventListener("resize", onResize);

    const bar = document.querySelector<HTMLElement>(".article .filt");
    const buttons = bar
      ? Array.from(bar.querySelectorAll<HTMLButtonElement>("button[data-f]"))
      : [];

    function onClick(e: MouseEvent) {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "button[data-f]"
      );
      if (!button?.dataset.f) return;
      filter = button.dataset.f;
      buttons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.f === filter))
      );
      layout();
    }

    bar?.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
      bar?.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
