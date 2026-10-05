import Link from "next/link";
import { Lockup } from "./logos";
import { getShopAccess, getUser } from "@/lib/site";

export default async function Header() {
  const [access, user] = await Promise.all([getShopAccess(), getUser()]);
  return (
    <>
      {access.preview && (
        <div className="preview-bar" role="status">
          Preview · site is in waitlist mode · only admins see the shop
        </div>
      )}
      <header className="header">
        <Link href="/" className="logo" aria-label="FINDLESS home">
          <Lockup />
        </Link>
        <nav aria-label="Main">
          {access.visible && <Link href="/#shop">Shop</Link>}
          <Link href="/about">About</Link>
          <Link href="/account">{user ? "Account" : "Log in"}</Link>
          {access.admin && <Link href="/admin">Admin</Link>}
        </nav>
      </header>
    </>
  );
}
