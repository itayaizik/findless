import Link from "next/link";
import { Stamp } from "@/components/logos";

export default function NotFound() {
  return (
    <section className="page">
      <Stamp className="stamp" />
      <span className="muted">404</span>
      <h1>Lost? So are we.</h1>
      <Link href="/" className="link">
        Back to found
      </Link>
    </section>
  );
}
