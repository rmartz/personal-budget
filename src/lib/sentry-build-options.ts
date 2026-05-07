import type { SentryBuildOptions } from "@sentry/nextjs";

/**
 * Returns the Sentry build-time options for withSentryConfig.
 *
 * Extracted as a pure function so these settings can be imported and
 * validated in tests without executing a Next.js build.
 */
export function makeSentryBuildOptions(): SentryBuildOptions {
  return {
    silent: true,

    sourcemaps: {
      // Upload source maps during build and delete them from the output so
      // they are never served to the browser.
      deleteSourcemapsAfterUpload: true,
    },

    /**
     * Swallow source-map upload errors so the build never fails when
     * SENTRY_AUTH_TOKEN is absent (local dev, forks, CI without the secret).
     */
    errorHandler(err) {
      // Log a warning but do not rethrow — upload failures are non-fatal.
      console.warn(
        "[sentry] source map upload failed (non-fatal):",
        err.message,
      );
    },

    webpack: {
      // Instrument server components for error capture.
      autoInstrumentAppDirectory: true,
      autoInstrumentServerFunctions: false,
      autoInstrumentMiddleware: false,
      treeshake: { removeDebugLogging: true },
    },
  };
}
