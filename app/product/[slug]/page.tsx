import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import OrderForm from "@/components/OrderForm";
import { images } from "@/lib/products";
import { formatPrice, getCatalog, getShopAccess, getUser } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getCatalog()).find((x) => x.slug === slug);
  return p ? { title: `${p.name} [${p.color}]` } : {};
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const [access, catalog, user] = await Promise.all([getShopAccess(), getCatalog(), getUser()]);
  const p = catalog.find((x) => x.slug === slug);
  if (!access.visible || !p) notFound();

  const img = images(p);
  const others = catalog.filter((o) => o.slug !== p.slug).slice(0, 4);
  const soldOut = p.status === "sold_out";

  return (
    <>
      <section className="pdp">
        <div className="info">
          <span className="muted">Item no. {p.code}</span>
          <h1>
            {p.name} [{p.color}]
          </h1>
          <ul>
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="gallery">
          <div className="shot">
            <img src={img.front} alt={`${p.name} ${p.color}, front`} />
          </div>
          <div className="shot">
            <img src={img.back} alt={`${p.name} ${p.color}, back`} loading="lazy" />
          </div>
        </div>

        <div className="buy">
          <span className="price">{soldOut ? "Sold out" : formatPrice(p.price)}</span>
          {soldOut ? (
            <p className="muted">This one is gone. Maybe it comes back.</p>
          ) : (
            <OrderForm slug={p.slug} sizes={p.sizes} email={user?.email} />
          )}
        </div>
      </section>

      <section className="also" aria-label="You may also like">
        <div className="section-head" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <span>You may also like</span>
        </div>
        <div className="grid">
          {others.map((o) => (
            <ProductCard key={o.slug} p={o} />
          ))}
        </div>
      </section>
    </>
  );
}
