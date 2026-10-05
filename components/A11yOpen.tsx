"use client";

import { Accessibility } from "lucide-react";

export default function A11yOpen() {
  return (
    <button type="button" className="a11y-link" onClick={() => window.dispatchEvent(new Event("fl-a11y-open"))}>
      <Accessibility size={14} aria-hidden="true" /> Accessibility menu
    </button>
  );
}
