import { Posture } from "@/lib/firebase/schema/investments";

export interface FirebaseUserSettings {
  reconciliationPosture?: string;
}

export interface UserSettings {
  reconciliationPosture: Posture;
}

export function firebaseToUserSettings(
  data: FirebaseUserSettings,
): UserSettings {
  return {
    reconciliationPosture:
      (data.reconciliationPosture as Posture | undefined) ?? Posture.Balanced,
  };
}

export function userSettingsToFirebase(
  settings: Partial<UserSettings>,
): FirebaseUserSettings {
  return {
    ...(settings.reconciliationPosture !== undefined
      ? { reconciliationPosture: settings.reconciliationPosture }
      : {}),
  };
}
