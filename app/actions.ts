"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getProduct } from "@/lib/products";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export type OrderState =
  | { ok: false; error?: string }
  | { ok: true; id: number; contact: string };

export async function placeOrder(_prev: OrderState, form: FormData): Promise<OrderState> {
  const slug = String(form.get("slug") ?? "");
  const size = String(form.get("size") ?? "");
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const phone = String(form.get("phone") ?? "").replace(/[^\d+]/g, "").slice(0, 30);
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const note = String(form.get("note") ?? "").trim().slice(0, 500);

  const product = getProduct(slug);
  if (!product) return { ok: false, error: "This item doesn't exist." };
  if (!SIZES.includes(size)) return { ok: false, error: "Pick a size." };
  if (!phone && !email) return { ok: false, error: "Leave a phone number or an email so we can reach you." };
  if (email && !EMAIL_RE.test(email)) return { ok: false, error: "That email doesn't look right." };
  if (phone && phone.replace(/\D/g, "").length < 9) return { ok: false, error: "That phone number looks too short." };

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
    if (error.message.includes("store_closed")) return { ok: false, error: "Orders aren't open yet." };
    if (error.message.includes("not_available")) return { ok: false, error: "Sorry, this item is sold out." };
    console.error("place_order failed", error);
    return { ok: false, error: "Something went wrong. Try again." };
  }

  const id = Number(data);
  await notifyNewOrder(id, `${product.name} [${product.color}] / ${size}`, name, phone, email, note);
  revalidatePath("/account");
  return { ok: true, id, contact: phone || email };
}

// Emails the shop about a new order once Resend is set up (RESEND_API_KEY, EMAIL_FROM, ORDER_NOTIFY_EMAIL).
async function notifyNewOrder(id: number, item: string, name: string, phone: string, email: string, note: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!apiKey || !from || !to) return;
  const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject: `new order #${id}: ${item}`,
      html: `<p>#${id}<br>${esc(item)}<br>${esc(name)}<br>${esc(phone)}<br>${esc(email)}<br>${esc(note)}</p>`,
    }),
  });
  if (!res.ok) console.error("order email failed", res.status, await res.text());
}

export type AuthState = { error?: string; message?: string };

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Wrong email or password." };
  redirect("/account");
}

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!EMAIL_RE.test(email)) return { error: "That email doesn't look right." };
  if (password.length < 8) return { error: "Password needs at least 8 characters." };
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes("registered")) return { error: "This email already has an account. Log in instead." };
    console.error("signUp failed", error);
    return { error: "Couldn't create the account. Try again." };
  }
  if (!data.session) return { message: "Almost there. Check your email to confirm your account." };
  redirect("/account");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}
