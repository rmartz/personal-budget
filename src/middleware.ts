import { NextRequest, NextResponse } from "next/server";

import { verifySessionCookie } from "@/lib/auth/verify-session-cookie";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

function isAuthRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password")
  );
}

function isExcludedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/api/auth" ||
    pathname.startsWith("/api/auth/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionCookie(
    sessionCookie,
    process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
  );

  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/ledgers", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/ledgers", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth(?:/|$)).*)"],
};
