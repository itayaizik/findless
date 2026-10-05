import Link from "next/link";
import { Lockup } from "./logos";
import LangSwitch from "./LangSwitch";
import { getShopAccess, getUser } from "@/lib/site";
import { getT } from "@/lib/i18n";

export default async function Header() {
  const [access, user, { t }] = await Promise.all([getShopAccess(), getUser(), getT()]);
  return (
    <>
      {access.preview && (
        <div className="preview-bar" role="status">
          {t.previewBar}
        </div>
      )}
      <header className="header">
        <Link href="/" className="logo" aria-label="FINDLESS home">
          <Lockup />
        </Link>
        <nav aria-label="Main">
          {access.visible && <Link href="/#shop">{t.navShop}</Link>}
          <Link href="/about">{t.navAbout}</Link>
          <Link href="/account">{user ? t.navAccount : t.navLogin}</Link>
          {access.admin && <Link href="/admin">{t.navAdmin}</Link>}
          <LangSwitch />
        </nav>
      </header>
    </>
  );
}
