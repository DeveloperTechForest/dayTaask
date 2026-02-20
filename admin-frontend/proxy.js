// middleware.js
import { NextResponse } from "next/server";

/**
 * Protect admin routes: if access_token cookie missing -> redirect to /auth/login
 * The actual role enforcement happens after user reload in AuthContext.
 */

export function proxy(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Adjust the matcher paths you want to protect
  const protectedPaths = [
    "/dashboard",
    "/users",
    "/services",
    "/bookings",
    "/payments",
    "/reports",
    "/settings",
    // any other admin top-level routes
  ];

  const needsProtection = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!needsProtection) return NextResponse.next();

  const access = req.cookies.get("access_token")?.value;
  if (!access) {
    // redirect to admin login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// If you prefer, use matcher in this file instead of next.config
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/services/:path*",
    "/bookings/:path*",
    "/payments/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
