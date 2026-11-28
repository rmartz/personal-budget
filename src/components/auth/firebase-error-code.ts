// The `code` of a Firebase error (e.g. "auth/invalid-credential"), or "" when
// the thrown value is not a Firebase error.
export function getFirebaseErrorCode(err: unknown): string {
  return err !== null &&
    typeof err === "object" &&
    "code" in err &&
    typeof err.code === "string"
    ? err.code
    : "";
}
