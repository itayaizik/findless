import Link from "next/link";
import A11yOpen from "./A11yOpen";
import { getT } from "@/lib/i18n";

export default async function Footer() {
  const { t } = await getT();
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span dir="ltr">© {new Date().getFullYear()} FINDLESS</span>
        <span lang="en" dir="ltr">{t.footerTag}</span>
      </div>
      <nav aria-label="Footer">
        <Link href="/about">{t.navAbout}</Link>
        <Link href="/terms">{t.footerTerms}</Link>
        <Link href="/privacy">{t.footerPrivacy}</Link>
        <A11yOpen label={t.footerA11yMenu} />
        <Link href="/accessibility">{t.footerA11yStatement}</Link>
      </nav>
    </footer>
  );
}
