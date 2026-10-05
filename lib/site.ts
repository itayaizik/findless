import { cache } from "react";
import { supabaseServer } from "./supabase/server";
import { products as baseProducts, type Product } from "./products";

export type Mode = "waitlist" | "open";
export type Status = "available" | "sold_out" | "hidden";
export type CatalogItem = Product & { price: number | null; status: Status };

export const getSettings = cache(async () => {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("site_settings").select("mode, drop_at").eq("id", 1).single();
  return { mode: (data?.mode ?? "waitlist") as Mode, dropAt: (data?.drop_at as string | null) ?? null };
});

export const getUser = cache(async () => {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
});

export const getIsAdmin = cache(async () => {
  const user = await getUser();
  if (!user) return false;
  const supabase = await supabaseServer();
  const { data } = await supabase.rpc("is_admin");
  return data === true;
});

// The shop is visible when the store is open; admins always see it (preview).
export const getShopAccess = cache(async () => {
  const [{ mode }, admin] = await Promise.all([getSettings(), getIsAdmin()]);
  return { mode, admin, visible: mode === "open" || admin, preview: mode !== "open" && admin };
});

export const getCatalog = cache(async (includeHidden = false): Promise<CatalogItem[]> => {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("products").select("slug, price_ils, status, sort");
  const rows = new Map((data ?? []).map((r) => [r.slug as string, r]));
  return baseProducts
    .map((p, i) => {
      const r = rows.get(p.slug);
      return {
        ...p,
        price: (r?.price_ils as number | null) ?? null,
        status: ((r?.status as Status) ?? "available") as Status,
        sort: (r?.sort as number | undefined) ?? i,
      };
    })
    .filter((p) => includeHidden || p.status !== "hidden")
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort: _sort, ...p }) => p);
});

export function formatPrice(price: number | null) {
  return price == null ? "Price TBA" : `₪${price}`;
}

// Israel time helpers for the drop date.
const TZ = "Asia/Jerusalem";

function tzOffsetMs(utcMs: number) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(new Date(utcMs))
      .map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - utcMs;
}

/** "2026-11-20T20:00" in Israel time → ISO string. */
export function israelLocalToIso(local: string) {
  const m = local.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  return new Date(guess - tzOffsetMs(guess)).toISOString();
}

/** ISO → "2026-11-20T20:00" in Israel time, for <input type="datetime-local">. */
export function isoToIsraelLocal(iso: string | null) {
  if (!iso) return "";
  const ms = Date.parse(iso);
  return new Date(ms + tzOffsetMs(ms)).toISOString().slice(0, 16);
}

export function formatIsrael(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
