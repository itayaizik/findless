import { cache } from "react";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { supabaseServer } from "./supabase/server";
import { supabasePublic } from "./supabase/public";
import { products as baseProducts, defaultImages, type Product } from "./products";

export type Mode = "waitlist" | "open";
export type Status = "available" | "sold_out" | "hidden";
export type CatalogItem = Product & {
  price: number | null;
  status: Status;
  description: string;
  images: string[];
};

// Public data is cached across requests and refreshed when the admin saves (see app/admin/actions.ts).
const loadSettings = unstable_cache(
  async () => {
    const { data } = await supabasePublic().from("site_settings").select("mode, drop_at").eq("id", 1).single();
    return { mode: (data?.mode ?? "waitlist") as Mode, dropAt: (data?.drop_at as string | null) ?? null };
  },
  ["settings"],
  { tags: ["settings"], revalidate: 300 },
);

export const getSettings = cache(() => loadSettings());

type Row = {
  slug: string;
  price_ils: number | null;
  status: Status | null;
  sort: number | null;
  name: string | null;
  color: string | null;
  code: string | null;
  description: string | null;
  details: string[] | null;
  sizes: string[] | null;
  images: string[] | null;
};

const loadCatalog = unstable_cache(
  async (): Promise<(CatalogItem & { sort: number })[]> => {
    const { data } = await supabasePublic()
      .from("products")
      .select("slug, price_ils, status, sort, name, color, code, description, details, sizes, images");
    const rows = new Map(((data ?? []) as Row[]).map((r) => [r.slug, r]));
    const known = new Set(baseProducts.map((p) => p.slug));
    const fromCode = baseProducts.map((p, i) => merge(p, rows.get(p.slug), i));
    const extra = ((data ?? []) as Row[])
      .filter((r) => !known.has(r.slug) && r.name)
      .map((r) =>
        merge({ slug: r.slug, code: "", name: "", color: "", details: [], sizes: ["S", "M", "L", "XL"] }, r, 1000),
      );
    return [...fromCode, ...extra].sort((a, b) => a.sort - b.sort);
  },
  ["catalog"],
  { tags: ["catalog"], revalidate: 300 },
);

function merge(p: Product, r: Row | undefined, i: number): CatalogItem & { sort: number } {
  return {
    ...p,
    name: r?.name || p.name,
    color: r?.color ?? p.color,
    code: r?.code || p.code,
    details: r?.details ?? p.details,
    sizes: r?.sizes?.length ? r.sizes : p.sizes,
    description: r?.description ?? "",
    images: r?.images?.length ? r.images : defaultImages(p.slug),
    price: r?.price_ils ?? null,
    status: r?.status ?? "available",
    sort: r?.sort ?? i,
  };
}

export const getCatalog = cache(async (includeHidden = false): Promise<CatalogItem[]> => {
  const all = await loadCatalog();
  return all.filter((p) => includeHidden || p.status !== "hidden").map(({ sort: _sort, ...p }) => p);
});

// Skip the auth server round trip for visitors who aren't logged in.
async function hasSession() {
  return (await cookies()).getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
}

export const getUser = cache(async () => {
  if (!(await hasSession())) return null;
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
