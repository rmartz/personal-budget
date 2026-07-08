/**
 * Extract the SubjectPublicKeyInfo (SPKI) from an X.509 certificate so it can be
 * imported with Web Crypto's `crypto.subtle.importKey("spki", …)` in the Edge
 * runtime (no Node Buffer, no firebase-admin).
 *
 * Firebase **session cookies** are signed with keys published as X.509 PEM
 * certificates at the identitytoolkit `publicKeys` endpoint — unlike ID tokens,
 * whose keys are a JWK set. Web Crypto can't import a full certificate, only the
 * SPKI inside it, so we walk the certificate's ASN.1 DER to slice out the SPKI.
 *
 * Certificate ::= SEQUENCE {
 *   tbsCertificate SEQUENCE {
 *     [0] version (optional, EXPLICIT), serialNumber, signature, issuer,
 *     validity, subject, subjectPublicKeyInfo, ...   <- we want #7
 *   },
 *   signatureAlgorithm, signatureValue
 * }
 */

interface DerElement {
  tag: number;
  /** Offset of this element's first content byte. */
  contentStart: number;
  /** Total bytes of the element, tag + length + content. */
  totalLen: number;
}

/** Read the byte at `index`, throwing if it is out of range. */
function byteAt(bytes: Uint8Array, index: number): number {
  const value = bytes[index];
  if (value === undefined) {
    throw new Error("Truncated ASN.1 element");
  }
  return value;
}

/** Read one ASN.1 DER TLV element starting at `offset`. */
function readElement(bytes: Uint8Array, offset: number): DerElement {
  const tag = byteAt(bytes, offset);
  const firstLenByte = byteAt(bytes, offset + 1);
  let contentLen: number;
  let lenBytes: number;

  if (firstLenByte < 0x80) {
    contentLen = firstLenByte;
    lenBytes = 1;
  } else {
    // Long form: low 7 bits = number of subsequent length bytes (big-endian).
    // Indefinite length (0x80) is not valid DER.
    const numLenBytes = firstLenByte & 0x7f;
    if (numLenBytes === 0 || numLenBytes > 4) {
      throw new Error("Unsupported ASN.1 length encoding");
    }
    contentLen = 0;
    for (let i = 0; i < numLenBytes; i++) {
      contentLen = (contentLen << 8) | byteAt(bytes, offset + 2 + i);
    }
    lenBytes = 1 + numLenBytes;
  }

  const headerLen = 1 + lenBytes;
  return {
    tag,
    contentStart: offset + headerLen,
    totalLen: headerLen + contentLen,
  };
}

/**
 * Return the SPKI DER (a full `SubjectPublicKeyInfo` SEQUENCE) from an X.509
 * certificate's DER bytes.
 */
export function extractSpkiFromCertificate(
  certificateDer: Uint8Array<ArrayBuffer>,
): Uint8Array<ArrayBuffer> {
  const certificate = readElement(certificateDer, 0);
  const tbsCertificate = readElement(certificateDer, certificate.contentStart);

  let offset = tbsCertificate.contentStart;
  let element = readElement(certificateDer, offset);

  // Skip the optional EXPLICIT [0] version (context tag 0xA0), present in v2/v3.
  if (element.tag === 0xa0) {
    offset += element.totalLen;
    element = readElement(certificateDer, offset);
  }

  // `element` is now serialNumber. Skip it plus signature, issuer, validity,
  // and subject (5 elements) to land on subjectPublicKeyInfo.
  for (let i = 0; i < 5; i++) {
    offset += element.totalLen;
    element = readElement(certificateDer, offset);
  }

  return certificateDer.slice(offset, offset + element.totalLen);
}

/** Decode a base64 (standard, not base64url) string to bytes in the Edge runtime. */
export function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Convert a PEM certificate ("-----BEGIN CERTIFICATE-----…") to its SPKI DER. */
export function pemCertificateToSpki(pem: string): Uint8Array<ArrayBuffer> {
  const base64 = pem
    .replace(/-----BEGIN CERTIFICATE-----/, "")
    .replace(/-----END CERTIFICATE-----/, "")
    .replace(/\s+/g, "");
  return extractSpkiFromCertificate(base64ToBytes(base64));
}
