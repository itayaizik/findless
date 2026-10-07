import { getIsAdmin } from "@/lib/site";
import { supabaseServer } from "@/lib/supabase/server";

// CSV download of orders or the waitlist, for Excel / Google Sheets.
export async function GET(req: Request) {
  if (!(await getIsAdmin())) return new Response("Not found", { status: 404 });
  const type = new URL(req.url).searchParams.get("type") === "waitlist" ? "waitlist" : "orders";
  const supabase = await supabaseServer();

  const { data, error } =
    type === "orders"
      ? await supabase
          .from("orders")
          .select("id, created_at, product_slug, size, price_ils, name, phone, email, note, status, admin_note")
          .order("created_at", { ascending: false })
      : await supabase.from("subscribers").select("email, source, created_at").order("created_at", { ascending: false });
  if (error) return new Response(error.message, { status: 500 });

  const rows = (data ?? []) as Record<string, unknown>[];
  const cols = rows[0] ? Object.keys(rows[0]) : [];
  // Cells starting with = + - @ would run as formulas in Excel, so they get a leading quote.
  const cell = (v: unknown) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="findless-${type}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
