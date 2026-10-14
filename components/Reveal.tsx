"use client";

import { useEffect } from "react";

// Fades elements marked data-reveal in as they scroll into view. Without JS, or with
// reduced motion, everything is simply visible.
export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el, i) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: no flash
      el.style.setProperty("--d", `${(i % 4) * 70}ms`);
      el.classList.add("rv");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
