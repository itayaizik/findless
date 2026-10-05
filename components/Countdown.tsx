"use client";

import { useEffect, useState } from "react";

const DROP = process.env.NEXT_PUBLIC_DROP_DATE;

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    ["Days", Math.floor(s / 86400)],
    ["Hrs", Math.floor((s % 86400) / 3600)],
    ["Min", Math.floor((s % 3600) / 60)],
    ["Sec", s % 60],
  ] as const;
}

export default function Countdown() {
  const target = DROP ? Date.parse(DROP) : NaN;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  if (Number.isNaN(target)) return <p className="muted">Drop 001 · Date TBA</p>;
  if (now === null) return <div className="countdown" style={{ height: 42 }} />;
  if (now >= target) return <p>Drop 001 is live</p>;

  return (
    <div className="countdown" aria-label="Time until drop">
      {parts(target - now).map(([label, v]) => (
        <div key={label}>
          <b>{String(v).padStart(2, "0")}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
