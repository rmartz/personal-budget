import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/admin", () => ({
  getAdminAuth: vi.fn(),
}));

import { getAdminAuth } from "@/lib/firebase/admin";

import { resolveIdentity, verifyBearerToken } from "./resolve-identity";

const verifyIdToken = vi.fn();
const verifySessionCookie = vi.fn();

beforeEach(() => {
  vi.mocked(getAdminAuth).mockReturnValue({
    verifyIdToken,
    verifySessionCookie,
  } as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("verifyBearerToken", () => {
  it("resolves a valid id token to its uid", async () => {
    verifyIdToken.mockResolvedValue({ uid: "user-1" });
    expect(await verifyBearerToken("id-token")).toEqual({ uid: "user-1" });
    expect(verifyIdToken).toHaveBeenCalledWith("id-token");
  });

  it("returns undefined when verification throws", async () => {
    verifyIdToken.mockRejectedValue(new Error("expired"));
    expect(await verifyBearerToken("id-token")).toBeUndefined();
  });
});

describe("resolveIdentity", () => {
  it("resolves a bearer id token from the Authorization header", async () => {
    verifyIdToken.mockResolvedValue({ uid: "user-1" });
    const request = new Request("https://example.test/api/mcp", {
      headers: { authorization: "Bearer id-token" },
    });
    expect(await resolveIdentity(request)).toEqual({ uid: "user-1" });
  });

  it("resolves a session cookie when there is no bearer token", async () => {
    verifySessionCookie.mockResolvedValue({ uid: "user-2" });
    const request = new Request("https://example.test/api/ledgers", {
      headers: { cookie: "other=1; session=cookie-value" },
    });
    expect(await resolveIdentity(request)).toEqual({ uid: "user-2" });
    expect(verifySessionCookie).toHaveBeenCalledWith("cookie-value", true);
  });

  it("returns undefined when no credentials are present", async () => {
    const request = new Request("https://example.test/api/ledgers");
    expect(await resolveIdentity(request)).toBeUndefined();
  });
});
