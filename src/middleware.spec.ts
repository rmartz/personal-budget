import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { verifySessionCookie } from "@/lib/auth/verify-session-cookie";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

import { config, middleware } from "./middleware";

// Session-cookie verification (X.509 keys, signature) is exercised in
// verify-session-cookie.spec.ts / x509-spki.spec.ts. Here we mock it to a
// boolean so these tests cover only the routing decisions.
vi.mock("@/lib/auth/verify-session-cookie", () => ({
  verifySessionCookie: vi.fn(),
}));

function setAuthenticated(value: boolean): void {
  vi.mocked(verifySessionCookie).mockResolvedValue(value);
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

beforeEach(() => {
  setAuthenticated(false);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("middleware", () => {
  it("allows unauthenticated requests to / through without redirecting", async () => {
    const response = await middleware(makeRequest("/"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects authenticated requests from / to /ledgers", async () => {
    setAuthenticated(true);

    const response = await middleware(makeRequest("/", "session-cookie"));

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });

  it("redirects authenticated users from /sign-in directly to /ledgers", async () => {
    setAuthenticated(true);

    const response = await middleware(
      makeRequest("/sign-in", "session-cookie"),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });

  it("redirects authenticated users from /sign-up directly to /ledgers", async () => {
    setAuthenticated(true);

    const response = await middleware(
      makeRequest("/sign-up", "session-cookie"),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });

  it("redirects authenticated users from /forgot-password directly to /ledgers", async () => {
    setAuthenticated(true);

    const response = await middleware(
      makeRequest("/forgot-password", "session-cookie"),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });

  it("allows unauthenticated users through to auth routes", async () => {
    const response = await middleware(makeRequest("/sign-in"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects unauthenticated requests for a protected route to /sign-in with next", async () => {
    const response = await middleware(makeRequest("/ledgers"));

    const location = response.headers.get("location");
    expect(location).toContain("/sign-in");
    expect(location).toContain("next=%2Fledgers");
  });

  it("allows authenticated requests to a protected route through", async () => {
    setAuthenticated(true);

    const response = await middleware(
      makeRequest("/ledgers", "session-cookie"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});

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

describe("config.matcher excludes /api/auth at a segment boundary", () => {
  it("config.matcher pattern contains the segment-boundary api/auth lookahead", () => {
    expect(config.matcher[0]).toMatch(/api\/auth\(\?:\/\|\$\)/);
  });
});

describe("/api/authentication is not excluded from the session check", () => {
  it("redirects unauthenticated requests to /api/authentication to /sign-in", async () => {
    const response = await middleware(makeRequest("/api/authentication"));
    const location = response.headers.get("location");
    expect(location).toContain("/sign-in");
  });
});
