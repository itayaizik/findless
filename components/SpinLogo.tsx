"use client";

import { useEffect, useRef } from "react";

// Spinning chrome 失. The video has a black background; mix-blend-mode: screen
// in CSS makes the black disappear on the dark site. People who ask for less
// motion get the still poster frame.
export default function SpinLogo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) v.pause();
      else v.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      className={`spin-logo ${className}`}
      src="/brand/kanji-spin.mp4"
      poster="/brand/kanji-spin.webp"
      width={520}
      height={452}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-label="FINDLESS 失"
      role="img"
    />
  );
}
