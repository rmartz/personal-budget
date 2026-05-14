import type { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

import { config, middleware } from "./middleware";

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

// ─── Criterion 1: /api/auth paths are excluded from session check ─────────────

describe("/api/auth and sub-paths are excluded from the session check", () => {
  it("allows unauthenticated requests to /api/auth through without redirecting", async () => {
    const response = await middleware(makeRequest("/api/auth"));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("allows unauthenticated requests to /api/auth/session through without redirecting", async () => {
    const response = await middleware(makeRequest("/api/auth/session"));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});

// ─── Criterion 2: config.matcher uses segment-boundary pattern ────────────────

describe("config.matcher excludes /api/auth at a segment boundary", () => {
  it("config.matcher pattern contains the segment-boundary api/auth lookahead", () => {
    expect(config.matcher[0]).toMatch(/api\/auth\(\?:\/\|\$\)/);
  });
});

// ─── Criterion 3: /api/authentication is NOT excluded ────────────────────────

describe("/api/authentication is not excluded from the session check", () => {
  it("redirects unauthenticated requests to /api/authentication to /sign-in", async () => {
    const response = await middleware(makeRequest("/api/authentication"));
    const location = response.headers.get("location");
    expect(location).toContain("/sign-in");
  });
});
