import Link from "next/link";
import { Lockup } from "./logos";

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="logo" aria-label="FINDLESS home">
        <Lockup />
      </Link>
      <nav>
        <Link href="/#shop">Shop</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
