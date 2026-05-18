import { getDatabase, ref, update } from "firebase/database";

import { getClientApp } from "@/lib/firebase/client";
import {
  type UserSettings,
  userSettingsToFirebase,
} from "@/lib/firebase/schema/user-settings";

function db() {
  return getDatabase(getClientApp());
}

function userSettingsRef(uid: string) {
  return ref(db(), `users/${uid}/settings`);
}

export async function updateUserSettings(
  uid: string,
  settings: Partial<UserSettings>,
): Promise<void> {
  await update(userSettingsRef(uid), userSettingsToFirebase(settings));
}
