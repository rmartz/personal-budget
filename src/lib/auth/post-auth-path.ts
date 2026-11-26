import { AUTHENTICATED_HOME_PATH } from "@/lib/auth-constants";

// Placeholder origin for resolving `next`; anything that resolves elsewhere
// (`//host`, `/\host`, `/\t/host`, `https://host`) is an off-site redirect.
const RESOLVE_BASE = "http://post-auth.invalid";

/**
 * Resolves where to send a user after sign-in from the `next` query param.
 * Only same-origin paths are honoured. The landing page `/` falls back to the
 * dashboard too: the client router may still hold the unauthenticated landing
 * page in its cache, which would skip the middleware's `/` → dashboard
 * redirect.
 */
export function postAuthPath(next: string | null): string {
  if (!next?.startsWith("/")) {
    return AUTHENTICATED_HOME_PATH;
  }
  const url = new URL(next, RESOLVE_BASE);
  if (url.origin !== RESOLVE_BASE || url.pathname === "/") {
    return AUTHENTICATED_HOME_PATH;
  }
  return url.pathname + url.search + url.hash;
}
