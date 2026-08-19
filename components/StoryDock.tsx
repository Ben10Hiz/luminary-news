"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky dock at the foot of the story.
 *
 * "Share my story" opens a form. The person fills it in and presses the
 * button — that is the whole interaction. The submission posts to /api/story,
 * which forwards it for approval before anything reaches the wall.
 */
export default function StoryDock() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"form" | "sending" | "done" | "error">("form");
  const storyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) storyRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function close() {
    setOpen(false);
    setTimeout(() => setState("form"), 250);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const story = String(data.get("story") ?? "").trim();
    if (!story) {
      storyRef.current?.focus();
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story,
          name: String(data.get("name") ?? "").trim(),
          city: String(data.get("city") ?? "").trim(),
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <div className="dock">
        <div className="dock-row">
          <button type="button" className="dock-btn" onClick={() => setOpen(true)}>
            Share my story
          </button>
          <span className="dock-btn soon" aria-disabled="true">
            Tell Braun <em>coming soon</em>
          </span>
        </div>
      </div>

      {open && (
        <div
          className="sheet-scrim"
          role="dialog"
          aria-modal="true"
          aria-label="Share my story"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="sheet">
            <button type="button" className="sheet-x" aria-label="Close" onClick={close}>
              ×
            </button>

            {state === "done" ? (
              <div className="sheet-thanks">
                <h3>Thank you.</h3>
                <p>
                  The lies and the covering up are no longer acceptable. We are proud
                  to support you. Your story will be shared publicly shortly, and you
                  will see it here.
                </p>
                <button type="button" className="sheet-send" onClick={close}>
                  Close
                </button>
              </div>
            ) : (
              <form className="sheet-form" onSubmit={submit}>
                <textarea
                  ref={storyRef}
                  name="story"
                  aria-label="Your experience"
                  placeholder="Your experience"
                  rows={7}
                  required
                />
                <div className="sheet-row">
                  <label>
                    Name
                    <input name="name" type="text" autoComplete="name" />
                  </label>
                  <label>
                    City
                    <input name="city" type="text" autoComplete="address-level2" />
                  </label>
                </div>

                {state === "error" && (
                  <p className="sheet-err" role="alert">
                    That didn&rsquo;t go through. Please try once more.
                  </p>
                )}

                <button
                  type="submit"
                  className="sheet-send"
                  disabled={state === "sending"}
                >
                  {state === "sending" ? "Sending…" : "Share my story"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
