import Link from "next/link";
import { Stamp } from "@/components/logos";
import { getT } from "@/lib/i18n";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <section className="page">
      <Stamp className="stamp" />
      <span className="muted">404</span>
      <h1>{t.nfTitle}</h1>
      <Link href="/" className="link">
        {t.nfBack}
      </Link>
    </section>
  );
}
