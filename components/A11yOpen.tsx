"use client";

export default function A11yOpen() {
  return (
    <button type="button" className="link-btn" lang="he" onClick={() => window.dispatchEvent(new Event("fl-a11y-open"))}>
      נגישות
    </button>
  );
}
