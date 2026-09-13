import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";
import { getAdminAuth } from "@/lib/firebase/admin";

/**
 * The one identity seam shared by every server caller. A request is normalized
 * to an `Identity` here and nowhere else; tools and route handlers never see the
 * raw token. Resolution is polymorphic over token type — a Firebase ID token
 * (Bearer, used by MCP) or a session cookie (used by the UI) today; a later
 * phase adds an OAuth branch here only.
 */

export interface Identity {
  uid: string;
}

export async function verifyBearerToken(
  token: string,
): Promise<Identity | undefined> {
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    return undefined;
  }
}

async function verifySessionCookie(
  cookie: string,
): Promise<Identity | undefined> {
  try {
    const decoded = await getAdminAuth().verifySessionCookie(cookie, true);
    return { uid: decoded.uid };
  } catch {
    return undefined;
  }
}

function bearerFrom(request: Request): string | undefined {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return undefined;
  }
  return header.slice("Bearer ".length).trim() || undefined;
}

function sessionCookieFrom(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) {
    return undefined;
  }
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE_NAME) {
      return rest.join("=") || undefined;
    }
  }
  return undefined;
}

export async function resolveIdentity(
  request: Request,
): Promise<Identity | undefined> {
  const bearer = bearerFrom(request);
  if (bearer) {
    return verifyBearerToken(bearer);
  }
  const cookie = sessionCookieFrom(request);
  if (cookie) {
    return verifySessionCookie(cookie);
  }
  return undefined;
}
