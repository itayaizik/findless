import { Stamp } from "@/components/logos";
import Countdown from "@/components/Countdown";
import SignupForm from "@/components/SignupForm";
import ProductCard from "@/components/ProductCard";
import { getCatalog, getSettings, getShopAccess } from "@/lib/site";

export default async function Home() {
  const [{ dropAt }, access] = await Promise.all([getSettings(), getShopAccess()]);
  const open = access.mode === "open";

  return (
    <>
      {open ? (
        <section className="hero hero-open">
          <Stamp className="stamp" />
          <h1>Drop 001 is out</h1>
          <p className="tagline">couldn&apos;t find clothes we liked, so we made them.</p>
          <a href="#shop" className="link">
            Shop the drop
          </a>
        </section>
      ) : (
        <section className="hero">
          <Stamp className="stamp" />
          <h1>First drop soon</h1>
          <Countdown dropAt={dropAt} />
          <SignupForm source="home" />
          <p className="tagline">couldn&apos;t find clothes we liked, so we made them.</p>
        </section>
      )}

      {access.visible && <Shop />}
    </>
  );
}

async function Shop() {
  const items = await getCatalog();
  return (
    <section id="shop" aria-label="Shop">
      <div className="section-head">
        <span>Drop 001 · {items.length} items</span>
        <span className="muted">Order now, pay with Bit</span>
      </div>
      <div className="grid">
        {items.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}
