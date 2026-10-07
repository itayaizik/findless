import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatIsrael, getCatalog, getIsAdmin, getSettings, isoToIsraelLocal } from "@/lib/site";
import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { addAdmin, addProduct, moveProduct, removeAdmin, saveOrderStatus, saveProduct, saveSettings } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const ORDER_STATUSES = ["new", "contacted", "paid", "shipped", "cancelled"];

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

const ADMIN_MSG: Record<string, string> = {
  ok: "Added. They see the admin link next time they open the site.",
  already: "That person is already an admin.",
  no_account: "No account with that email. Ask them to sign up on the site first, then add them here.",
  self: "You can't remove yourself. Ask another admin to do it.",
  removed: "Removed.",
};

export default async function Admin({ searchParams }: PageProps<"/admin">) {
  if (!(await getIsAdmin())) notFound();
  const sp = await searchParams;
  const filter = ORDER_STATUSES.includes(String(sp.status)) ? String(sp.status) : "all";
  const adminMsg = ADMIN_MSG[String(sp.admin)] ?? null;

  const supabase = await supabaseServer();
  const [settings, catalog, ordersRes, subsRes, adminsRes] = await Promise.all([
    getSettings(),
    getCatalog(true),
    supabase
      .from("orders")
      .select("id, product_slug, size, name, phone, email, note, price_ils, status, admin_note, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("subscribers").select("email, source, created_at").order("created_at", { ascending: false }),
    supabase.rpc("admin_list"),
  ]);
  const allOrders = ordersRes.data ?? [];
  const orders = filter === "all" ? allOrders : allOrders.filter((o) => o.status === filter);
  const subs = subsRes.data ?? [];
  const admins = (adminsRes.data ?? []) as { user_id: string; email: string; is_me: boolean }[];
  const count = (st: string) => allOrders.filter((o) => o.status === st).length;
  const openOrders = count("new");
  const live = allOrders.filter((o) => o.status !== "cancelled");
  const sum = (list: typeof allOrders) => list.reduce((n, o) => n + (o.price_ils ?? 0), 0);
  const paid = live.filter((o) => o.status === "paid" || o.status === "shipped");
  const dayAgo = Date.now() - 864e5;
  const subsToday = subs.filter((s) => Date.parse(s.created_at) > dayAgo).length;

  return (
    <div className="admin">
      <h1>Admin</h1>

      <section aria-labelledby="stats-h">
        <h2 id="stats-h" className="sr-only">Summary</h2>
        <dl className="stats">
          <div>
            <dt>Orders</dt>
            <dd>{live.length}</dd>
          </div>
          <div>
            <dt>Waiting for you</dt>
            <dd>{openOrders}</dd>
          </div>
          <div>
            <dt>Paid</dt>
            <dd>₪{sum(paid)}</dd>
          </div>
          <div>
            <dt>Still to collect</dt>
            <dd>₪{sum(live) - sum(paid)}</dd>
          </div>
          <div>
            <dt>Waitlist</dt>
            <dd>
              {subs.length}
              {subsToday > 0 && <span className="dim"> +{subsToday} today</span>}
            </dd>
          </div>
        </dl>
      </section>

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
            <span>What&apos;s in the drop</span>
            <select name="featured" defaultValue={settings.featured ?? ""}>
              <option value="">All products</option>
              {catalog.map((p) => (
                <option key={p.slug} value={p.slug}>
                  Only {p.name} [{p.color}]
                </option>
              ))}
            </select>
          </label>
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
          <div className="trow thead" aria-hidden="true">
            <span>Item</span>
            <span>Price ₪</span>
            <span>Stock left</span>
            <span>Status</span>
            <span />
          </div>
          {catalog.map((p, i) => (
            <form key={p.slug} action={saveProduct} className="trow">
              <input type="hidden" name="slug" value={p.slug} />
              <span className="trow-item">
                {p.images[0] ? <img src={p.images[0]} alt="" className="thumb" /> : <span className="thumb" />}
                <span>
                  {p.code} · {p.name} [{p.color}]
                  <br />
                  <Link href={`/admin/products/${p.slug}`} className="link">
                    Edit details &amp; images
                  </Link>
                  <span className="move">
                    <button formAction={moveProduct} name="dir" value="up" disabled={i === 0} aria-label={`Move ${p.name} ${p.color} up`}>
                      ↑
                    </button>
                    <button
                      formAction={moveProduct}
                      name="dir"
                      value="down"
                      disabled={i === catalog.length - 1}
                      aria-label={`Move ${p.name} ${p.color} down`}
                    >
                      ↓
                    </button>
                  </span>
                </span>
              </span>
              <label>
                <span className="sr-only">Price for {p.name} {p.color}</span>
                <input name="price" type="number" min={0} step={1} placeholder="₪" defaultValue={p.price ?? ""} />
              </label>
              <label>
                <span className="sr-only">Stock left for {p.name} {p.color} (empty = no limit)</span>
                <input name="stock" type="number" min={0} step={1} placeholder="Stock ∞" defaultValue={p.stock ?? ""} />
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
        <form action={addProduct} className="add-product">
          <span>New product</span>
          <label>
            <span className="sr-only">Name</span>
            <input name="name" required placeholder="Name, e.g. ZIP HOODIE" maxLength={80} />
          </label>
          <label>
            <span className="sr-only">Color</span>
            <input name="color" placeholder="Color, e.g. GREY" maxLength={80} />
          </label>
          <button className="btn small">Add</button>
        </form>
        <p className="hint">New products start hidden. Add images and a price, then set them to Available.</p>
      </section>

      <section aria-labelledby="orders-h">
        <h2 id="orders-h">
          Orders · {allOrders.length} {openOrders > 0 && <span className="badge">{openOrders} new</span>}
        </h2>
        <nav className="filters" aria-label="Filter orders">
          {["all", ...ORDER_STATUSES].map((st) => (
            <Link
              key={st}
              href={st === "all" ? "/admin#orders-h" : `/admin?status=${st}#orders-h`}
              aria-current={filter === st ? "true" : undefined}
            >
              {st} ({st === "all" ? allOrders.length : count(st)})
            </Link>
          ))}
          <a href="/admin/export?type=orders" className="link">
            Download CSV
          </a>
        </nav>
        {orders.length === 0 ? (
          <p className="muted">{allOrders.length === 0 ? "No orders yet." : "Nothing here."}</p>
        ) : (
          <div className="table">
            {orders.map((o) => {
              const p = catalog.find((x) => x.slug === o.product_slug);
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
                  <span className="order-edit">
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
                    <label>
                      <span className="sr-only">Private note for order {o.id}</span>
                      <input name="admin_note" defaultValue={o.admin_note ?? ""} placeholder="note (only you see)" maxLength={1000} />
                    </label>
                  </span>
                  <button className="btn small">Save</button>
                </form>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="subs-h">
        <h2 id="subs-h">
          Waitlist · {subs.length}
          {subs.length > 0 && (
            <a href="/admin/export?type=waitlist" className="link h-link">
              Download CSV
            </a>
          )}
        </h2>
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

      <section aria-labelledby="admins-h">
        <h2 id="admins-h">Admins · {admins.length}</h2>
        {adminMsg && (
          <p className="hint" role="status">
            {adminMsg}
          </p>
        )}
        <ul className="subs">
          {admins.map((a) => (
            <li key={a.user_id}>
              <span className="lower">
                {a.email}
                {a.is_me && <span className="dim"> (you)</span>}
              </span>
              {!a.is_me && (
                <form action={removeAdmin}>
                  <input type="hidden" name="user_id" value={a.user_id} />
                  <button className="btn small ghost">Remove</button>
                </form>
              )}
            </li>
          ))}
        </ul>
        <form action={addAdmin} className="add-product add-admin">
          <span>Add admin</span>
          <label>
            <span className="sr-only">Email of the new admin</span>
            <input name="email" type="email" required placeholder="their account email" maxLength={254} />
          </label>
          <button className="btn small">Add</button>
        </form>
        <p className="hint">
          They need an account on the site first (Login → sign up). Admins can do everything here, including adding
          and removing other admins.
        </p>
      </section>
    </div>
  );
}
