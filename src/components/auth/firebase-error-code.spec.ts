import { describe, expect, it } from "vitest";

import { getFirebaseErrorCode } from "./firebase-error-code";

describe("getFirebaseErrorCode", () => {
  it("returns the code of a Firebase error", () => {
    expect(getFirebaseErrorCode({ code: "auth/user-disabled" })).toBe(
      "auth/user-disabled",
    );
  });

  it("returns an empty string for an error without a code", () => {
    expect(getFirebaseErrorCode(new Error("network down"))).toBe("");
  });

  it("returns an empty string when the code is not a string", () => {
    expect(getFirebaseErrorCode({ code: 403 })).toBe("");
  });

  it("returns an empty string for null", () => {
    expect(getFirebaseErrorCode(null)).toBe("");
  });
});
