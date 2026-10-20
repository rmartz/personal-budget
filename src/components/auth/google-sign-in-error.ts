import { GOOGLE_SIGN_IN_COPY } from "./GoogleSignIn.copy";

// Maps a failed Google popup sign-in to the message to show. Returns undefined
// when the person closed or replaced the popup themselves, which is not an
// error worth reporting.
export function getGoogleSignInErrorMessage(err: unknown): string | undefined {
  const code =
    err !== null &&
    typeof err === "object" &&
    "code" in err &&
    typeof err.code === "string"
      ? err.code
      : "";
  switch (code) {
    case "auth/cancelled-popup-request":
    case "auth/popup-closed-by-user":
      return undefined;
    case "auth/account-exists-with-different-credential":
      return GOOGLE_SIGN_IN_COPY.errorAccountExistsWithDifferentCredential;
    case "auth/popup-blocked":
      return GOOGLE_SIGN_IN_COPY.errorPopupBlocked;
    case "auth/unauthorized-domain":
      return GOOGLE_SIGN_IN_COPY.errorUnauthorizedDomain;
    default:
      return GOOGLE_SIGN_IN_COPY.errorDefault;
  }
}
