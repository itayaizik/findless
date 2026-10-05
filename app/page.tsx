import { Stamp } from "@/components/logos";
import Countdown from "@/components/Countdown";
import SignupForm from "@/components/SignupForm";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <>
      <section className="hero">
        <Stamp className="stamp" />
        <h1>First drop soon</h1>
        <Countdown />
        <SignupForm source="home" />
        <p className="tagline">couldn&apos;t find clothes we liked, so we made them.</p>
      </section>

      <section id="shop">
        <div className="section-head">
          <span>Drop 001 · {products.length} items</span>
          <span className="muted">Status: coming soon</span>
        </div>
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
