import Link from "next/link";
import A11yOpen from "./A11yOpen";
import LangSwitch from "./LangSwitch";
import { getT } from "@/lib/i18n";

export default async function Footer() {
  const { t } = await getT();
  return (
    <footer className="footer">
      <div className="footer-main" dir="ltr">
        <span dir="ltr">© {new Date().getFullYear()} FINDLESS</span>
        <span lang="en" dir="ltr" className="footer-tag">
          {t.footerTag}
        </span>
        <Link href="/about" className="footer-end">
          {t.navAbout}
        </Link>
      </div>
      <nav aria-label="Footer" className="footer-legal">
        <Link href="/terms">{t.footerTerms}</Link>
        <Link href="/privacy">{t.footerPrivacy}</Link>
        <A11yOpen label={t.footerA11yMenu} />
        <Link href="/accessibility">{t.footerA11yStatement}</Link>
        <LangSwitch />
      </nav>
    </footer>
  );
}
