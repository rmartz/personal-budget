import { Posture } from "@/lib/firebase/schema/investments";

export interface FirebaseUserSettings {
  reconciliationPosture?: string;
}

export interface UserSettings {
  reconciliationPosture: Posture;
}

const VALID_POSTURES: ReadonlySet<string> = new Set(Object.values(Posture));

export function firebaseToUserSettings(
  data: FirebaseUserSettings,
): UserSettings {
  return {
    reconciliationPosture:
      data.reconciliationPosture !== undefined &&
      VALID_POSTURES.has(data.reconciliationPosture)
        ? (data.reconciliationPosture as Posture)
        : Posture.Balanced,
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
