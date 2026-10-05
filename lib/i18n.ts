import { cookies } from "next/headers";
import { dicts, LANG_COOKIE, type Lang } from "./dict";

export * from "./dict";

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return v === "he" ? "he" : "en";
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: dicts[lang] };
}
