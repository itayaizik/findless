"use client";

import { useRouter } from "next/navigation";
import { LANG_COOKIE } from "@/lib/dict";
import { useT } from "./I18n";

export default function LangSwitch() {
  const { lang, t } = useT();
  const router = useRouter();
  const next = lang === "he" ? "en" : "he";
  return (
    <button
      type="button"
      className="lang"
      lang={next}
      onClick={() => {
        document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        router.refresh();
      }}
    >
      {t.langSwitchLabel}
    </button>
  );
}
