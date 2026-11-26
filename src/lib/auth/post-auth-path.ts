import { AUTHENTICATED_HOME_PATH } from "@/lib/auth-constants";

// Placeholder origin for resolving `next`; anything that resolves elsewhere
// (`//host`, `/\host`, `/\t/host`, `https://host`) is an off-site redirect.
const RESOLVE_BASE = "http://post-auth.invalid";

function resolveSameOrigin(next: string): URL | undefined {
  try {
    const url = new URL(next, RESOLVE_BASE);
    return url.origin === RESOLVE_BASE ? url : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolves where to send a user after sign-in from the `next` query param.
 * Only same-origin paths are honoured, and the normalised path is returned so
 * the router cannot reinterpret it. The landing page `/` falls back to the
 * dashboard too: the client router may still hold the unauthenticated landing
 * page in its cache, which would skip the middleware's `/` → dashboard
 * redirect.
 */
export function postAuthPath(next: string | null): string {
  if (!next?.startsWith("/")) {
    return AUTHENTICATED_HOME_PATH;
  }
  const url = resolveSameOrigin(next);
  // Dot-segment normalisation can turn `/.//host` into a `//host` path, which
  // the router would treat as protocol-relative, so reject that too.
  if (
    url === undefined ||
    url.pathname === "/" ||
    url.pathname.startsWith("//")
  ) {
    return AUTHENTICATED_HOME_PATH;
  }
  return url.pathname + url.search + url.hash;
}
