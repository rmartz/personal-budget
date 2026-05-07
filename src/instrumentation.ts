export async function register(): Promise<void> {
  const dsn = process.env["NEXT_PUBLIC_SENTRY_DSN"];

  if (process.env["NEXT_RUNTIME"] === "nodejs") {
    const { initSentry } = await import("@/lib/sentry-init");
    initSentry(dsn);
  }

  if (process.env["NEXT_RUNTIME"] === "edge") {
    const { initSentry } = await import("@/lib/sentry-init");
    initSentry(dsn);
  }
}
