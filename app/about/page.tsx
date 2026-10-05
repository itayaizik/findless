import type { Metadata } from "next";
import { Stamp } from "@/components/logos";
import { getT } from "@/lib/i18n";

export const metadata: Metadata = { title: "About" };

export default async function About() {
  const { t } = await getT();
  return (
    <section className="page">
      <Stamp className="stamp" />
      <h1 lang="en">{t.aboutTitle}</h1>
      <p>{t.aboutP1}</p>
      <p>{t.aboutP2}</p>
    </section>
  );
}
