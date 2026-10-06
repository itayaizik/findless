import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import OrderForm from "@/components/OrderForm";
import { formatPrice, getDrop, getShopAccess, getUser, isSoldOut } from "@/lib/site";
import { fill, getT } from "@/lib/i18n";
import SizeChart from "@/components/SizeChart";

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getDrop()).find((x) => x.slug === slug);
  return p ? { title: `${p.name} [${p.color}]` } : {};
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const [access, catalog, user, { t }] = await Promise.all([
    getShopAccess(),
    getDrop(),
    getUser(),
    getT(),
  ]);
  const p = catalog.find((x) => x.slug === slug);
  if (!access.visible || !p) notFound();

  const others = catalog.filter((o) => o.slug !== p.slug).slice(0, 4);
  const soldOut = isSoldOut(p);

  return (
    <>
      <section className="pdp">
        <div className="info">
          <span className="muted">
            {t.itemNo} {p.code}
          </span>
          <h1>
            {p.name} [{p.color}]
          </h1>
          {p.description && <p className="desc">{p.description}</p>}
          <ul>
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          {p.sizeChart && <SizeChart chart={p.sizeChart} sizes={p.sizes} t={t} />}
        </div>

        <div className="gallery">
          {p.images.map((src, n) => (
            <div className="shot" key={src}>
              <img
                src={src}
                alt={`${p.name} ${p.color}, ${n === 0 ? t.front : n === 1 ? t.back : n + 1}`}
                loading={n === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="buy">
          <span className="price">
            {soldOut ? t.soldOut : formatPrice(p.price)}
            {!soldOut && p.stock != null && <span className="stock">{fill(t.stockLeft, { n: p.stock })}</span>}
          </span>
          {soldOut ? (
            <p className="muted">{t.soldOutMsg}</p>
          ) : (
            <OrderForm slug={p.slug} sizes={p.sizes} email={user?.email} />
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="also" aria-label={t.alsoLike}>
          <div
            className="section-head"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <span>{t.alsoLike}</span>
          </div>
          <div className="grid">
            {others.map((o) => (
              <ProductCard key={o.slug} p={o} t={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
