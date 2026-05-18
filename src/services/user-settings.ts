import { getDatabase, ref, update } from "firebase/database";

import { getClientApp } from "@/lib/firebase/client";
import {
  type UserSettings,
  userSettingsToFirebase,
} from "@/lib/firebase/schema/user-settings";

export async function updateUserSettings(
  uid: string,
  settings: Partial<UserSettings>,
): Promise<void> {
  await update(
    ref(getDatabase(getClientApp()), `users/${uid}/settings`),
    userSettingsToFirebase(settings),
  );
}
