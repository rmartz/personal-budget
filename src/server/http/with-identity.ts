import { type NextRequest, NextResponse } from "next/server";

import { resolveIdentity } from "@/server/auth/resolve-identity";

/**
 * Wraps an App Router route handler so it runs only for an authenticated caller,
 * with the `uid` derived once via the shared identity seam. An unauthenticated
 * request gets a proper 401 (not a redirect), so `/api/*` is excluded from the
 * page-redirect middleware and self-authorizes here instead.
 */

type IdentifiedHandler<TContext> = (
  uid: string,
  request: NextRequest,
  context: TContext,
) => Promise<Response> | Response;

export function withIdentity<TContext>(handler: IdentifiedHandler<TContext>) {
  return async (request: NextRequest, context: TContext): Promise<Response> => {
    const identity = await resolveIdentity(request);
    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(identity.uid, request, context);
  };
}
