import { describe, it, expect } from "vitest";
import {
  investmentLedgerToFirebase,
  firebaseToInvestmentLedger,
} from "./investment-ledgers";

describe("investmentLedgerToFirebase", () => {
  it("serializes all fields", () => {
    const result = investmentLedgerToFirebase({
      name: "Stocks",
      targetAllocationPct: 60,
    });
    expect(result).toEqual({ name: "Stocks", targetAllocationPct: 60 });
  });
});

describe("firebaseToInvestmentLedger", () => {
  it("sets id from parameter", () => {
    const result = firebaseToInvestmentLedger("ledger-1", {
      name: "Bonds",
      targetAllocationPct: 40,
    });
    expect(result.id).toBe("ledger-1");
  });

  it("preserves targetAllocationPct", () => {
    const result = firebaseToInvestmentLedger("ledger-1", {
      name: "Real Estate",
      targetAllocationPct: 25,
    });
    expect(result.targetAllocationPct).toBe(25);
  });

  it("round-trips through serialization", () => {
    const original = { name: "ETFs", targetAllocationPct: 75 };
    const firebase = investmentLedgerToFirebase(original);
    const result = firebaseToInvestmentLedger("l-1", firebase);
    expect(result.name).toBe(original.name);
    expect(result.targetAllocationPct).toBe(original.targetAllocationPct);
  });
});
