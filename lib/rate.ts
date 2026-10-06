import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { supabasePublic } from "./supabase/public";

export type RateResult = "ok" | "too_fast" | "slow_down";

// Gentle limit per visitor: one try every few seconds, and after 20 tries in a day
// one every 10 minutes (rules live in the hit_rate function in Supabase).
// The IP is hashed before it is stored.
export async function hitRate(scope: string): Promise<RateResult> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "";
  if (!ip) return "ok";
  const key = createHash("sha256").update(`${scope}:${ip}`).digest("hex").slice(0, 40);
  const { data, error } = await supabasePublic().rpc("hit_rate", { p_key: key });
  if (error) {
    console.error("hit_rate failed", error);
    return "ok";
  }
  return (data as RateResult) ?? "ok";
}
