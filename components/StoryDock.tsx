"use client";

import { useEffect, useRef, useState } from "react";

const INTAKE_EMAIL = "benhizer@gmail.com";

/**
 * Sticky dock at the foot of the story: "Share my story" opens the intake
 * sheet, "Tell Braun" is flagged as coming soon.
 *
 * Submitting composes an email to the intake address — the same fallback the
 * original piece used, so a submission never disappears into a form that has
 * nowhere to post.
 */
export default function StoryDock() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const storyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) storyRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const story = String(data.get("story") ?? "").trim();
    const name = String(data.get("name") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();

    const body = [
      story || "(no story text)",
      "",
      `Name: ${name || "(not given)"}`,
      `City: ${city || "(not given)"}`,
    ].join("\n");

    window.location.href =
      `mailto:${INTAKE_EMAIL}` +
      `?subject=${encodeURIComponent("IREAD story submission")}` +
      `&body=${encodeURIComponent(body)}`;

    setSent(true);
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
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="sheet">
            <button
              type="button"
              className="sheet-x"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            {sent ? (
              <div className="sheet-thanks">
                <h3>Thank you.</h3>
                <p>
                  Your email is open — press send and it&rsquo;s gone. The lies and
                  the covering up are no longer acceptable. We are proud to support
                  you.
                </p>
                <button
                  type="button"
                  className="sheet-send"
                  onClick={() => {
                    setSent(false);
                    setOpen(false);
                  }}
                >
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
                <button type="submit" className="sheet-send">
                  Share my story
                </button>
                <p className="sheet-note">
                  This opens your email with the message ready. Nothing is sent
                  until you press send.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
