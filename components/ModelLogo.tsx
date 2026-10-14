"use client";

import { useEffect } from "react";

const SRC = "https://thrine.app/embed/v1.js";

// 3D 失 model hosted on thrine.app. The script loads after the page has rendered,
// so it never blocks the first paint; the box keeps its size so nothing jumps.
export default function ModelLogo({ project, className = "" }: { project: string; className?: string }) {
  useEffect(() => {
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement("script");
    s.type = "module";
    s.src = SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <div className={`model-logo ${className}`} role="img" aria-label="FINDLESS 失">
      <model-embed project={project} style={{ display: "block", width: "100%", aspectRatio: "1571 / 833" }} />
    </div>
  );
}
