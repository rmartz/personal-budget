import { describe, it, expect } from "vitest";
import {
  ReconciliationAccountTier,
  reconciliationAccountToFirebase,
  firebaseToReconciliationAccount,
} from "./reconciliation-accounts";

describe("reconciliationAccountToFirebase", () => {
  it("serializes all fields", () => {
    const result = reconciliationAccountToFirebase({
      name: "Chase Checking",
      tier: ReconciliationAccountTier.ShortTerm,
      targetFloat: 2000,
    });
    expect(result).toEqual({
      name: "Chase Checking",
      tier: "short-term",
      targetFloat: 2000,
    });
  });

  it("preserves enum value for each tier", () => {
    expect(
      reconciliationAccountToFirebase({
        name: "Savings",
        tier: ReconciliationAccountTier.Reserve,
        targetFloat: 5000,
      }).tier,
    ).toBe("reserve");

    expect(
      reconciliationAccountToFirebase({
        name: "Brokerage",
        tier: ReconciliationAccountTier.LongTerm,
        targetFloat: 10000,
      }).tier,
    ).toBe("long-term");
  });
});

describe("firebaseToReconciliationAccount", () => {
  it("sets id from parameter", () => {
    const result = firebaseToReconciliationAccount("acct-1", {
      name: "Chase Checking",
      tier: ReconciliationAccountTier.ShortTerm,
      targetFloat: 1500,
    });
    expect(result.id).toBe("acct-1");
  });

  it("preserves enum value", () => {
    const result = firebaseToReconciliationAccount("acct-1", {
      name: "HYSA",
      tier: ReconciliationAccountTier.Reserve,
      targetFloat: 8000,
    });
    expect(result.tier).toBe(ReconciliationAccountTier.Reserve);
  });

  it("round-trips through serialization", () => {
    const original = {
      name: "Vanguard",
      tier: ReconciliationAccountTier.LongTerm,
      targetFloat: 50000,
    };
    const firebase = reconciliationAccountToFirebase(original);
    const result = firebaseToReconciliationAccount("acct-1", firebase);
    expect(result.name).toBe(original.name);
    expect(result.tier).toBe(original.tier);
    expect(result.targetFloat).toBe(original.targetFloat);
  });
});
