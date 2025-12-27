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

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // PWA-related files and public paths that don't require authentication
  const publicPaths = [
    "/sw.js",
    "/manifest.json",
    "/manifest.webmanifest",
    "/site.webmanifest",
    "/robots.txt",
    "/sitemap.xml",
  ];

  // Auth-related paths that logged-in users should be redirected from
  const authPaths = ["/", "/login", "/sign-up"];

  // Check if current path is in public paths
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path
  );

  // Check if path is for PWA icons or assets
  const isPWAAsset =
    /^\/(icon-|apple-touch-icon|android-chrome-|favicon)/i.test(
      request.nextUrl.pathname
    );

  // Check if path is blog or blog subroute
  const isBlogPath = request.nextUrl.pathname.startsWith("/blog");

  // Allow access to public paths and PWA assets
  if (isPublicPath || isPWAAsset) {
    return response;
  }

  // Allow access to blog for everyone
  if (isBlogPath) {
    return response;
  }

  // Redirect logged-in users from auth pages to /browse
  if (user && authPaths.includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/browse";
    return NextResponse.redirect(url);
  }

  // Redirect to root if not authenticated and trying to access protected routes
  if (!user && !authPaths.includes(request.nextUrl.pathname)) {
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
