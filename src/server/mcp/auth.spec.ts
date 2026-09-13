import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/auth/resolve-identity", () => ({
  verifyBearerToken: vi.fn(),
}));

import { verifyBearerToken } from "@/server/auth/resolve-identity";

import { verifyToken } from "./auth";
import { ALL_SCOPES } from "./scopes";

const request = new Request("https://example.test/api/mcp");

afterEach(() => {
  vi.clearAllMocks();
});

describe("verifyToken", () => {
  it("returns undefined when no bearer token is provided", async () => {
    expect(await verifyToken(request, undefined)).toBeUndefined();
    expect(verifyBearerToken).not.toHaveBeenCalled();
  });

  it("returns undefined when the token is invalid", async () => {
    vi.mocked(verifyBearerToken).mockResolvedValue(undefined);
    expect(await verifyToken(request, "bad-token")).toBeUndefined();
  });

  it("carries the resolved uid in auth info extra", async () => {
    vi.mocked(verifyBearerToken).mockResolvedValue({ uid: "user-1" });
    const authInfo = await verifyToken(request, "good-token");
    expect(authInfo).toEqual({
      token: "good-token",
      clientId: "user-1",
      scopes: [...ALL_SCOPES],
      extra: { uid: "user-1" },
    });
  });
});
