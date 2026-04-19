import { describe, it, expect } from "vitest";
import {
  BudgetLedgerTransactionType,
  budgetLedgerTransactionToFirebase,
  firebaseToBudgetLedgerTransaction,
} from "./budget-ledger-transactions";

describe("budgetLedgerTransactionToFirebase", () => {
  it("serializes date to ISO string", () => {
    const date = new Date("2024-03-15T12:00:00.000Z");
    const result = budgetLedgerTransactionToFirebase({
      type: BudgetLedgerTransactionType.Deposit,
      date,
      amount: 100,
      description: "Test deposit",
    });
    expect(result.date).toBe("2024-03-15T12:00:00.000Z");
  });

  it("preserves enum value", () => {
    const result = budgetLedgerTransactionToFirebase({
      type: BudgetLedgerTransactionType.Expense,
      date: new Date(),
      amount: 50,
      description: "Test expense",
    });
    expect(result.type).toBe("expense");
  });
});

describe("firebaseToBudgetLedgerTransaction", () => {
  it("sets id and ledgerId from parameters", () => {
    const result = firebaseToBudgetLedgerTransaction("txn-1", "ledger-1", {
      type: BudgetLedgerTransactionType.Deposit,
      date: "2024-03-15T12:00:00.000Z",
      amount: 200,
      description: "Income",
    });
    expect(result.id).toBe("txn-1");
    expect(result.ledgerId).toBe("ledger-1");
  });

  it("parses ISO date string to Date object", () => {
    const result = firebaseToBudgetLedgerTransaction("txn-1", "ledger-1", {
      type: BudgetLedgerTransactionType.Deposit,
      date: "2024-06-01T00:00:00.000Z",
      amount: 100,
      description: "Test",
    });
    expect(result.date).toEqual(new Date("2024-06-01T00:00:00.000Z"));
  });

  it("preserves enum value", () => {
    const result = firebaseToBudgetLedgerTransaction("txn-1", "ledger-1", {
      type: BudgetLedgerTransactionType.Expense,
      date: "2024-06-01T00:00:00.000Z",
      amount: 75,
      description: "Groceries",
    });
    expect(result.type).toBe(BudgetLedgerTransactionType.Expense);
  });

  it("round-trips date through serialization", () => {
    const date = new Date("2024-09-20T08:30:00.000Z");
    const firebase = budgetLedgerTransactionToFirebase({
      type: BudgetLedgerTransactionType.Deposit,
      date,
      amount: 500,
      description: "Round trip",
    });
    const result = firebaseToBudgetLedgerTransaction("id-1", "lid-1", firebase);
    expect(result.date.toISOString()).toBe(date.toISOString());
  });
});
