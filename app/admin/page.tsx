import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { formatIsrael, getCatalog, getIsAdmin, getSettings, isoToIsraelLocal } from "@/lib/site";
import { supabaseServer } from "@/lib/supabase/server";
import { saveOrderStatus, saveProduct, saveSettings } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const ORDER_STATUSES = ["new", "contacted", "paid", "shipped", "cancelled"];

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

export default async function Admin() {
  if (!(await getIsAdmin())) notFound();

  const supabase = await supabaseServer();
  const [settings, catalog, ordersRes, subsRes] = await Promise.all([
    getSettings(),
    getCatalog(true),
    supabase
      .from("orders")
      .select("id, product_slug, size, name, phone, email, note, price_ils, status, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("subscribers").select("email, source, created_at").order("created_at", { ascending: false }),
  ]);
  const orders = ordersRes.data ?? [];
  const subs = subsRes.data ?? [];
  const openOrders = orders.filter((o) => o.status === "new").length;

  return (
    <div className="admin">
      <h1>Admin</h1>

      <section aria-labelledby="site-h">
        <h2 id="site-h">Site</h2>
        <form action={saveSettings} className="admin-row">
          <fieldset className="mode">
            <legend>Mode</legend>
            <label>
              <input type="radio" name="mode" value="waitlist" defaultChecked={settings.mode === "waitlist"} />
              Waitlist: only the drop page and signup
            </label>
            <label>
              <input type="radio" name="mode" value="open" defaultChecked={settings.mode === "open"} />
              Open: shop is visible and people can order
            </label>
          </fieldset>
          <label className="field">
            <span>Drop date (Israel time, empty = TBA)</span>
            <input type="datetime-local" name="drop_at" defaultValue={isoToIsraelLocal(settings.dropAt)} />
          </label>
          <button className="btn">Save</button>
        </form>
      </section>

      <section aria-labelledby="products-h">
        <h2 id="products-h">Products</h2>
        <div className="table">
          {catalog.map((p) => (
            <form key={p.slug} action={saveProduct} className="trow">
              <input type="hidden" name="slug" value={p.slug} />
              <span>
                {p.code} · {p.name} [{p.color}]
              </span>
              <label>
                <span className="sr-only">Price for {p.name} {p.color}</span>
                <input name="price" type="number" min={0} step={1} placeholder="₪" defaultValue={p.price ?? ""} />
              </label>
              <label>
                <span className="sr-only">Status for {p.name} {p.color}</span>
                <select name="status" defaultValue={p.status}>
                  <option value="available">Available</option>
                  <option value="sold_out">Sold out</option>
                  <option value="hidden">Hidden</option>
                </select>
              </label>
              <button className="btn small">Save</button>
            </form>
          ))}
        </div>
      </section>

      <section aria-labelledby="orders-h">
        <h2 id="orders-h">
          Orders · {orders.length} {openOrders > 0 && <span className="badge">{openOrders} new</span>}
        </h2>
        {orders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="table">
            {orders.map((o) => {
              const p = getProduct(o.product_slug);
              return (
                <form key={o.id} action={saveOrderStatus} className="trow order-row">
                  <input type="hidden" name="id" value={o.id} />
                  <span>
                    #{o.id}
                    <br />
                    <span className="dim">{formatIsrael(o.created_at)}</span>
                  </span>
                  <span>
                    {p ? `${p.name} [${p.color}]` : o.product_slug} / {o.size}
                    <br />
                    <span className="muted">{o.price_ils != null ? `₪${o.price_ils}` : "no price set"}</span>
                  </span>
                  <span className="lower">
                    {o.name || "—"}
                    <br />
                    {o.phone && (
                      <>
                        <a href={`tel:${o.phone}`}>{o.phone}</a> ·{" "}
                        <a href={waLink(o.phone)} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                        <br />
                      </>
                    )}
                    {o.email && <a href={`mailto:${o.email}`}>{o.email}</a>}
                    {o.note && <span className="muted"> · {o.note}</span>}
                  </span>
                  <label>
                    <span className="sr-only">Status of order {o.id}</span>
                    <select name="status" defaultValue={o.status}>
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="btn small">Save</button>
                </form>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="subs-h">
        <h2 id="subs-h">Waitlist · {subs.length}</h2>
        {subs.length === 0 ? (
          <p className="muted">Nobody yet.</p>
        ) : (
          <>
            <textarea
              className="copybox"
              readOnly
              rows={4}
              aria-label="All waitlist emails, comma separated"
              defaultValue={subs.map((s) => s.email).join(", ")}
            />
            <ul className="subs">
              {subs.map((s) => (
                <li key={s.email}>
                  <span className="lower">{s.email}</span>
                  <span className="dim">
                    {s.source} · {formatIsrael(s.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
