import type { AuthInfo } from "@modelcontextprotocol/server";

import { verifyBearerToken } from "@/server/auth/resolve-identity";

import { ALL_SCOPES } from "./scopes";

/**
 * The MCP `withMcpAuth` token verifier — the Bearer branch of the shared
 * identity seam. Returns `undefined` (→ 401) for a missing or invalid token;
 * otherwise carries the resolved `uid` in `extra` for `withUser` to read.
 * Scopes are granted wholesale in Phase 1 (declared, not enforced).
 */
export async function verifyToken(
  _request: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> {
  if (!bearerToken) {
    return undefined;
  }
  const identity = await verifyBearerToken(bearerToken);
  if (!identity) {
    return undefined;
  }
  return {
    token: bearerToken,
    clientId: identity.uid,
    scopes: [...ALL_SCOPES],
    extra: { uid: identity.uid },
  };
}
