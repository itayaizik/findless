import ModelLogo from "@/components/ModelLogo";
import { Stamp } from "@/components/logos";
import Countdown from "@/components/Countdown";
import SignupForm from "@/components/SignupForm";
import ProductCard from "@/components/ProductCard";
import { getDrop, getNext, getSettings, getShopAccess } from "@/lib/site";
import NextCard from "@/components/NextCard";
import Reveal from "@/components/Reveal";
import { fill, getT } from "@/lib/i18n";

export default async function Home() {
  const [{ dropAt, heroLogo, heroText }, access, { t }] = await Promise.all([getSettings(), getShopAccess(), getT()]);
  const open = access.mode === "open";
  const logo =
    heroLogo === "stamp" ? <Stamp className="stamp" /> : <ModelLogo project={heroLogo} className="stamp" />;

  return (
    <>
      {open ? (
        <section className={`hero hero-open${heroText === "white" ? " hero-white" : ""}`}>
          {logo}
          <h1>{t.heroOpen}</h1>
          <p className="tagline">{t.tagline}</p>
          <a href="#shop" className="link">
            {t.heroShop}
          </a>
        </section>
      ) : (
        <section className={`hero${heroText === "white" ? " hero-white" : ""}`}>
          {logo}
          <h1>{t.heroSoon}</h1>
          <Countdown dropAt={dropAt} />
          <SignupForm source="home" />
          <p className="tagline">{t.tagline}</p>
        </section>
      )}

      {access.visible && <Shop />}
      <Next />
      <Reveal />
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

async function Next() {
  const [items, { t }] = await Promise.all([getNext(), getT()]);
  if (items.length === 0) return null;
  const labels = { nextLike: t.nextLike, nextDislike: t.nextDislike, nextThanks: t.nextThanks, nextHint: t.nextHint };
  return (
    <section id="next" aria-labelledby="next-h" className="next">
      <div className="section-head">
        <h2 id="next-h">{t.nextHead}</h2>
        <span className="muted">{t.nextNote}</span>
      </div>
      <div className="grid next-grid">
        {items.map((p) => (
          <NextCard key={p.slug} slug={p.slug} name={p.name} color={p.color} image={p.images[0]} clear={p.images[1]} t={labels} />
        ))}
      </div>
    </section>
  );
}
