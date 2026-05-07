import { describe, expect, it } from "vitest";

describe("Source maps are not included in the browser-downloadable build output", () => {
  it("makeSentryBuildOptions returns deleteSourcemapsAfterUpload: true", async () => {
    const { makeSentryBuildOptions } = await import("./sentry-build-options");
    const opts = makeSentryBuildOptions();
    expect(opts.sourcemaps).toMatchObject({
      deleteSourcemapsAfterUpload: true,
    });
  });
});

describe("Build does not fail when SENTRY_AUTH_TOKEN is absent (local dev / forks)", () => {
  it("makeSentryBuildOptions returns an errorHandler that does not throw", async () => {
    const { makeSentryBuildOptions } = await import("./sentry-build-options");
    const opts = makeSentryBuildOptions();
    expect(opts.errorHandler).toBeDefined();
    expect(() => {
      opts.errorHandler?.(new Error("upload failed: unauthorized"));
    }).not.toThrow();
  });
});
