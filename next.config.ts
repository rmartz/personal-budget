import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {};

export default withSentryConfig(nextConfig, {
  // Sentry organisation and project are read from SENTRY_ORG / SENTRY_PROJECT env vars.
  silent: true,

  // Source map upload is handled in companion issue #80 — disable here.
  sourcemaps: { disable: true },

  webpack: {
    // Suppress debug logging in production bundles.
    treeshake: { removeDebugLogging: true },
    // Instrument server components and route handlers for error capture.
    autoInstrumentAppDirectory: true,
    autoInstrumentServerFunctions: false,
    autoInstrumentMiddleware: false,
  },
});
