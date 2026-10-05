import type { Metadata } from "next";
import AuthForms from "@/components/AuthForms";
import { signOut } from "@/app/actions";
import { getProduct } from "@/lib/products";
import { formatIsrael, getUser } from "@/lib/site";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Account" };

const STATUS: Record<string, string> = {
  new: "Received, waiting for Bit link",
  contacted: "Bit link sent",
  paid: "Paid",
  shipped: "On the way",
  cancelled: "Cancelled",
};

export default async function Account() {
  const user = await getUser();
  if (!user) {
    return (
      <section className="narrow">
        <h1>Account</h1>
        <AuthForms />
      </section>
    );
  }

  const supabase = await supabaseServer();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, product_slug, size, status, price_ils, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="narrow">
      <h1>Account</h1>
      <p className="muted lower">{user.email}</p>
      <h2>Your orders</h2>
      {orders && orders.length > 0 ? (
        <ul className="orders">
          {orders.map((o) => {
            const p = getProduct(o.product_slug);
            return (
              <li key={o.id}>
                <span>#{o.id}</span>
                <span>
                  {p ? `${p.name} [${p.color}]` : o.product_slug} / {o.size}
                </span>
                <span className="muted">{STATUS[o.status] ?? o.status}</span>
                <span className="dim">{formatIsrael(o.created_at)}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="muted">No orders yet.</p>
      )}
      <form action={signOut}>
        <button className="link-btn">Log out</button>
      </form>
    </section>
  );
}
