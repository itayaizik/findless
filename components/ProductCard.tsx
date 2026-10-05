import Link from "next/link";
import { images, type Product } from "@/lib/products";

export default function ProductCard({ p }: { p: Product }) {
  const img = images(p);
  return (
    <Link href={`/product/${p.slug}`} className="card">
      <div className="img">
        <img className="front" src={img.front} alt={`${p.name} ${p.color}, front`} loading="lazy" />
        <img className="back" src={img.back} alt="" loading="lazy" aria-hidden="true" />
      </div>
      <div className="meta">
        <span className="code">Item no. {p.code}</span>
        <span>
          {p.name} [{p.color}]
        </span>
        <span className="muted">Coming soon</span>
        <span className="sizes">
          {p.sizes.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </span>
      </div>
    </Link>
  );
}
