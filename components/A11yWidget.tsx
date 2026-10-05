"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Accessibility,
  ALargeSmall,
  AlignJustify,
  BookOpen,
  Contrast,
  Droplet,
  EyeOff,
  Heading,
  ImageOff,
  Link2,
  MessageSquareText,
  MousePointer2,
  MoveHorizontal,
  PanelLeft,
  PanelRight,
  Pause,
  RotateCcw,
  UnfoldVertical,
  X,
  type LucideIcon,
} from "lucide-react";

type Prefs = {
  contrast: number;
  text: number;
  spacing: number;
  motion: number;
  images: number;
  cursor: number;
  dyslexia: number;
  lh: number;
  titles: number;
  align: number;
  sat: number;
  links: number;
  headings: number;
};
type Position = "left" | "right" | "hidden";

const DEFAULTS: Prefs = {
  contrast: 0, text: 0, spacing: 0, motion: 0, images: 0, cursor: 0, dyslexia: 0,
  lh: 0, titles: 0, align: 0, sat: 0, links: 0, headings: 0,
};

// [key, label, icon, number of levels, level names]
const TOOLS: [keyof Prefs, string, LucideIcon, number, string[]?][] = [
  ["contrast", "ניגודיות", Contrast, 3, ["ניגודיות גבוהה", "רקע בהיר", "צבעים הפוכים"]],
  ["links", "הדגשת קישורים", Link2, 1],
  ["text", "טקסט גדול", ALargeSmall, 3],
  ["spacing", "ריווח טקסט", MoveHorizontal, 3],
  ["motion", "ביטול הנפשות", Pause, 1],
  ["images", "הסתרת תמונות", ImageOff, 1],
  ["dyslexia", "תמיכה בדיסלקציה", BookOpen, 1],
  ["cursor", "סמן גדול", MousePointer2, 2, ["סמן גדול בהיר", "סמן גדול כהה"]],
  ["titles", "תיאורים", MessageSquareText, 1],
  ["lh", "גובה שורה", UnfoldVertical, 3],
  ["align", "יישור טקסט", AlignJustify, 3, ["יישור לשמאל", "יישור למרכז", "יישור לימין"]],
  ["sat", "רוויה", Droplet, 3, ["רוויה נמוכה", "רוויה גבוהה", "שחור לבן"]],
  ["headings", "הדגשת כותרות", Heading, 1],
];

const KEY = "fl-a11y";

function apply(p: Prefs) {
  const root = document.documentElement;
  for (const k of Object.keys(DEFAULTS) as (keyof Prefs)[]) {
    if (p[k]) root.setAttribute(`data-a11y-${k}`, String(p[k]));
    else root.removeAttribute(`data-a11y-${k}`);
  }
  // "Descriptions": show alt text and labels as tooltips.
  document.querySelectorAll<HTMLElement>("#site img[alt], #site [aria-label]").forEach((el) => {
    const text = el.getAttribute("alt") || el.getAttribute("aria-label");
    if (p.titles && text && !el.title) {
      el.title = text;
      el.dataset.a11yTitle = "1";
    } else if (!p.titles && el.dataset.a11yTitle) {
      el.removeAttribute("title");
      delete el.dataset.a11yTitle;
    }
  });
}

function load(): { prefs: Prefs; position: Position; big: boolean } {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return {
      prefs: { ...DEFAULTS, ...(raw.prefs || {}) },
      position: raw.position || "left",
      big: !!raw.big,
    };
  } catch {
    return { prefs: DEFAULTS, position: "left", big: false };
  }
}

export default function A11yWidget() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [position, setPosition] = useState<Position>("left");
  const [big, setBig] = useState(false);

  useEffect(() => {
    const s = load();
    setPrefs(s.prefs);
    setPosition(s.position);
    setBig(s.big);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    apply(prefs);
    try {
      localStorage.setItem(KEY, JSON.stringify({ prefs, position, big }));
    } catch {
      // Storage blocked: settings just won't persist.
    }
  }, [prefs, position, big, ready]);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("fl-a11y-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("fl-a11y-open", onOpen);
    };
  }, [toggle]);

  const bump = (k: keyof Prefs, levels: number) =>
    setPrefs((p) => ({ ...p, [k]: (p[k] + 1) % (levels + 1) }));

  const side = position === "right" ? "right" : "left";

  return (
    <div className={`a11y a11y-${side}${big ? " a11y-big" : ""}`} lang="he" dir="rtl">
      {position !== "hidden" && !open && (
        <button
          type="button"
          className="a11y-fab"
          onClick={toggle}
          aria-label="פתיחת תפריט נגישות (Ctrl+U)"
          aria-expanded={open}
          aria-controls="a11y-panel"
        >
          <Accessibility size={26} aria-hidden="true" />
        </button>
      )}

      {open && (
        <div id="a11y-panel" className="a11y-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-title">
          <div className="a11y-head">
            <h2 id="a11y-title">
              <Accessibility size={20} aria-hidden="true" /> תפריט נגישות <small dir="ltr">(Ctrl+U)</small>
            </h2>
            <button type="button" className="a11y-x" onClick={() => setOpen(false)} aria-label="סגירת תפריט הנגישות" autoFocus>
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <label className="a11y-big-toggle">
            <span>יישומון גדול</span>
            <input type="checkbox" checked={big} onChange={(e) => setBig(e.target.checked)} />
          </label>

          <div className="a11y-grid">
            {TOOLS.map(([k, label, Icon, levels, names]) => {
              const v = prefs[k];
              const current = v && names ? names[v - 1] : label;
              return (
                <button
                  key={k}
                  type="button"
                  className={`a11y-card${v ? " on" : ""}`}
                  onClick={() => bump(k, levels)}
                  aria-pressed={v > 0}
                  aria-label={levels > 1 ? `${label}: ${v ? `רמה ${v} מתוך ${levels}` : "כבוי"}` : label}
                >
                  <Icon size={22} aria-hidden="true" />
                  <span>{current}</span>
                  {levels > 1 && (
                    <span className="a11y-dots" aria-hidden="true">
                      {Array.from({ length: levels }, (_, i) => (
                        <i key={i} className={i < v ? "on" : ""} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button type="button" className="a11y-reset" onClick={() => setPrefs(DEFAULTS)}>
            <RotateCcw size={18} aria-hidden="true" /> איפוס כל הגדרות הנגישות
          </button>

          <fieldset className="a11y-pos">
            <legend>מיקום הכפתור</legend>
            <div>
              {(
                [
                  ["left", "שמאל", PanelLeft],
                  ["right", "ימין", PanelRight],
                  ["hidden", "הסתרה", EyeOff],
                ] as const
              ).map(([val, label, Icon]) => (
                <button
                  key={val}
                  type="button"
                  className={position === val ? "on" : ""}
                  aria-pressed={position === val}
                  onClick={() => setPosition(val)}
                >
                  <Icon size={16} aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
            <p>הסתרה מסתירה את הכפתור. אפשר לפתוח את התפריט תמיד עם Ctrl+U או מהקישור בתחתית העמוד.</p>
          </fieldset>

          <div className="a11y-foot">
            <Link href="/accessibility" onClick={() => setOpen(false)}>
              הצהרת נגישות
            </Link>
            <span>ההגדרות נשמרות בדפדפן הזה.</span>
          </div>
        </div>
      )}
    </div>
  );
}
