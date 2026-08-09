import { describe, expect, it } from "vitest";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";
import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { calculateTierTargets } from "./tier-targets";

function makeAccount(
  id: string,
  tier: ReconciliationAccountTier,
  targetFloat?: number,
) {
  return { id, name: `Account ${id}`, tier, targetFloat };
}

function makeExpense(
  id: string,
  type: ReconciliationExpenseType,
  typicalAmount: number,
) {
  return { id, name: `Expense ${id}`, type, typicalAmount };
}

describe("calculateTierTargets — short-term target", () => {
  it("includes the targetFloat of all short-term accounts", () => {
    const result = calculateTierTargets({
      accounts: [
        makeAccount("a1", ReconciliationAccountTier.ShortTerm, 1000),
        makeAccount("a2", ReconciliationAccountTier.ShortTerm, 500),
      ],
      expenseAmounts: {},
      expenses: [],
      totalCash: 10000,
    });
    expect(result.shortTerm).toBe(1500);
  });

  it("adds StatementBalance expense amounts to the short-term target", () => {
    const result = calculateTierTargets({
      accounts: [makeAccount("a1", ReconciliationAccountTier.ShortTerm, 0)],
      expenseAmounts: { e1: 120, e2: 80 },
      expenses: [
        makeExpense("e1", ReconciliationExpenseType.StatementBalance, 100),
        makeExpense("e2", ReconciliationExpenseType.StatementBalance, 90),
      ],
      totalCash: 10000,
    });
    expect(result.shortTerm).toBe(200);
  });

  it("falls back to typicalAmount when expenseAmount is undefined for StatementBalance", () => {
    const result = calculateTierTargets({
      accounts: [],
      expenseAmounts: {},
      expenses: [
        makeExpense("e1", ReconciliationExpenseType.StatementBalance, 150),
      ],
      totalCash: 10000,
    });
    expect(result.shortTerm).toBe(150);
  });

  it("does not include RunningBalance expenses in the short-term target", () => {
    const result = calculateTierTargets({
      accounts: [],
      expenseAmounts: { e1: 500 },
      expenses: [
        makeExpense("e1", ReconciliationExpenseType.RunningBalance, 500),
      ],
      totalCash: 10000,
    });
    expect(result.shortTerm).toBe(0);
  });

  it("treats a missing targetFloat on a short-term account as zero", () => {
    const result = calculateTierTargets({
      accounts: [makeAccount("a1", ReconciliationAccountTier.ShortTerm)],
      expenseAmounts: {},
      expenses: [],
      totalCash: 10000,
    });
    expect(result.shortTerm).toBe(0);
  });
});

describe("calculateTierTargets — reserve target", () => {
  it("includes the targetFloat of all reserve accounts", () => {
    const result = calculateTierTargets({
      accounts: [
        makeAccount("a1", ReconciliationAccountTier.Reserve, 3000),
        makeAccount("a2", ReconciliationAccountTier.Reserve, 2000),
      ],
      expenseAmounts: {},
      expenses: [],
      totalCash: 10000,
    });
    expect(result.reserve).toBe(5000);
  });

  it("adds RunningBalance expense amounts to the reserve target", () => {
    const result = calculateTierTargets({
      accounts: [makeAccount("a1", ReconciliationAccountTier.Reserve, 0)],
      expenseAmounts: { e1: 800, e2: 400 },
      expenses: [
        makeExpense("e1", ReconciliationExpenseType.RunningBalance, 850),
        makeExpense("e2", ReconciliationExpenseType.RunningBalance, 420),
      ],
      totalCash: 10000,
    });
    expect(result.reserve).toBe(1200);
  });

  it("falls back to typicalAmount when expenseAmount is undefined for RunningBalance", () => {
    const result = calculateTierTargets({
      accounts: [],
      expenseAmounts: {},
      expenses: [
        makeExpense("e1", ReconciliationExpenseType.RunningBalance, 600),
      ],
      totalCash: 10000,
    });
    expect(result.reserve).toBe(600);
  });

  it("does not include StatementBalance expenses in the reserve target", () => {
    const result = calculateTierTargets({
      accounts: [],
      expenseAmounts: { e1: 120 },
      expenses: [
        makeExpense("e1", ReconciliationExpenseType.StatementBalance, 120),
      ],
      totalCash: 10000,
    });
    expect(result.reserve).toBe(0);
  });
});

describe("calculateTierTargets — long-term target", () => {
  it("is totalCash minus short-term and reserve targets", () => {
    const result = calculateTierTargets({
      accounts: [
        makeAccount("a1", ReconciliationAccountTier.ShortTerm, 1000),
        makeAccount("a2", ReconciliationAccountTier.Reserve, 3000),
      ],
      expenseAmounts: {},
      expenses: [],
      totalCash: 10000,
    });
    expect(result.longTerm).toBe(6000);
  });

  it("is the full totalCash when no short-term or reserve accounts or expenses exist", () => {
    const result = calculateTierTargets({
      accounts: [],
      expenseAmounts: {},
      expenses: [],
      totalCash: 5000,
    });
    expect(result.longTerm).toBe(5000);
  });
});
