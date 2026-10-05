"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getIsAdmin, israelLocalToIso } from "@/lib/site";

async function adminClient() {
  if (!(await getIsAdmin())) throw new Error("Not allowed");
  return supabaseServer();
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function saveSettings(form: FormData) {
  const supabase = await adminClient();
  const mode = form.get("mode") === "open" ? "open" : "waitlist";
  const local = String(form.get("drop_at") ?? "");
  const drop_at = local ? israelLocalToIso(local) : null;
  const { error } = await supabase
    .from("site_settings")
    .update({ mode, drop_at, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  refresh();
}

export async function saveProduct(form: FormData) {
  const supabase = await adminClient();
  const slug = String(form.get("slug"));
  const raw = String(form.get("price") ?? "").trim();
  const price_ils = raw === "" ? null : Math.max(0, Math.round(Number(raw)));
  const status = String(form.get("status"));
  if (!["available", "sold_out", "hidden"].includes(status) || Number.isNaN(price_ils)) throw new Error("Bad input");
  const { error } = await supabase
    .from("products")
    .update({ price_ils, status, updated_at: new Date().toISOString() })
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
