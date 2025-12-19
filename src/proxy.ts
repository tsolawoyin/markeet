// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  // Add cache control headers to prevent SW caching issues on iOS
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          // Re-apply cache control headers
          response.headers.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, proxy-revalidate"
          );
          response.headers.set("Pragma", "no-cache");
          response.headers.set("Expires", "0");

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - this is critical for SSR
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // PWA-related files and public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/sign-up",
    "/sw.js",
    "/manifest.json",
    "/manifest.webmanifest",
    "/site.webmanifest",
    "/robots.txt",
    "/sitemap.xml",
  ];

  // Check if current path is in public paths
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path
  );

  // Check if path is for PWA icons or assets
  const isPWAAsset =
    /^\/(icon-|apple-touch-icon|android-chrome-|favicon)/i.test(
      request.nextUrl.pathname
    );

  // Allow access without authentication
  if (isPublicPath || isPWAAsset) {
    return response;
  }

  // Redirect to root if not authenticated
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
  ],
};
