import { afterEach, describe, expect, it, vi } from "vitest";

import { verifySessionCookie } from "./verify-session-cookie";

const PROJECT_ID = "test-project";
const KID = "vV_zYw";

// Same real Firebase session-cookie certificate used in x509-spki.spec.ts, so
// importKey succeeds and the signature-verify path is actually reached.
const FIREBASE_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIDHDCCAgSgAwIBAgIENCWEuDANBgkqhkiG9w0BAQsFADAzMQ8wDQYDVQQDEwZH
aXRraXQxEzARBgNVBAoTCkdvb2dsZSBJbmMxCzAJBgNVBAYTAlVTMB4XDTI1MTIz
MTE4NDIyNloXDTI2MTIyNjE4NDIyNlowMzEPMA0GA1UEAxMGR2l0a2l0MRMwEQYD
VQQKEwpHb29nbGUgSW5jMQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAMgqzrXmdmwL+YupUXXj9a2xPL0uA6MdKRn/f4HjenAdcuwc
CAe+SVr5kvBtDIsdc3ueJWZmxUc13QM9UIDhKYdunMDuE+o6v/siacKAcbeNtvX6
m+kXJYaGDqfqcfg/a4EBXhj7p7xZY1EXeaXE3yVWUjL4BcNpUG1PbPHuMdZatwn1
jagPTqLG368lFiXDfokH//hqgT20mgiBWfuYuutTn8ulmNSeTPcqdwOt6v3qHfnQ
FE/YO3AB+KyLmd7o4x7IaNWWmsP3tNFWs/GZ21o+eNnJELrL08PywSly1u8nfxqS
Uhc8YcwyLswvawRHuNdegCrDXJt26ltGle/JtGkCAwEAAaM4MDYwDAYDVR0TAQH/
BAIwADAWBgNVHSUBAf8EDDAKBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMCB4AwDQYJ
KoZIhvcNAQELBQADggEBAEuDh4tp7lowvjB1QoQKIiVHQoyn8pFTkQwGwtYrpq7A
47a3WPFZ0YeWJWm9A6H4S6xH8TZiR5oOkkStcXVlO6p9ZAq6rXasw/wC+aljZTNg
7yHj5ngdnlDLdYyzDKOzlju69GrPKLhEGQLpPYr8D0LyJZA1Tlwcr7SJbOkEcFxZ
JcY1ULa0CsDw3zp1FqKS9n0f/xT9K+cEeEC1w3rUpNHZD9vGw3quRfVZk3Un545c
QvTdmGKXW6yf3QTAtwjL/Tj8bhh5bP1U4BHHfGXkL8QLTzgn5SgS6NUVzm502Wj5
j6dKEItE9z7gD1++XcZfE8dlTPDtulF8936wJpxgSqg=
-----END CERTIFICATE-----`;

function b64url(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function makeCookie(
  payloadOverrides: Record<string, unknown> = {},
  header: object = { alg: "RS256", kid: KID },
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: `https://session.firebase.google.com/${PROJECT_ID}`,
    aud: PROJECT_ID,
    exp: now + 3600,
    iat: now - 10,
    sub: "uid-1",
    ...payloadOverrides,
  };
  return `${b64url(header)}.${b64url(payload)}.c2lnbmF0dXJl`;
}

function stubCertFetch(): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ [KID]: FIREBASE_CERT_PEM }),
    }),
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("verifySessionCookie — structural / input rejections", () => {
  it("rejects an undefined cookie", async () => {
    expect(await verifySessionCookie(undefined, PROJECT_ID)).toBe(false);
  });

  it("rejects an undefined projectId", async () => {
    expect(await verifySessionCookie(makeCookie(), undefined)).toBe(false);
  });

  it("rejects a cookie that is not three dot-separated parts", async () => {
    expect(await verifySessionCookie("only.two", PROJECT_ID)).toBe(false);
  });

  it("rejects a non-RS256 header", async () => {
    const cookie = makeCookie({}, { alg: "HS256", kid: KID });
    expect(await verifySessionCookie(cookie, PROJECT_ID)).toBe(false);
  });
});

describe("verifySessionCookie — claim rejections", () => {
  it("rejects the ID-token issuer (securetoken) — the bug in #366", async () => {
    const cookie = makeCookie({
      iss: `https://securetoken.google.com/${PROJECT_ID}`,
    });
    expect(await verifySessionCookie(cookie, PROJECT_ID)).toBe(false);
  });

  it("rejects a wrong audience", async () => {
    expect(
      await verifySessionCookie(makeCookie({ aud: "other" }), PROJECT_ID),
    ).toBe(false);
  });

  it("rejects an expired cookie", async () => {
    const now = Math.floor(Date.now() / 1000);
    expect(
      await verifySessionCookie(makeCookie({ exp: now - 10 }), PROJECT_ID),
    ).toBe(false);
  });

  it("rejects a cookie issued in the future", async () => {
    const now = Math.floor(Date.now() / 1000);
    expect(
      await verifySessionCookie(makeCookie({ iat: now + 600 }), PROJECT_ID),
    ).toBe(false);
  });

  it("rejects a cookie with no subject", async () => {
    expect(
      await verifySessionCookie(makeCookie({ sub: undefined }), PROJECT_ID),
    ).toBe(false);
  });
});

describe("verifySessionCookie — signature path", () => {
  it("rejects when no certificate matches the header kid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: () => Promise.resolve({}) }),
    );
    expect(await verifySessionCookie(makeCookie(), PROJECT_ID)).toBe(false);
  });

  it("rejects a valid-claims cookie whose signature does not verify", async () => {
    stubCertFetch();
    // Real crypto.subtle.verify over the bogus signature returns false.
    expect(await verifySessionCookie(makeCookie(), PROJECT_ID)).toBe(false);
  });

  it("accepts a cookie with valid claims and a valid signature", async () => {
    stubCertFetch();
    vi.spyOn(crypto.subtle, "verify").mockResolvedValue(true);
    expect(await verifySessionCookie(makeCookie(), PROJECT_ID)).toBe(true);
  });

  it("accepts a valid-claims cookie whose header base64url length requires padding", async () => {
    stubCertFetch();
    vi.spyOn(crypto.subtle, "verify").mockResolvedValue(true);
    // { alg: "RS256", kid: KID, extra: 1 } → 40-byte JSON → 54-char base64url (54 % 4 === 2),
    // so atob() needs "==" padding restored before decoding.
    const now = Math.floor(Date.now() / 1000);
    const header = b64url({ alg: "RS256", kid: KID, extra: 1 });
    const payload = b64url({
      aud: PROJECT_ID,
      exp: now + 3600,
      iat: now - 10,
      iss: `https://session.firebase.google.com/${PROJECT_ID}`,
      sub: "uid-1",
    });
    expect(
      await verifySessionCookie(`${header}.${payload}.c2lnbmF0dXJl`, PROJECT_ID),
    ).toBe(true);
  });
});
