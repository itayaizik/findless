import { hitRate } from "@/lib/rate";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "Bad request" }, 400);

  // Honeypot: bots fill the hidden "website" field. Pretend it worked.
  if (body.website) return json({ ok: true });

  const email = String(body.email ?? "").trim().toLowerCase();
  const source = String(body.source ?? "home").slice(0, 64);
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ error: "That email doesn't look right." }, 400);
  }

  const rate = await hitRate("subscribe");
  if (rate !== "ok") return json({ error: "Too many tries. Wait a bit and try again." }, 429);

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return json({ error: "Signups aren't open yet." }, 503);

  const res = await fetch(`${url}/rest/v1/subscribers`, {
    method: "POST",
    headers: {
      apikey: key,
      // Legacy anon keys are JWTs and also go in Authorization; sb_publishable_ keys must not.
      ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ email, source }),
  });

  if (res.status === 409) return json({ ok: true, already: true });
  if (!res.ok) {
    console.error("subscribe insert failed", res.status, await res.text());
    return json({ error: "Something went wrong. Try again." }, 500);
  }

  await sendWelcome(email);
  return json({ ok: true });
}

// Sends only once a verified sending domain is set up. The resend.dev test sender can only
// reach the account owner, so customer emails wait for findless.co.il.
async function sendWelcome(to: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || from.includes("resend.dev")) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject: "you're on the list",
      html: `<div style="background:#0a0a0a;color:#e6dcc6;font-family:monospace;padding:40px;text-align:center">
<p style="font-size:40px;margin:0 0 16px">失</p>
<p style="letter-spacing:.1em">FINDLESS</p>
<p>you're on the list. first drop soon, you hear it first.</p>
<p style="color:#8b8577">couldn't find clothes we liked, so we made them.</p>
</div>`,
    }),
  });
  if (!res.ok) console.error("welcome email failed", res.status, await res.text());
}
