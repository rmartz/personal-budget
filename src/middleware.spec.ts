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

function makeRequest(pathname: string, sessionCookie: string): NextRequest {
  return {
    url: `https://example.com${pathname}`,
    nextUrl: new URL(`https://example.com${pathname}`),
    cookies: {
      get(name: string) {
        if (name === SESSION_COOKIE_NAME) {
          return { value: sessionCookie };
        }
        return undefined;
      },
    },
  } as NextRequest;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("middleware", () => {
  it("redirects authenticated users from auth routes directly to /ledgers", async () => {
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

    const response = await middleware(
      makeRequest("/sign-in", makeSessionCookie()),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });

  it("redirects authenticated users from /sign-up directly to /ledgers", async () => {
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

    const response = await middleware(
      makeRequest("/sign-up", makeSessionCookie()),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });
});
