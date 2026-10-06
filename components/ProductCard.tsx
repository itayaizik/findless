import Link from "next/link";
import { formatPrice, isSoldOut, type CatalogItem } from "@/lib/site";
import type { Dict } from "@/lib/dict";

export default function ProductCard({ p, t, eager }: { p: CatalogItem; t: Dict; eager?: boolean }) {
  const [front, back] = p.images;
  const soldOut = isSoldOut(p);
  return (
    <Link href={`/product/${p.slug}`} className={`card${soldOut ? " sold" : ""}`}>
      <div className="img">
        {front && (
          <img className="front" src={front} alt={`${p.name} ${p.color}, ${t.front}`} loading={eager ? "eager" : "lazy"} decoding="async" />
        )}
        {back && <img className="back" src={back} alt="" loading="lazy" decoding="async" aria-hidden="true" />}
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
