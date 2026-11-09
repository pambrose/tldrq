import { createServerClient } from "@supabase/ssr";
import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const RETRY_AFTER_SECONDS = 30;

const UNAVAILABLE_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="${RETRY_AFTER_SECONDS}">
    <title>tldrq.com</title>
  </head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#030712;color:#9ca3af;font-family:system-ui,sans-serif;text-align:center;padding:0 1rem">
    <p>tldrq.com is temporarily unavailable. This page will retry automatically.</p>
  </body>
</html>`;

// Supabase couldn't say who the user is, which is different from them being signed out.
function serviceUnavailable(pathname: string) {
  const retryAfter = { "Retry-After": String(RETRY_AFTER_SECONDS) };

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503, headers: retryAfter }
    );
  }

  return new NextResponse(UNAVAILABLE_PAGE, {
    status: 503,
    headers: { ...retryAfter, "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — important for Server Components
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Allow public routes without auth
  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/share/");

  if (!user && !isPublicRoute) {
    if (isAuthRetryableFetchError(error)) {
      return serviceUnavailable(pathname);
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
