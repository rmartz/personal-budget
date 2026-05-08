import { initSentry } from "@/lib/sentry-init";

// Initialises Sentry for the browser bundle.
// Called automatically by Next.js via withSentryConfig in next.config.ts.
initSentry(process.env["NEXT_PUBLIC_SENTRY_DSN"]);
