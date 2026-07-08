/**
 * Verify a Firebase **session cookie** (minted by `admin.auth().createSessionCookie`)
 * in the Edge runtime, without firebase-admin.
 *
 * Session cookies are NOT verified like ID tokens (issue #366):
 *   - issuer: `https://session.firebase.google.com/{projectId}` (not securetoken)
 *   - signing keys: X.509 PEM certificates at the identitytoolkit `publicKeys`
 *     endpoint (not the securetoken JWK set)
 *
 * They are otherwise RS256 JWTs, so we validate the standard claims and verify
 * the signature against the certificate's public key (via {@link pemCertificateToSpki}).
 */

import { base64ToBytes, pemCertificateToSpki } from "./x509-spki";

const SESSION_PUBLIC_KEYS_URL =
  "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys";
const SESSION_ISSUER_PREFIX = "https://session.firebase.google.com/";

interface JwtHeader {
  alg?: string;
  kid?: string;
}

interface JwtPayload {
  aud?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  sub?: string;
}

function base64UrlToBytes(input: string): Uint8Array<ArrayBuffer> {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  return base64ToBytes(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
}

function decodeJson(base64Url: string): unknown {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(base64Url)));
}

async function fetchSessionCertificates(): Promise<Record<string, string>> {
  const response = await fetch(SESSION_PUBLIC_KEYS_URL, {
    next: { revalidate: 3600 },
  });
  return response.json() as Promise<Record<string, string>>;
}

/**
 * Returns true only if `cookie` is a currently-valid Firebase session cookie for
 * `projectId`. Any structural, claim, key, or signature problem returns false.
 */
export async function verifySessionCookie(
  cookie: string | undefined,
  projectId: string | undefined,
): Promise<boolean> {
  if (!cookie || !projectId) return false;

  const firstDot = cookie.indexOf(".");
  const lastDot = cookie.lastIndexOf(".");
  if (firstDot === -1 || firstDot === lastDot) return false;

  const headerB64 = cookie.slice(0, firstDot);
  const payloadB64 = cookie.slice(firstDot + 1, lastDot);
  const signatureB64 = cookie.slice(lastDot + 1);

  let header: JwtHeader;
  let payload: JwtPayload;
  try {
    header = decodeJson(headerB64) as JwtHeader;
    payload = decodeJson(payloadB64) as JwtPayload;
  } catch {
    return false;
  }

  if (header.alg !== "RS256" || !header.kid) return false;

  const now = Math.floor(Date.now() / 1000);
  if (
    !payload.exp ||
    payload.exp <= now ||
    !payload.iat ||
    payload.iat > now ||
    payload.aud !== projectId ||
    payload.iss !== `${SESSION_ISSUER_PREFIX}${projectId}` ||
    !payload.sub
  ) {
    return false;
  }

  try {
    const certificates = await fetchSessionCertificates();
    const certificate = certificates[header.kid];
    if (!certificate) return false;

    const publicKey = await crypto.subtle.importKey(
      "spki",
      pemCertificateToSpki(certificate),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );

    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      base64UrlToBytes(signatureB64),
      new TextEncoder().encode(`${headerB64}.${payloadB64}`),
    );
  } catch {
    return false;
  }
}
