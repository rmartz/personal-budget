import { describe, expect, it } from "vitest";

import { Posture } from "@/lib/firebase/schema/investments";

import {
  firebaseToUserSettings,
  userSettingsToFirebase,
} from "./user-settings";

describe("firebaseToUserSettings", () => {
  it("maps 'aggressive' to Posture.Aggressive", () => {
    const result = firebaseToUserSettings({
      reconciliationPosture: Posture.Aggressive,
    });
    expect(result.reconciliationPosture).toBe(Posture.Aggressive);
  });

  it("maps 'balanced' to Posture.Balanced", () => {
    const result = firebaseToUserSettings({
      reconciliationPosture: Posture.Balanced,
    });
    expect(result.reconciliationPosture).toBe(Posture.Balanced);
  });

  it("maps 'conservative' to Posture.Conservative", () => {
    const result = firebaseToUserSettings({
      reconciliationPosture: Posture.Conservative,
    });
    expect(result.reconciliationPosture).toBe(Posture.Conservative);
  });

  it("defaults to Posture.Balanced when reconciliationPosture is absent", () => {
    const result = firebaseToUserSettings({});
    expect(result.reconciliationPosture).toBe(Posture.Balanced);
  });

  it("defaults to Posture.Balanced when reconciliationPosture is an unknown string", () => {
    const result = firebaseToUserSettings({
      reconciliationPosture: "invalid-posture",
    });
    expect(result.reconciliationPosture).toBe(Posture.Balanced);
  });
});

describe("userSettingsToFirebase", () => {
  it("maps Posture.Aggressive to the 'aggressive' string", () => {
    const result = userSettingsToFirebase({
      reconciliationPosture: Posture.Aggressive,
    });
    expect(result.reconciliationPosture).toBe("aggressive");
  });

  it("maps Posture.Balanced to the 'balanced' string", () => {
    const result = userSettingsToFirebase({
      reconciliationPosture: Posture.Balanced,
    });
    expect(result.reconciliationPosture).toBe("balanced");
  });

  it("maps Posture.Conservative to the 'conservative' string", () => {
    const result = userSettingsToFirebase({
      reconciliationPosture: Posture.Conservative,
    });
    expect(result.reconciliationPosture).toBe("conservative");
  });

  it("omits reconciliationPosture from the result when not provided", () => {
    const result = userSettingsToFirebase({});
    expect(result).not.toHaveProperty("reconciliationPosture");
  });
});
