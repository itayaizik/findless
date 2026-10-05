import type { Metadata } from "next";
import { Stamp } from "@/components/logos";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <section className="page">
      <Stamp className="stamp" />
      <h1>Lost &amp; found</h1>
      <p>We couldn&apos;t find clothes we liked, so we made them.</p>
      <p>Everything is preorder: pick your size, leave a phone or email, and we send you a link to pay with Bit (or PayBox).</p>
    </section>
  );
}
