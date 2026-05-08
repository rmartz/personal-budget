import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { parse as parseYaml } from "yaml";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

// ─── Criterion 4: SENTRY_RELEASE available at runtime ────────────────────────

describe("SENTRY_RELEASE is available at runtime for Sentry.init({ release })", () => {
  it("getSentryRelease returns SENTRY_RELEASE when set", async () => {
    vi.stubEnv("SENTRY_RELEASE", "abc123");
    const { getSentryRelease } = await import("./sentry-release");
    expect(getSentryRelease()).toBe("abc123");
  });

  it("getSentryRelease falls back to VERCEL_GIT_COMMIT_SHA when SENTRY_RELEASE is absent", async () => {
    vi.stubEnv("SENTRY_RELEASE", "");
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "vercel-sha-456");
    const { getSentryRelease } = await import("./sentry-release");
    expect(getSentryRelease()).toBe("vercel-sha-456");
  });

  it("getSentryRelease returns undefined when neither env var is set", async () => {
    vi.stubEnv("SENTRY_RELEASE", "");
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "");
    const { getSentryRelease } = await import("./sentry-release");
    expect(getSentryRelease()).toBeUndefined();
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadWorkflow(): Record<string, unknown> {
  const path = join(
    import.meta.dirname,
    "../../.github/workflows/sentry-release.yml",
  );
  return parseYaml(readFileSync(path, "utf-8")) as Record<string, unknown>;
}

function allSteps(
  workflow: Record<string, unknown>,
): Record<string, unknown>[] {
  const jobs = workflow["jobs"] as Record<string, unknown>;
  return Object.values(jobs).flatMap(
    (job) =>
      (job as Record<string, unknown>)["steps"] as Record<string, unknown>[],
  );
}

// ─── Criterion 1: Sentry release created for every production deployment ─────

describe("A new Sentry release is created for every production deployment", () => {
  it("sentry-release workflow file exists", () => {
    expect(() => loadWorkflow()).not.toThrow();
  });

  it("workflow triggers on push to main", () => {
    const workflow = loadWorkflow();
    const on = workflow["on"] as Record<string, unknown>;
    const push = on["push"] as Record<string, unknown>;
    expect(push["branches"]).toContain("main");
  });

  it("workflow has a step that calls sentry-cli releases new", () => {
    const steps = allSteps(loadWorkflow());
    const step = steps.find(
      (s) => typeof s["run"] === "string" && s["run"].includes("releases new"),
    );
    expect(step).toBeDefined();
  });

  it("release version is set to the git SHA", () => {
    const steps = allSteps(loadWorkflow());
    const step = steps.find(
      (s) => typeof s["run"] === "string" && s["run"].includes("releases new"),
    );
    expect(step?.["run"]).toContain("github.sha");
  });
});

// ─── Criterion 2: Commits associated with the release ────────────────────────

describe("Commits are associated with the release", () => {
  it("workflow has a step that calls sentry-cli releases set-commits --auto", () => {
    const steps = allSteps(loadWorkflow());
    const step = steps.find(
      (s) =>
        typeof s["run"] === "string" &&
        s["run"].includes("set-commits") &&
        s["run"].includes("--auto"),
    );
    expect(step).toBeDefined();
  });

  it("workflow finalizes the release after commit association", () => {
    const steps = allSteps(loadWorkflow());
    const finalizeStep = steps.find(
      (s) =>
        typeof s["run"] === "string" && s["run"].includes("releases finalize"),
    );
    expect(finalizeStep).toBeDefined();
  });
});

// ─── Criterion 3: Webhook documented as TODO placeholder ─────────────────────

describe("The Sentry webhook is documented as a TODO placeholder", () => {
  it("workflow file contains a TODO comment referencing the Sentry webhook configuration", () => {
    const path = join(
      import.meta.dirname,
      "../../.github/workflows/sentry-release.yml",
    );
    const raw = readFileSync(path, "utf-8");
    expect(raw.toLowerCase()).toMatch(/todo.*webhook|webhook.*todo/);
  });
});
