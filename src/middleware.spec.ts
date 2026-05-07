import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

afterEach(() => {
  delete process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"];
  vi.restoreAllMocks();
});

function encodeBase64Url(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function makeSessionCookie(projectId: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url({ alg: "RS256", kid: "test-kid" });
  const payload = encodeBase64Url({
    exp: now + 3600,
    iat: now - 60,
    aud: projectId,
    iss: `https://securetoken.google.com/${projectId}`,
    sub: "test-user-id",
  });

  return `${header}.${payload}.c2ln`;
}

describe("middleware", () => {
  it("redirects authenticated requests from / to /ledgers", async () => {
    const projectId = "test-project-id";
    process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"] = projectId;

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: () =>
        Promise.resolve({
          keys: [
            {
              kid: "test-kid",
              n: "test-modulus",
              e: "AQAB",
              kty: "RSA",
              alg: "RS256",
              use: "sig",
            },
          ],
        }),
    } as Response);

    vi.spyOn(globalThis.crypto.subtle, "importKey").mockResolvedValue(
      {} as CryptoKey,
    );
    vi.spyOn(globalThis.crypto.subtle, "verify").mockResolvedValue(true);

    const request = new NextRequest("https://example.com/", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${makeSessionCookie(projectId)}`,
      },
    });

    const response = await middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.com/ledgers",
    );
  });
});
