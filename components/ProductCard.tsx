import Link from "next/link";
import { images } from "@/lib/products";
import { formatPrice, type CatalogItem } from "@/lib/site";
import type { Dict } from "@/lib/dict";

export default function ProductCard({ p, t }: { p: CatalogItem; t: Dict }) {
  const img = images(p);
  const soldOut = p.status === "sold_out";
  return (
    <Link href={`/product/${p.slug}`} className={`card${soldOut ? " sold" : ""}`}>
      <div className="img">
        <img className="front" src={img.front} alt={`${p.name} ${p.color}, ${t.front}`} loading="lazy" />
        <img className="back" src={img.back} alt="" loading="lazy" aria-hidden="true" />
      </div>
      <div className="meta">
        <span className="code">{t.itemNo} {p.code}</span>
        <span>
          {p.name} [{p.color}]
        </span>
        <span className={soldOut ? "dim" : "muted"}>{soldOut ? t.soldOut : formatPrice(p.price)}</span>
        <span className="sizes" aria-label={t.sizes} dir="ltr">
          {p.sizes.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </span>
      </div>
    </Link>
  );
}
