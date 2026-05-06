import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

const PROJECT_ID = "test-project";

function makeRequest(url: string, sessionCookie?: string): NextRequest {
  const headers = new Headers();
  if (sessionCookie) {
    headers.set("cookie", `session=${sessionCookie}`);
  }
  return new NextRequest(url, { headers });
}

function makeValidJwt(): string {
  const header = { alg: "RS256", kid: "test-kid" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    exp: now + 3600,
    iat: now - 60,
    aud: PROJECT_ID,
    iss: `https://securetoken.google.com/${PROJECT_ID}`,
    sub: "user-uid-123",
  };
  const toBase64Url = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  // AAAA is valid base64url (decodes to 3 zero bytes); actual bytes don't matter
  // since crypto.subtle.verify is mocked to return true
  return `${toBase64Url(header)}.${toBase64Url(payload)}.AAAA`;
}

describe("middleware", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", PROJECT_ID);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe("excluded paths", () => {
    it("passes through /_next/ paths without checking authentication", async () => {
      const request = makeRequest("http://localhost/_next/static/chunk.js");
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it("passes through /api/auth/ paths without checking authentication", async () => {
      const request = makeRequest("http://localhost/api/auth/session");
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it("passes through bare /api/auth path without checking authentication", async () => {
      const request = makeRequest("http://localhost/api/auth");
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });
  });

  describe("unauthenticated user", () => {
    it("redirects to /sign-in with next parameter for protected routes", async () => {
      const request = makeRequest("http://localhost/dashboard");
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain(
        "/sign-in?next=%2Fdashboard",
      );
    });

    it("preserves query string in the next parameter", async () => {
      const request = makeRequest(
        "http://localhost/dashboard?tab=summary&view=monthly",
      );
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain(
        "next=%2Fdashboard%3Ftab%3Dsummary%26view%3Dmonthly",
      );
    });

    it("allows unauthenticated access to /sign-in", async () => {
      const request = makeRequest("http://localhost/sign-in");
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it("allows unauthenticated access to /sign-up", async () => {
      const request = makeRequest("http://localhost/sign-up");
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it("allows unauthenticated access to /forgot-password", async () => {
      const request = makeRequest("http://localhost/forgot-password");
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });
  });

  describe("authenticated user", () => {
    const mockJwks = {
      keys: [
        {
          kid: "test-kid",
          kty: "RSA",
          n: "mockn",
          e: "AQAB",
          alg: "RS256",
          use: "sig",
        },
      ],
    };

    beforeEach(() => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve(mockJwks),
        }),
      );
      vi.spyOn(globalThis.crypto.subtle, "importKey").mockResolvedValue(
        {} as CryptoKey,
      );
      vi.spyOn(globalThis.crypto.subtle, "verify").mockResolvedValue(true);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("allows authenticated access to protected routes", async () => {
      const request = makeRequest("http://localhost/dashboard", makeValidJwt());
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it("redirects to / when authenticated user visits /sign-in", async () => {
      const request = makeRequest("http://localhost/sign-in", makeValidJwt());
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/");
    });

    it("redirects to / when authenticated user visits /sign-up", async () => {
      const request = makeRequest("http://localhost/sign-up", makeValidJwt());
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/");
    });

    it("redirects to / when authenticated user visits /forgot-password", async () => {
      const request = makeRequest(
        "http://localhost/forgot-password",
        makeValidJwt(),
      );
      const response = await middleware(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/");
    });
  });
});
