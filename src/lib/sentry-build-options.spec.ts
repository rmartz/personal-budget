import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { parse as parseYaml } from "yaml";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Source maps are uploaded to Sentry on every production/preview build (workflow config)", () => {
  it("sentry-sourcemaps workflow file exists", () => {
    const workflowPath = join(
      import.meta.dirname,
      "../../.github/workflows/sentry-sourcemaps.yml",
    );
    expect(() => readFileSync(workflowPath, "utf-8")).not.toThrow();
  });

  it("workflow triggers on push to main", () => {
    const workflowPath = join(
      import.meta.dirname,
      "../../.github/workflows/sentry-sourcemaps.yml",
    );
    const workflow = parseYaml(readFileSync(workflowPath, "utf-8")) as Record<
      string,
      unknown
    >;
    const on = workflow["on"] as Record<string, unknown>;
    expect(on).toHaveProperty("push");
    const push = on["push"] as Record<string, unknown>;
    expect(push["branches"]).toContain("main");
  });

  it("workflow passes SENTRY_AUTH_TOKEN from GitHub secrets to the upload step", () => {
    const workflowPath = join(
      import.meta.dirname,
      "../../.github/workflows/sentry-sourcemaps.yml",
    );
    const workflow = parseYaml(readFileSync(workflowPath, "utf-8")) as Record<
      string,
      unknown
    >;
    const jobs = workflow["jobs"] as Record<string, unknown>;
    const jobNames = Object.keys(jobs);
    expect(jobNames.length).toBeGreaterThan(0);

    const allEnvValues = jobNames.flatMap((name) => {
      const job = jobs[name] as Record<string, unknown>;
      const steps = job["steps"] as Record<string, unknown>[];
      return steps.flatMap((step) => {
        const env = step["env"] as Record<string, string> | undefined;
        return env ? Object.values(env) : [];
      });
    });
    expect(allEnvValues).toContain("${{ secrets.SENTRY_AUTH_TOKEN }}");
  });
});

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

  it("workflow upload step is conditional on SENTRY_AUTH_TOKEN being set", () => {
    const workflowPath = join(
      import.meta.dirname,
      "../../.github/workflows/sentry-sourcemaps.yml",
    );
    const workflow = parseYaml(readFileSync(workflowPath, "utf-8")) as Record<
      string,
      unknown
    >;
    const jobs = workflow["jobs"] as Record<string, unknown>;
    const jobEntries = Object.values(jobs) as Record<string, unknown>[];
    const steps = jobEntries.flatMap(
      (job) => job["steps"] as Record<string, unknown>[],
    );
    const uploadStep = steps.find(
      (s) => typeof s["run"] === "string" && s["run"].includes("sourcemaps"),
    );
    expect(uploadStep).toBeDefined();
    expect(uploadStep?.["if"]).toMatch(/SENTRY_AUTH_TOKEN/);
  });
});
