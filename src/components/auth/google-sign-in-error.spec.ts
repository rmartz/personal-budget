import { describe, expect, it } from "vitest";

import { getGoogleSignInErrorMessage } from "./google-sign-in-error";
import { GOOGLE_SIGN_IN_COPY } from "./GoogleSignIn.copy";

describe("getGoogleSignInErrorMessage", () => {
  it("returns undefined when the popup was closed by the user", () => {
    expect(
      getGoogleSignInErrorMessage({ code: "auth/popup-closed-by-user" }),
    ).toBeUndefined();
  });

  it("returns undefined when a newer popup request cancelled this one", () => {
    expect(
      getGoogleSignInErrorMessage({ code: "auth/cancelled-popup-request" }),
    ).toBeUndefined();
  });

  it("explains a blocked popup", () => {
    expect(getGoogleSignInErrorMessage({ code: "auth/popup-blocked" })).toBe(
      GOOGLE_SIGN_IN_COPY.errorPopupBlocked,
    );
  });

  it("explains an unauthorized domain", () => {
    expect(
      getGoogleSignInErrorMessage({ code: "auth/unauthorized-domain" }),
    ).toBe(GOOGLE_SIGN_IN_COPY.errorUnauthorizedDomain);
  });

  it("explains an account that exists with a different credential", () => {
    expect(
      getGoogleSignInErrorMessage({
        code: "auth/account-exists-with-different-credential",
      }),
    ).toBe(GOOGLE_SIGN_IN_COPY.errorAccountExistsWithDifferentCredential);
  });

  it("falls back to the default message for an unknown code", () => {
    expect(getGoogleSignInErrorMessage({ code: "auth/internal-error" })).toBe(
      GOOGLE_SIGN_IN_COPY.errorDefault,
    );
  });

  it("falls back to the default message for a non-Firebase error", () => {
    expect(getGoogleSignInErrorMessage(new Error("network down"))).toBe(
      GOOGLE_SIGN_IN_COPY.errorDefault,
    );
  });
});
