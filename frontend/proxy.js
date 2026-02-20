import { NextResponse } from "next/server";

export function proxy(req) {
  const access = req.cookies.get("access_token")?.value;
  const url = req.nextUrl;

  // Protected routes for CUSTOMER
  const protectedUserRoutes = [
    "/user/dashboard",
    "/user/profile",
    "/user/booking",
    "/user/quote",
  ];

  if (protectedUserRoutes.some((path) => url.pathname.startsWith(path))) {
    if (!access) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/dashboard/:path*",
    "/user/profile/:path*",
    "/user/booking/:path*",
    "/user/quote/:path*",
  ],
};
