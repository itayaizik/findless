import { createClient } from "@supabase/supabase-js";

// Cookie-free client for public data, so it can be cached across requests.
export function supabasePublic() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
