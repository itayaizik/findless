"use client";

import { useEffect, useRef, useState } from "react";
import { preconnect, preloadModule } from "react-dom";

const SRC = "https://thrine.app/embed/v1.js";

// 3D 失 model hosted on thrine.app. The script is requested as early as possible, the
// box keeps its size so nothing jumps, and the model fades in only once it has drawn,
// so visitors never see it pop in half-loaded.
export default function ModelLogo({ project, className = "" }: { project: string; className?: string }) {
  preconnect("https://thrine.app");
  preloadModule(SRC);
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = SRC;
      document.head.appendChild(s);
    }
    const host = ref.current?.querySelector("model-embed");
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      // one more frame so the first render is on screen before fading in
      requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    };
    const hasCanvas = () =>
      !!(host?.querySelector("canvas, iframe, img, video") || host?.shadowRoot?.querySelector("canvas, iframe, img, video"));
    const timer = window.setInterval(() => {
      if (hasCanvas()) {
        window.clearInterval(timer);
        window.setTimeout(finish, 350);
      }
    }, 100);
    const fallback = window.setTimeout(finish, 4000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(fallback);
    };
  }, [project]);

  return (
    <div ref={ref} className={`model-logo ${ready ? "ready" : ""} ${className}`} role="img" aria-label="FINDLESS 失">
      <model-embed project={project} style={{ display: "block", width: "100%", aspectRatio: "1571 / 833" }} />
    </div>
  );
}
