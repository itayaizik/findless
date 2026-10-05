"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/dict";
import { useT } from "./I18n";

function parts(ms: number, t: Dict) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    [t.cdDays, Math.floor(s / 86400)],
    [t.cdHrs, Math.floor((s % 86400) / 3600)],
    [t.cdMin, Math.floor((s % 3600) / 60)],
    [t.cdSec, s % 60],
  ] as const;
}

export default function Countdown({ dropAt }: { dropAt: string | null }) {
  const { t } = useT();
  const target = dropAt ? Date.parse(dropAt) : NaN;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  if (Number.isNaN(target)) return <p className="muted">{t.cdTba}</p>;
  if (now === null) return <div className="countdown" style={{ height: 42 }} />;
  if (now >= target) return <p>{t.cdNow}</p>;

  return (
    <div className="countdown" role="timer" aria-label={t.cdLabel}>
      {parts(target - now, t).map(([label, v]) => (
        <div key={label}>
          <b>{String(v).padStart(2, "0")}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
