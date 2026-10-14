"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/dict";

type Vote = -1 | 0 | 1;
const KEY = "fl-next-votes";

function readVotes(): Record<string, Vote> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

// A blurred upcoming piece. Hover or tap shows like / dislike.
export default function NextCard({
  slug,
  name,
  color,
  image,
  t,
}: {
  slug: string;
  name: string;
  color: string;
  image: string;
  t: Pick<Dict, "nextLike" | "nextDislike" | "nextThanks" | "nextHint">;
}) {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState<Vote>(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => setVote(readVotes()[slug] ?? 0), [slug]);

  async function send(v: Vote) {
    const next: Vote = vote === v ? 0 : v;
    const prev = vote;
    setVote(next);
    setBusy(true);
    try {
      const res = await fetch("/api/next-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, vote: next }),
      });
      if (!res.ok) throw new Error();
      try {
        const all = readVotes();
        all[slug] = next;
        localStorage.setItem(KEY, JSON.stringify(all));
      } catch {}
    } catch {
      setVote(prev);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`next-card${open ? " open" : ""}${vote ? " voted" : ""}`}
      data-reveal
      onMouseLeave={() => setOpen(false)}
    >
      <button type="button" className="next-img" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={`${name} ${color}. ${t.nextHint}`}>
        <img src={image} alt="" loading="lazy" decoding="async" />
        <span className="next-q" aria-hidden="true">?</span>
      </button>
      <div className="next-vote" role="group" aria-label={`${name} ${color}`}>
        <button type="button" onClick={() => send(1)} aria-pressed={vote === 1} disabled={busy}>
          <Thumb /> {t.nextLike}
        </button>
        <button type="button" onClick={() => send(-1)} aria-pressed={vote === -1} disabled={busy} className="down">
          <Thumb /> {t.nextDislike}
        </button>
      </div>
      <div className="meta">
        <span>
          {name} [{color}]
        </span>
        <span className="muted" aria-live="polite">
          {vote ? t.nextThanks : " "}
        </span>
      </div>
    </div>
  );
}

function Thumb() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 10v11H3V10h4zm0 0l4-8a3 3 0 013 3v4h5.5a2 2 0 012 2.3l-1.4 8A2 2 0 0118.1 21H7" />
    </svg>
  );
}
