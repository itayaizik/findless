import { Stamp } from "@/components/logos";
import Countdown from "@/components/Countdown";
import SignupForm from "@/components/SignupForm";
import ProductCard from "@/components/ProductCard";
import { getDrop, getSettings, getShopAccess } from "@/lib/site";
import { fill, getT } from "@/lib/i18n";

export default async function Home() {
  const [{ dropAt }, access, { t }] = await Promise.all([getSettings(), getShopAccess(), getT()]);
  const open = access.mode === "open";

  return (
    <>
      {open ? (
        <section className="hero hero-open">
          <Stamp className="stamp" />
          <h1>{t.heroOpen}</h1>
          <p className="tagline">{t.tagline}</p>
          <a href="#shop" className="link">
            {t.heroShop}
          </a>
        </section>
      ) : (
        <section className="hero">
          <Stamp className="stamp" />
          <h1>{t.heroSoon}</h1>
          <Countdown dropAt={dropAt} />
          <SignupForm source="home" />
          <p className="tagline">{t.tagline}</p>
        </section>
      )}

      {access.visible && <Shop />}
    </>
  );
}

async function Shop() {
  const [items, { t }] = await Promise.all([getDrop(), getT()]);
  return (
    <section id="shop" aria-label={t.shopLabel}>
      <div className="section-head">
        <span>{items.length === 1 ? t.shopHeadOne : fill(t.shopHead, { n: items.length })}</span>
        <span className="muted">{t.shopNote}</span>
      </div>
      <div className={items.length === 1 ? "grid single" : "grid"}>
        {items.map((p, i) => (
          <ProductCard key={p.slug} p={p} t={t} eager={i < 4} />
        ))}
      </div>
    </section>
  );
}
