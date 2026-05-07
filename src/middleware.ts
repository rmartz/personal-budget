import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

const FIREBASE_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

interface JwkKey {
  kid: string;
  n: string;
  e: string;
  kty: string;
  alg: string;
  use: string;
}

interface JwksResponse {
  keys: JwkKey[];
}

interface JwtHeader {
  kid?: string;
  alg?: string;
}

interface JwtPayload {
  exp?: number;
  iat?: number;
  aud?: string;
  iss?: string;
  sub?: string;
}

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
}

function isExcludedPath(pathname: string): boolean {
  return pathname.startsWith("/_next/") || pathname === "/favicon.ico";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionCookie(sessionCookie);

  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/ledgers", request.url));
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

function base64UrlDecode(input: string): string {
  return atob(input.replace(/-/g, "+").replace(/_/g, "/"));
}

async function fetchJwks(): Promise<JwksResponse> {
  const response = await fetch(FIREBASE_JWKS_URL, {
    next: { revalidate: 3600 },
  });
  return response.json() as Promise<JwksResponse>;
}

async function verifySessionCookie(
  cookie: string | undefined,
): Promise<boolean> {
  if (!cookie) return false;

  const dotIndex1 = cookie.indexOf(".");
  const dotIndex2 = cookie.lastIndexOf(".");
  if (dotIndex1 === -1 || dotIndex1 === dotIndex2) return false;

  const headerB64 = cookie.slice(0, dotIndex1);
  const payloadB64 = cookie.slice(dotIndex1 + 1, dotIndex2);
  const signatureB64 = cookie.slice(dotIndex2 + 1);

  let header: JwtHeader;
  let payload: JwtPayload;

  try {
    header = JSON.parse(base64UrlDecode(headerB64)) as JwtHeader;
    payload = JSON.parse(base64UrlDecode(payloadB64)) as JwtPayload;
  } catch {
    return false;
  }

  if (header.alg !== "RS256" || !header.kid) return false;

  const now = Math.floor(Date.now() / 1000);
  const projectId = process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"];

  if (!projectId) return false;

  if (
    !payload.exp ||
    payload.exp < now ||
    !payload.iat ||
    payload.iat > now ||
    payload.aud !== projectId ||
    payload.iss !== `https://securetoken.google.com/${projectId}` ||
    !payload.sub
  ) {
    return false;
  }

  try {
    const jwks = await fetchJwks();
    const jwk = jwks.keys.find((k) => k.kid === header.kid);
    if (!jwk) return false;

    const publicKey = await crypto.subtle.importKey(
      "jwk",
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: jwk.alg, use: jwk.use },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const signatureBytes = Uint8Array.from(base64UrlDecode(signatureB64), (c) =>
      c.charCodeAt(0),
    );
    const dataBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      signatureBytes,
      dataBytes,
    );
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth/session).*)"],
};
