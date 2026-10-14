import { createHash } from "node:crypto";
import { supabasePublic } from "@/lib/supabase/public";

// Like / dislike on a NEXT teaser. One vote per visitor (hashed IP) per product;
// voting again changes it and 0 takes it back.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const slug = String(body?.slug ?? "").slice(0, 80);
  const vote = Number(body?.vote);
  if (!slug || ![-1, 0, 1].includes(vote)) return Response.json({ error: "Bad request" }, { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  if (!ip) return Response.json({ error: "Bad request" }, { status: 400 });
  const voter = createHash("sha256").update(`vote:${ip}`).digest("hex").slice(0, 40);

  const { error } = await supabasePublic().rpc("vote_next", { p_slug: slug, p_voter: voter, p_vote: vote });
  if (error) {
    if (error.message.includes("not_available")) return Response.json({ error: "Gone" }, { status: 404 });
    console.error("vote_next failed", error);
    return Response.json({ error: "Try again" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
