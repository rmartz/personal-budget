import { describe, expect, it } from "vitest";

import {
  base64ToBytes,
  extractSpkiFromCertificate,
  pemCertificateToSpki,
} from "./x509-spki";

// A real Firebase session-cookie signing certificate (from the identitytoolkit
// `publicKeys` endpoint). Used only to prove the SPKI we slice out of an actual
// certificate is structurally valid — Web Crypto's importKey rejects malformed
// SPKI, so a successful import is an end-to-end check of the DER walk.
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

describe("pemCertificateToSpki", () => {
  it("extracts an SPKI that Web Crypto imports as an RSA public verify key", async () => {
    const spki = pemCertificateToSpki(FIREBASE_CERT_PEM);

    const key = await crypto.subtle.importKey(
      "spki",
      spki,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );

    expect(key.type).toBe("public");
    expect(key.algorithm.name).toBe("RSASSA-PKCS1-v1_5");
  });
});

describe("extractSpkiFromCertificate", () => {
  it("throws on truncated certificate bytes", () => {
    expect(() =>
      extractSpkiFromCertificate(new Uint8Array([0x30, 0x82, 0x01])),
    ).toThrow();
  });
});

describe("base64ToBytes", () => {
  it("decodes standard base64 to the original bytes", () => {
    // "Man" -> TWFu
    expect(Array.from(base64ToBytes("TWFu"))).toEqual([0x4d, 0x61, 0x6e]);
  });
});
