import { describe, it, expect } from "vitest";
import {
  ReconciliationExpenseType,
  reconciliationExpenseToFirebase,
  firebaseToReconciliationExpense,
} from "./reconciliation-expenses";

describe("reconciliationExpenseToFirebase", () => {
  it("serializes all fields", () => {
    const result = reconciliationExpenseToFirebase({
      name: "Electric Bill",
      type: ReconciliationExpenseType.StatementBalance,
      typicalAmount: 120,
    });
    expect(result).toEqual({
      name: "Electric Bill",
      type: "statement-balance",
      typicalAmount: 120,
    });
  });

  it("preserves enum value for each type", () => {
    expect(
      reconciliationExpenseToFirebase({
        name: "Internet",
        type: ReconciliationExpenseType.RunningBalance,
        typicalAmount: 60,
      }).type,
    ).toBe("running-balance");
  });
});

describe("firebaseToReconciliationExpense", () => {
  it("sets id from parameter", () => {
    const result = firebaseToReconciliationExpense("exp-1", {
      name: "Water Bill",
      type: ReconciliationExpenseType.StatementBalance,
      typicalAmount: 45,
    });
    expect(result.id).toBe("exp-1");
  });

  it("preserves enum value", () => {
    const result = firebaseToReconciliationExpense("exp-1", {
      name: "Gas",
      type: ReconciliationExpenseType.RunningBalance,
      typicalAmount: 80,
    });
    expect(result.type).toBe(ReconciliationExpenseType.RunningBalance);
  });

  it("round-trips through serialization", () => {
    const original = {
      name: "Phone",
      type: ReconciliationExpenseType.StatementBalance,
      typicalAmount: 90,
    };
    const firebase = reconciliationExpenseToFirebase(original);
    const result = firebaseToReconciliationExpense("exp-1", firebase);
    expect(result.name).toBe(original.name);
    expect(result.type).toBe(original.type);
    expect(result.typicalAmount).toBe(original.typicalAmount);
  });
});
