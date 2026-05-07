import { afterEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";
import { middleware } from "./middleware";

function makeSessionCookie(): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", kid: "kid-123" }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      exp: now + 3600,
      iat: now - 60,
      aud: "test-project-id",
      iss: "https://securetoken.google.com/test-project-id",
      sub: "uid-123",
    }),
  ).toString("base64url");

  return `${header}.${payload}.c2ln`;
}

function makeRequest(pathname: string, sessionCookie?: string): NextRequest {
  return {
    url: `https://example.com${pathname}`,
    nextUrl: new URL(`https://example.com${pathname}`),
    cookies: {
      get(name: string) {
        if (name === SESSION_COOKIE_NAME && sessionCookie !== undefined) {
          return { value: sessionCookie };
        }
        return undefined;
      },
    },
  } as NextRequest;
}

function mockAuthenticatedCrypto() {
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "test-project-id");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          keys: [
            {
              kid: "kid-123",
              n: "test-n",
              e: "AQAB",
              kty: "RSA",
              alg: "RS256",
              use: "sig",
            },
          ],
        }),
    }),
  );
  vi.stubGlobal("crypto", {
    subtle: {
      importKey: vi.fn().mockResolvedValue({}),
      verify: vi.fn().mockResolvedValue(true),
    },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("middleware", () => {
  it("allows unauthenticated requests to / through without redirecting", async () => {
    const response = await middleware(makeRequest("/"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects authenticated requests from / to /ledgers", async () => {
    mockAuthenticatedCrypto();

    const response = await middleware(makeRequest("/", makeSessionCookie()));

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });

  it("redirects authenticated users from auth routes directly to /ledgers", async () => {
    mockAuthenticatedCrypto();

    const response = await middleware(
      makeRequest("/sign-in", makeSessionCookie()),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });

  it("redirects authenticated users from /sign-up directly to /ledgers", async () => {
    mockAuthenticatedCrypto();

    const response = await middleware(
      makeRequest("/sign-up", makeSessionCookie()),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });

  it("redirects authenticated users from /forgot-password directly to /ledgers", async () => {
    mockAuthenticatedCrypto();

    const response = await middleware(
      makeRequest("/forgot-password", makeSessionCookie()),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });
});
