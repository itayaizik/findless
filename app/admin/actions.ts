"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getIsAdmin, israelLocalToIso } from "@/lib/site";

async function adminClient() {
  if (!(await getIsAdmin())) throw new Error("Not allowed");
  return supabaseServer();
}

function refresh() {
  updateTag("catalog");
  updateTag("settings");
  revalidatePath("/", "layout");
}

const STATUSES = ["available", "sold_out", "hidden"];

function parsePrice(raw: FormDataEntryValue | null) {
  const v = String(raw ?? "").trim();
  if (v === "") return null;
  const n = Math.round(Number(v));
  if (Number.isNaN(n) || n < 0) throw new Error("Bad price");
  return n;
}

export async function saveSettings(form: FormData) {
  const supabase = await adminClient();
  const mode = form.get("mode") === "open" ? "open" : "waitlist";
  const local = String(form.get("drop_at") ?? "");
  const drop_at = local ? israelLocalToIso(local) : null;
  const featured_slug = String(form.get("featured") ?? "") || null;
  const { error } = await supabase
    .from("site_settings")
    .update({ mode, drop_at, featured_slug, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  refresh();
}

export async function saveProduct(form: FormData) {
  const supabase = await adminClient();
  const slug = String(form.get("slug"));
  const price_ils = parsePrice(form.get("price"));
  const stock = parsePrice(form.get("stock"));
  const status = String(form.get("status"));
  if (!STATUSES.includes(status)) throw new Error("Bad input");
  const { error } = await supabase
    .from("products")
    .update({ price_ils, stock, status, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  refresh();
}

export async function saveOrderStatus(form: FormData) {
  const supabase = await adminClient();
  const id = Number(form.get("id"));
  const status = String(form.get("status"));
  if (!["new", "contacted", "paid", "shipped", "cancelled"].includes(status)) throw new Error("Bad status");
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

const clean = (v: FormDataEntryValue | null, max = 200) => String(v ?? "").trim().slice(0, max);

export async function saveProductFull(form: FormData) {
  const supabase = await adminClient();
  const slug = clean(form.get("slug"));
  const status = String(form.get("status"));
  if (!STATUSES.includes(status)) throw new Error("Bad status");
  const sizes = clean(form.get("sizes"))
    .toUpperCase()
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 12);
  const details = String(form.get("details") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 20);
  let images: string[] = [];
  try {
    images = (JSON.parse(String(form.get("images") ?? "[]")) as unknown[])
      .filter((u): u is string => typeof u === "string" && (u.startsWith("/products/") || u.startsWith("https://")))
      .slice(0, 12);
  } catch {
    throw new Error("Bad images");
  }
  const { error } = await supabase
    .from("products")
    .update({
      name: clean(form.get("name"), 80).toUpperCase() || null,
      color: clean(form.get("color"), 80).toUpperCase(),
      code: clean(form.get("code"), 20).toUpperCase() || null,
      description: clean(form.get("description"), 2000) || null,
      details,
      sizes: sizes.length ? sizes : null,
      images,
      price_ils: parsePrice(form.get("price")),
      stock: parsePrice(form.get("stock")),
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  refresh();
  redirect("/admin?saved=" + encodeURIComponent(slug) + "#products-h");
}

export async function addProduct(form: FormData) {
  const supabase = await adminClient();
  const name = clean(form.get("name"), 80).toUpperCase();
  const color = clean(form.get("color"), 80).toUpperCase();
  if (!name) throw new Error("Name is required");
  const base = `${name} ${color}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "item";
  const { data: existing } = await supabase.from("products").select("slug").like("slug", `${base}%`);
  const taken = new Set((existing ?? []).map((r) => r.slug as string));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  const { count } = await supabase.from("products").select("slug", { count: "exact", head: true });
  const { error } = await supabase
    .from("products")
    .insert({ slug, name, color, status: "hidden", sort: 100 + (count ?? 0), images: [], details: [] });
  if (error) throw new Error(error.message);
  refresh();
  redirect(`/admin/products/${slug}`);
}

// The browser uploads straight to Supabase Storage, so big photos don't go through the server.
export async function createImageUpload(slug: string, ext: string) {
  const supabase = await adminClient();
  const safeSlug = slug.replace(/[^a-z0-9-]/g, "");
  const safeExt = ["webp", "png", "jpg", "jpeg", "avif"].includes(ext) ? ext : "webp";
  const path = `${safeSlug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const bucket = supabase.storage.from("product-images");
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Upload failed");
  return {
    signedUrl: data.signedUrl,
    publicUrl: bucket.getPublicUrl(path).data.publicUrl,
    apikey: process.env.SUPABASE_ANON_KEY!,
  };
}
