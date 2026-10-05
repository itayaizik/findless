import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keeps the Supabase login session fresh on every page request.
export async function proxy(request: NextRequest) {
  // Confirmation links that land on the home page get finished at /auth/confirm.
  if (request.nextUrl.pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const to = request.nextUrl.clone();
    to.pathname = "/auth/confirm";
    return NextResponse.redirect(to);
  }
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
  if (!hasSession) return NextResponse.next();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|products/|icon.svg|favicon.ico|api/).*)"],
};
