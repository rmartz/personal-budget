import { describe, expect, it } from "vitest";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";
import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { checkDataCompleteness } from "./data-completeness";

function makeAccount(id: string) {
  return {
    id,
    name: `Account ${id}`,
    tier: ReconciliationAccountTier.ShortTerm,
  };
}

function makeExpense(id: string) {
  return {
    id,
    name: `Expense ${id}`,
    type: ReconciliationExpenseType.StatementBalance,
    typicalAmount: 100,
  };
}

describe("checkDataCompleteness — complete inputs", () => {
  it("returns isComplete true when all accounts and expenses have values", () => {
    const result = checkDataCompleteness({
      accountBalances: { a1: 1000, a2: 2000 },
      accounts: [makeAccount("a1"), makeAccount("a2")],
      expenseAmounts: { e1: 100, e2: 200 },
      expenses: [makeExpense("e1"), makeExpense("e2")],
    });
    expect(result.isComplete).toBe(true);
  });

  it("returns empty missing arrays when all inputs are provided", () => {
    const result = checkDataCompleteness({
      accountBalances: { a1: 500 },
      accounts: [makeAccount("a1")],
      expenseAmounts: { e1: 50 },
      expenses: [makeExpense("e1")],
    });
    expect(result.missingAccountIds).toEqual([]);
    expect(result.missingExpenseIds).toEqual([]);
  });

  it("returns isComplete true when there are no accounts or expenses", () => {
    const result = checkDataCompleteness({
      accountBalances: {},
      accounts: [],
      expenseAmounts: {},
      expenses: [],
    });
    expect(result.isComplete).toBe(true);
  });
});

describe("checkDataCompleteness — missing account balances", () => {
  it("returns isComplete false when an account has no balance entry", () => {
    const result = checkDataCompleteness({
      accountBalances: {},
      accounts: [makeAccount("a1")],
      expenseAmounts: {},
      expenses: [],
    });
    expect(result.isComplete).toBe(false);
  });

  it("returns isComplete false when an account balance is explicitly undefined", () => {
    const result = checkDataCompleteness({
      accountBalances: { a1: undefined },
      accounts: [makeAccount("a1")],
      expenseAmounts: {},
      expenses: [],
    });
    expect(result.isComplete).toBe(false);
  });

  it("lists missing account IDs in missingAccountIds", () => {
    const result = checkDataCompleteness({
      accountBalances: { a1: 100 },
      accounts: [makeAccount("a1"), makeAccount("a2"), makeAccount("a3")],
      expenseAmounts: {},
      expenses: [],
    });
    expect(result.missingAccountIds).toEqual(["a2", "a3"]);
  });

  it("does not flag accounts with a balance of zero as missing", () => {
    const result = checkDataCompleteness({
      accountBalances: { a1: 0 },
      accounts: [makeAccount("a1")],
      expenseAmounts: {},
      expenses: [],
    });
    expect(result.isComplete).toBe(true);
    expect(result.missingAccountIds).toEqual([]);
  });
});

describe("checkDataCompleteness — missing expense amounts", () => {
  it("returns isComplete false when an expense has no amount entry", () => {
    const result = checkDataCompleteness({
      accountBalances: {},
      accounts: [],
      expenseAmounts: {},
      expenses: [makeExpense("e1")],
    });
    expect(result.isComplete).toBe(false);
  });

  it("returns isComplete false when an expense amount is explicitly undefined", () => {
    const result = checkDataCompleteness({
      accountBalances: {},
      accounts: [],
      expenseAmounts: { e1: undefined },
      expenses: [makeExpense("e1")],
    });
    expect(result.isComplete).toBe(false);
  });

  it("lists missing expense IDs in missingExpenseIds", () => {
    const result = checkDataCompleteness({
      accountBalances: {},
      accounts: [],
      expenseAmounts: { e1: 50 },
      expenses: [makeExpense("e1"), makeExpense("e2"), makeExpense("e3")],
    });
    expect(result.missingExpenseIds).toEqual(["e2", "e3"]);
  });

  it("does not flag expenses with an amount of zero as missing", () => {
    const result = checkDataCompleteness({
      accountBalances: {},
      accounts: [],
      expenseAmounts: { e1: 0 },
      expenses: [makeExpense("e1")],
    });
    expect(result.isComplete).toBe(true);
    expect(result.missingExpenseIds).toEqual([]);
  });
});

describe("checkDataCompleteness — mixed missing inputs", () => {
  it("returns isComplete false and reports both missing accounts and expenses", () => {
    const result = checkDataCompleteness({
      accountBalances: { a1: 100 },
      accounts: [makeAccount("a1"), makeAccount("a2")],
      expenseAmounts: { e1: 50 },
      expenses: [makeExpense("e1"), makeExpense("e2")],
    });
    expect(result.isComplete).toBe(false);
    expect(result.missingAccountIds).toEqual(["a2"]);
    expect(result.missingExpenseIds).toEqual(["e2"]);
  });
});
