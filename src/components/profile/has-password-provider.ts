import type { UserInfo } from "firebase/auth";

// Firebase's provider ID for email/password sign-in. Accounts created through
// Google sign-in carry only "google.com" and have no password to change.
const PASSWORD_PROVIDER_ID = "password";

export function hasPasswordProvider(
  providerData: readonly Pick<UserInfo, "providerId">[],
): boolean {
  return providerData.some(
    ({ providerId }) => providerId === PASSWORD_PROVIDER_ID,
  );
}
