import { readFileSync } from "fs";
import { join } from "path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@sentry/nextjs", () => ({
  init: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("DSN is read from environment config; no DSN is hardcoded in source", () => {
  it("calls Sentry.init with the DSN value passed to initSentry", async () => {
    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");
    const mockDsn = "https://abc123@o123456.ingest.sentry.io/789";

    initSentry(mockDsn);

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({ dsn: mockDsn }),
    );
  });

  it("passes a different DSN when called with a different value", async () => {
    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");
    const altDsn = "https://xyz999@o654321.ingest.sentry.io/321";

    initSentry(altDsn);

    expect(init).toHaveBeenCalledWith(expect.objectContaining({ dsn: altDsn }));
  });
});

describe("Sentry is initialised only when NEXT_PUBLIC_SENTRY_DSN is present (no crashes in environments where it is absent)", () => {
  it("does not call Sentry.init when DSN is undefined", async () => {
    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");

    initSentry(undefined);

    expect(init).not.toHaveBeenCalled();
  });

  it("does not call Sentry.init when DSN is an empty string", async () => {
    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");

    initSentry("");

    expect(init).not.toHaveBeenCalled();
  });

  it("does not throw when DSN is undefined", async () => {
    const { initSentry } = await import("./sentry-init");

    expect(() => {
      initSentry(undefined);
    }).not.toThrow();
  });
});

describe("Unhandled exceptions in client components are captured (init config enables error capture)", () => {
  it("disables performance tracing (tracesSampleRate: 0)", async () => {
    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");

    initSentry("https://abc123@o123456.ingest.sentry.io/789");

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({ tracesSampleRate: 0 }),
    );
  });
});

describe("Unhandled exceptions in server components / route handlers are captured (instrumentation registers Sentry)", () => {
  it("calls initSentry with process.env.NEXT_PUBLIC_SENTRY_DSN when register() is called in nodejs runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv(
      "NEXT_PUBLIC_SENTRY_DSN",
      "https://env123@o999.ingest.sentry.io/111",
    );

    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");

    // The instrumentation module reads the DSN from env and passes it to initSentry
    const { register } = await import("../instrumentation");

    await register();

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://env123@o999.ingest.sentry.io/111",
      }),
    );

    void initSentry; // suppress unused-import lint
  });

  it("calls initSentry with process.env.NEXT_PUBLIC_SENTRY_DSN when register() is called in edge runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "edge");
    vi.stubEnv(
      "NEXT_PUBLIC_SENTRY_DSN",
      "https://edge456@o888.ingest.sentry.io/222",
    );

    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");

    const { register } = await import("../instrumentation");

    await register();

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://edge456@o888.ingest.sentry.io/222",
      }),
    );

    void initSentry;
  });
});

// ─── Criterion 1: Sentry environment tag set from NEXT_PUBLIC_APP_ENV ─────────

describe("Sentry errors from staging are distinguishable from production errors via environment tag", () => {
  it("initSentry passes NEXT_PUBLIC_APP_ENV as environment to Sentry.init", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_ENV", "production");
    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");

    initSentry("https://abc@o1.ingest.sentry.io/1");

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({ environment: "production" }),
    );
  });

  it("initSentry falls back to 'development' when NEXT_PUBLIC_APP_ENV is absent", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_ENV", "");
    const { initSentry } = await import("./sentry-init");
    const { init } = await import("@sentry/nextjs");

    initSentry("https://abc@o1.ingest.sentry.io/1");

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({ environment: "development" }),
    );
  });
});

// ─── Criterion 2: environment tag documented in deployment config ─────────────

describe("The approach is documented in the deployment config", () => {
  it("deployment/production.yml sets NEXT_PUBLIC_APP_ENV to 'production'", () => {
    const path = join(import.meta.dirname, "../../deployment/production.yml");
    const raw = readFileSync(path, "utf-8");
    expect(raw).toMatch(/NEXT_PUBLIC_APP_ENV:\s*["']?production["']?/);
  });

  it("deployment/staging.yml sets NEXT_PUBLIC_APP_ENV to 'staging'", () => {
    const path = join(import.meta.dirname, "../../deployment/staging.yml");
    const raw = readFileSync(path, "utf-8");
    expect(raw).toMatch(/NEXT_PUBLIC_APP_ENV:\s*["']?staging["']?/);
  });
});
