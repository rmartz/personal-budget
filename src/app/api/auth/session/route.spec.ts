import { FirebaseAuthError } from "firebase-admin/auth";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/admin", () => ({
  getAdminAuth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

import { getAdminAuth } from "@/lib/firebase/admin";

import { POST } from "./route";

const createSessionCookie = vi.fn();
const setCookie = vi.fn();

function makeSessionRequest(idToken: string): NextRequest {
  return new NextRequest("http://localhost/api/auth/session", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

beforeEach(() => {
  vi.mocked(getAdminAuth).mockReturnValue({ createSessionCookie } as never);
  vi.mocked(cookies).mockResolvedValue({ set: setCookie } as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/session", () => {
  it("sets the session cookie for a valid id token", async () => {
    createSessionCookie.mockResolvedValue("session-cookie-value");
    await POST(makeSessionRequest("valid-token"));
    expect(setCookie).toHaveBeenCalledWith(
      expect.any(String),
      "session-cookie-value",
      expect.any(Object),
    );
  });

  it.each(["id-token-expired", "id-token-revoked", "invalid-id-token"])(
    "returns 401 when Firebase rejects the id token with %s",
    async (code) => {
      createSessionCookie.mockRejectedValue(
        new FirebaseAuthError({ code, message: "bad token" }),
      );
      const response = await POST(makeSessionRequest("bad-token"));
      expect(response.status).toBe(401);
    },
  );

  it("rethrows a FirebaseAuthError that is not a token rejection", async () => {
    const permissionError = new FirebaseAuthError({
      code: "insufficient-permission",
      message: "admin credential lacks permission",
    });
    createSessionCookie.mockRejectedValue(permissionError);
    await expect(POST(makeSessionRequest("valid-token"))).rejects.toBe(
      permissionError,
    );
  });

  it("rethrows errors that are not token rejections", async () => {
    const configError = new Error(
      "Service account object must contain a project_id",
    );
    createSessionCookie.mockRejectedValue(configError);
    await expect(POST(makeSessionRequest("valid-token"))).rejects.toBe(
      configError,
    );
  });
});
