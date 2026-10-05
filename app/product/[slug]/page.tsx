import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SignupForm from "@/components/SignupForm";
import { getProduct, images, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: `${p.name} [${p.color}]` } : {};
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const img = images(p);
  const others = products.filter((o) => o.slug !== p.slug).slice(0, 4);

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
          <span>Coming soon</span>
          <div className="size-row" aria-label="Sizes">
            {p.sizes.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <SignupForm source={p.slug} cta="Notify me" />
        </div>
      </section>

      <section className="also">
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
