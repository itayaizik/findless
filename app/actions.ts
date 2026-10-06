"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getDrop } from "@/lib/site";
import { getT } from "@/lib/i18n";
import { hitRate } from "@/lib/rate";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type OrderState =
  | { ok: false; error?: string }
  | { ok: true; id: number; contact: string };

export async function placeOrder(_prev: OrderState, form: FormData): Promise<OrderState> {
  const { t } = await getT();
  const slug = String(form.get("slug") ?? "");
  const size = String(form.get("size") ?? "");
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const phone = String(form.get("phone") ?? "").replace(/[^\d+]/g, "").slice(0, 30);
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const note = String(form.get("note") ?? "").trim().slice(0, 500);

  const product = (await getDrop()).find((p) => p.slug === slug);
  if (!product) return { ok: false, error: t.errNoItem };
  if (!product.sizes.includes(size)) return { ok: false, error: t.errSize };
  if (!phone && !email) return { ok: false, error: t.errContact };
  if (email && !EMAIL_RE.test(email)) return { ok: false, error: t.errEmail };
  if (phone && phone.replace(/\D/g, "").length < 9) return { ok: false, error: t.errPhone };

  const rate = await hitRate("order");
  if (rate === "too_fast") return { ok: false, error: t.errTooFast };
  if (rate === "slow_down") return { ok: false, error: t.errSlowDown };

  const supabase = await supabaseServer();
  const { data, error } = await supabase.rpc("place_order", {
    p_slug: slug,
    p_size: size,
    p_name: name,
    p_phone: phone,
    p_email: email,
    p_note: note,
  });
  if (error) {
    if (error.message.includes("store_closed")) return { ok: false, error: t.errClosed };
    if (error.message.includes("not_available")) return { ok: false, error: t.errSoldOut };
    if (error.message.includes("too_many")) return { ok: false, error: t.errTooMany };
    console.error("place_order failed", error);
    return { ok: false, error: t.errGeneric };
  }

  const id = Number(data);
  await notifyNewOrder({ id, item: `${product.name} [${product.color}]`, size, price: product.price, name, phone, email, note });
  revalidatePath("/account");
  return { ok: true, id, contact: phone || email };
}

// Emails the shop about a new order (RESEND_API_KEY, EMAIL_FROM, ORDER_NOTIFY_EMAIL).
async function notifyNewOrder(o: {
  id: number;
  item: string;
  size: string;
  price: number | null;
  name: string;
  phone: string;
  email: string;
  note: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!apiKey || !from || !to) return;
  const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
  const h = await headers();
  const site = `https://${h.get("host")}`;
  const digits = o.phone.replace(/\D/g, "");
  const wa = digits ? `https://wa.me/${digits.startsWith("0") ? `972${digits.slice(1)}` : digits}` : "";
  const row = (k: string, v: string) =>
    v ? `<tr><td style="color:#8b8577;padding:4px 16px 4px 0">${k}</td><td style="padding:4px 0">${v}</td></tr>` : "";
  const html = `<div style="background:#0a0a0a;color:#e6dcc6;font-family:monospace;padding:32px">
<p style="letter-spacing:.1em;margin:0 0 16px">FINDLESS · NEW ORDER #${o.id}</p>
<table style="color:#e6dcc6;font-family:monospace;font-size:14px">
${row("item", esc(o.item))}${row("size", esc(o.size))}${row("price", o.price != null ? `&#8362;${o.price}` : "not set")}
${row("name", esc(o.name))}${row("phone", esc(o.phone))}${row("email", esc(o.email))}${row("note", esc(o.note))}
</table>
<p style="margin:24px 0 0">
${wa ? `<a href="${wa}" style="color:#0a0a0a;background:#e6dcc6;padding:10px 14px;text-decoration:none">WHATSAPP</a>&nbsp;` : ""}
<a href="${site}/admin#orders-h" style="color:#e6dcc6;border:1px solid #e6dcc6;padding:9px 14px;text-decoration:none">OPEN ADMIN</a>
</p></div>`;
  const text = [`new order #${o.id}`, o.item, `size ${o.size}`, o.name, o.phone, o.email, o.note, `${site}/admin`]
    .filter(Boolean)
    .join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: `new order #${o.id}: ${o.item} / ${o.size}`, html, text }),
  });
  if (!res.ok) console.error("order email failed", res.status, await res.text());
}

export type AuthState = { error?: string; message?: string };

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const { t } = await getT();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: t.errLogin };
  redirect("/account");
}

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const { t } = await getT();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!EMAIL_RE.test(email)) return { error: t.errEmail };
  if (password.length < 8) return { error: t.errPassword };
  const supabase = await supabaseServer();
  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) {
    if (error.message.toLowerCase().includes("registered")) return { error: t.errExists };
    console.error("signUp failed", error);
    return { error: t.errSignup };
  }
  if (!data.session) return { message: t.checkEmail };
  redirect("/account");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}
