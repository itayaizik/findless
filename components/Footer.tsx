import Link from "next/link";
import A11yOpen from "./A11yOpen";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} FINDLESS</span>
      <span>Lost &amp; found</span>
      <nav aria-label="Footer">
        <Link href="/about">About</Link>
        <A11yOpen />
        <Link href="/accessibility" lang="he">
          הצהרת נגישות
        </Link>
      </nav>
    </footer>
  );
}
