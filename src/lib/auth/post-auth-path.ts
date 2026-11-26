import { AUTHENTICATED_HOME_PATH } from "@/lib/auth-constants";

/**
 * Resolves where to send a user after sign-in from the `next` query param.
 * Only same-origin relative paths are honoured. `/` falls back to the
 * dashboard too: the client router may still hold the unauthenticated landing
 * page for `/` in its cache, which would skip the middleware's `/` → dashboard
 * redirect.
 */
export function postAuthPath(next: string | null): string {
  if (
    next !== null &&
    next !== "/" &&
    next.startsWith("/") &&
    !next.startsWith("//")
  ) {
    return next;
  }
  return AUTHENTICATED_HOME_PATH;
}
