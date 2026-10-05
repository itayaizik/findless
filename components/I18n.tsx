"use client";

import { createContext, useContext } from "react";
import { dicts, type Lang } from "@/lib/dict";

const Ctx = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useT() {
  const lang = useContext(Ctx);
  return { lang, t: dicts[lang] };
}
