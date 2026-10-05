import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} FINDLESS</span>
      <span>Lost &amp; found</span>
      <nav>
        <Link href="/#shop">Shop</Link>
        <Link href="/about">About</Link>
      </nav>
    </footer>
  );
}
