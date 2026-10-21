import { describe, expect, it } from "vitest";

import { hasPasswordProvider } from "./has-password-provider";

describe("hasPasswordProvider", () => {
  it("returns true for an email/password account", () => {
    expect(hasPasswordProvider([{ providerId: "password" }])).toBe(true);
  });

  it("returns true when password is linked alongside Google", () => {
    expect(
      hasPasswordProvider([
        { providerId: "google.com" },
        { providerId: "password" },
      ]),
    ).toBe(true);
  });

  it("returns false for a Google-only account", () => {
    expect(hasPasswordProvider([{ providerId: "google.com" }])).toBe(false);
  });

  it("returns false when there are no providers", () => {
    expect(hasPasswordProvider([])).toBe(false);
  });
});
