import { describe, it, expect } from "vitest";
import {
  budgetLedgerToFirebase,
  firebaseToBudgetLedger,
} from "./budget-ledgers";

describe("budgetLedgerToFirebase", () => {
  it("converts undefined cashCap to null", () => {
    const result = budgetLedgerToFirebase({
      name: "Car Maintenance",
      cashCap: undefined,
    });
    expect(result.cashCap).toBeNull();
  });

  it("preserves numeric cashCap", () => {
    const result = budgetLedgerToFirebase({
      name: "Groceries",
      cashCap: 500,
    });
    expect(result.cashCap).toBe(500);
  });

  it("serializes name", () => {
    const result = budgetLedgerToFirebase({
      name: "Utilities",
      cashCap: undefined,
    });
    expect(result.name).toBe("Utilities");
  });
});

describe("firebaseToBudgetLedger", () => {
  it("sets id from parameter", () => {
    const result = firebaseToBudgetLedger("ledger-1", {
      name: "Entertainment",
      cashCap: null,
    });
    expect(result.id).toBe("ledger-1");
  });

  it("converts null cashCap to undefined", () => {
    const result = firebaseToBudgetLedger("ledger-1", {
      name: "Dining",
      cashCap: null,
    });
    expect(result.cashCap).toBeUndefined();
  });

  it("preserves numeric cashCap", () => {
    const result = firebaseToBudgetLedger("ledger-1", {
      name: "Travel",
      cashCap: 2000,
    });
    expect(result.cashCap).toBe(2000);
  });

  it("round-trips cashCap null/undefined", () => {
    const firebase = budgetLedgerToFirebase({
      name: "Misc",
      cashCap: undefined,
    });
    const result = firebaseToBudgetLedger("l-1", firebase);
    expect(result.cashCap).toBeUndefined();
  });
});
