import { describe, expect, it } from "vitest";

import {
  type BudgetLedgerTransaction,
  BudgetLedgerTransactionType,
} from "@/lib/firebase/schema/budget-ledger-transactions";

import { calculateMonthlyInvestmentTarget } from "./monthly-investment-target";

function makeDeposit(amount: number, daysAgo = 0): BudgetLedgerTransaction {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id: `deposit-${String(amount)}-${String(daysAgo)}`,
    ledgerId: "ledger-1",
    type: BudgetLedgerTransactionType.Deposit,
    date,
    amount,
    description: "deposit",
  };
}

function makeExpense(amount: number, daysAgo = 0): BudgetLedgerTransaction {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id: `expense-${String(amount)}-${String(daysAgo)}`,
    ledgerId: "ledger-1",
    type: BudgetLedgerTransactionType.Expense,
    date,
    amount,
    description: "expense",
  };
}

describe("calculateMonthlyInvestmentTarget — no transactions", () => {
  it("returns zero net when there are no transactions", () => {
    const result = calculateMonthlyInvestmentTarget({
      cashCap: 1000,
      startingCashBalance: 200,
      startingInvestmentBalance: 500,
      transactions: [],
    });
    expect(result.netInvestmentTarget).toBe(0);
  });
});

describe("calculateMonthlyInvestmentTarget — deposits only", () => {
  it("returns zero net when deposits stay within the cash cap", () => {
    const result = calculateMonthlyInvestmentTarget({
      cashCap: 1000,
      startingCashBalance: 0,
      startingInvestmentBalance: 300,
      transactions: [makeDeposit(400)],
    });
    expect(result.netInvestmentTarget).toBe(0);
  });

  it("returns positive net equal to overflow when deposits exceed the cap", () => {
    const result = calculateMonthlyInvestmentTarget({
      cashCap: 1000,
      startingCashBalance: 0,
      startingInvestmentBalance: 0,
      transactions: [makeDeposit(1400)],
    });
    expect(result.netInvestmentTarget).toBe(400);
  });

  it("returns zero net when there is no cash cap (all deposits go to cash)", () => {
    const result = calculateMonthlyInvestmentTarget({
      cashCap: undefined,
      startingCashBalance: 0,
      startingInvestmentBalance: 150,
      transactions: [makeDeposit(600)],
    });
    expect(result.netInvestmentTarget).toBe(0);
  });

  it("accounts for existing cash balance when computing cap overflow", () => {
    // Cash is already 800 of 1000 cap; a 400 deposit puts 200 to cash and 200 to investment
    const result = calculateMonthlyInvestmentTarget({
      cashCap: 1000,
      startingCashBalance: 800,
      startingInvestmentBalance: 0,
      transactions: [makeDeposit(400)],
    });
    expect(result.netInvestmentTarget).toBe(200);
  });
});

describe("calculateMonthlyInvestmentTarget — expenses only", () => {
  it("returns zero net when expenses are covered by cash", () => {
    const result = calculateMonthlyInvestmentTarget({
      cashCap: 1000,
      startingCashBalance: 500,
      startingInvestmentBalance: 300,
      transactions: [makeExpense(200)],
    });
    expect(result.netInvestmentTarget).toBe(0);
  });

  it("returns negative net when expenses draw from investment", () => {
    // Cash covers 100; remaining 150 drawn from investment
    const result = calculateMonthlyInvestmentTarget({
      cashCap: 1000,
      startingCashBalance: 100,
      startingInvestmentBalance: 400,
      transactions: [makeExpense(250)],
    });
    expect(result.netInvestmentTarget).toBe(-150);
  });

  it("clamps investment balance to zero when expense exceeds all available funds", () => {
    // 50 cash + 200 investment = 250 total; expense of 400 exhausts everything
    // Net investment target = 0 - 200 = -200 (full starting investment drawn and clamped)
    const result = calculateMonthlyInvestmentTarget({
      cashCap: 1000,
      startingCashBalance: 50,
      startingInvestmentBalance: 200,
      transactions: [makeExpense(400)],
    });
    expect(result.netInvestmentTarget).toBe(-200);
  });
});

describe("calculateMonthlyInvestmentTarget — mixed transactions", () => {
  it("returns net combining investment gains and draws across transactions", () => {
    // Deposit 1500 from 0 cash (1000 to cash at cap, 500 to investment)
    // Then expense 300 (covered by cash, no investment draw)
    // Net investment = +500
    const result = calculateMonthlyInvestmentTarget({
      cashCap: 1000,
      startingCashBalance: 0,
      startingInvestmentBalance: 0,
      transactions: [makeDeposit(1500, 2), makeExpense(300, 1)],
    });
    expect(result.netInvestmentTarget).toBe(500);
  });
});
