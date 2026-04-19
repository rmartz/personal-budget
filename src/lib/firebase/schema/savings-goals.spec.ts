import { describe, it, expect } from "vitest";
import { savingsGoalToFirebase, firebaseToSavingsGoal } from "./savings-goals";

describe("savingsGoalToFirebase", () => {
  it("serializes all fields", () => {
    const result = savingsGoalToFirebase({
      name: "Emergency Fund",
      targetAmount: 10000,
      fundedAmount: 2500,
      priority: 1,
    });
    expect(result).toEqual({
      name: "Emergency Fund",
      targetAmount: 10000,
      fundedAmount: 2500,
      priority: 1,
    });
  });
});

describe("firebaseToSavingsGoal", () => {
  it("sets id and ledgerId from parameters", () => {
    const result = firebaseToSavingsGoal("goal-1", "ledger-1", {
      name: "Emergency Fund",
      targetAmount: 10000,
      fundedAmount: 2500,
      priority: 1,
    });
    expect(result.id).toBe("goal-1");
    expect(result.ledgerId).toBe("ledger-1");
  });

  it("preserves all numeric fields", () => {
    const result = firebaseToSavingsGoal("goal-1", "ledger-1", {
      name: "Car",
      targetAmount: 5000,
      fundedAmount: 1200,
      priority: 3,
    });
    expect(result.targetAmount).toBe(5000);
    expect(result.fundedAmount).toBe(1200);
    expect(result.priority).toBe(3);
  });

  it("round-trips through serialization", () => {
    const original = {
      name: "House Down Payment",
      targetAmount: 50000,
      fundedAmount: 12000,
      priority: 1,
    };
    const firebase = savingsGoalToFirebase(original);
    const result = firebaseToSavingsGoal("goal-99", "ledger-abc", firebase);
    expect(result.name).toBe(original.name);
    expect(result.targetAmount).toBe(original.targetAmount);
    expect(result.fundedAmount).toBe(original.fundedAmount);
    expect(result.priority).toBe(original.priority);
  });
});
