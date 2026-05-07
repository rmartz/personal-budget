import * as Sentry from "@sentry/nextjs";

/**
 * Initialises Sentry with the given DSN.
 * No-ops silently when dsn is absent so environments without a DSN
 * (local dev, forks) do not crash.
 */
export function initSentry(dsn: string | undefined): void {
  if (!dsn) return;
  Sentry.init({
    dsn,
    // Error capture only — no performance tracing or session replay.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}
