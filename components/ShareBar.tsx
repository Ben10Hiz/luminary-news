"use client";

import { useState } from "react";

export default function ShareBar({
  url,
  title,
  label = false,
}: {
  url: string;
  title: string;
  label?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const cls =
    "text-[12px] uppercase tracking-[0.09em] text-ink-3 hover:text-accent transition-colors";

  return (
    <div className="flex items-center gap-4">
      {label && (
        <span className="meta uppercase tracking-[0.11em] text-ink">Share</span>
      )}
      <a
        className={cls}
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <a
        className={cls}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <a
        className={cls}
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
      >
        Email
      </a>
      <button type="button" onClick={copy} className={cls}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
