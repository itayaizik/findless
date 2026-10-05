import type { Metadata } from "next";
import AuthForms from "@/components/AuthForms";
import LangSwitch from "@/components/LangSwitch";
import { signOut } from "@/app/actions";
import { formatIsrael, getCatalog, getUser } from "@/lib/site";
import { supabaseServer } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n";

export const metadata: Metadata = { title: "Account" };

export default async function Account({ searchParams }: PageProps<"/account">) {
  const [user, { t }] = await Promise.all([getUser(), getT()]);
  const STATUS: Record<string, string> = {
    new: t.stNew,
    contacted: t.stContacted,
    paid: t.stPaid,
    shipped: t.stShipped,
    cancelled: t.stCancelled,
  };
  const failed = (await searchParams).confirm === "failed";
  if (!user) {
    return (
      <section className="narrow">
        <h1>{t.account}</h1>
        {failed && <p className="err">{t.confirmFailed}</p>}
        <AuthForms />
        <p className="muted acct-lang">
          {t.language}: <LangSwitch />
        </p>
      </section>
    );
  }

  const supabase = await supabaseServer();
  const catalog = await getCatalog(true);
  const { data: orders } = await supabase
    .from("orders")
    .select("id, product_slug, size, status, price_ils, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="narrow">
      <h1>{t.account}</h1>
      <p className="muted lower">{user.email}</p>
      <h2>{t.yourOrders}</h2>
      {orders && orders.length > 0 ? (
        <ul className="orders">
          {orders.map((o) => {
            const p = catalog.find((x) => x.slug === o.product_slug);
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
        <p className="muted">{t.noOrders}</p>
      )}
      <p className="muted acct-lang">
        {t.language}: <LangSwitch />
      </p>
      <form action={signOut}>
        <button className="link-btn">{t.logout}</button>
      </form>
    </section>
  );
}
