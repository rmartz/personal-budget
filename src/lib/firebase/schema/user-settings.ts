import { z } from "zod";

import { Posture } from "@/lib/firebase/schema/investments";

const FirebaseUserSettingsSchema = z.object({
  reconciliationPosture: z.string().optional(),
});

export type FirebaseUserSettings = z.infer<typeof FirebaseUserSettingsSchema>;

export interface UserSettings {
  reconciliationPosture: Posture;
}

// User settings must never crash the app on a bad value: an unknown or absent
// posture falls back to Balanced rather than throwing.
const ReconciliationPostureSchema = z
  .enum(Posture)
  .catch(Posture.Balanced)
  .default(Posture.Balanced);

export function firebaseToUserSettings(data: unknown): UserSettings {
  const parsed = FirebaseUserSettingsSchema.parse(data);
  return {
    reconciliationPosture: ReconciliationPostureSchema.parse(
      parsed.reconciliationPosture,
    ),
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
