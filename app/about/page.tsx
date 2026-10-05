import type { Metadata } from "next";
import { Stamp } from "@/components/logos";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <section className="page">
      <Stamp className="stamp" />
      <h1>Lost &amp; found</h1>
      <p>We couldn&apos;t find clothes we liked, so we made them.</p>
      <p>Orders: pick your size, leave a phone or email, and we send you a Bit link to pay.</p>
    </section>
  );
}
