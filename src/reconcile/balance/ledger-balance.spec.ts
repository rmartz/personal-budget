import { describe, expect, it } from "vitest";

import {
  type BudgetLedgerTransaction,
  BudgetLedgerTransactionType,
} from "@/lib/firebase/schema/budget-ledger-transactions";

import { calculateLedgerBalance } from "./ledger-balance";

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

describe("calculateLedgerBalance — no transactions", () => {
  it("returns zero balances when there are no transactions", () => {
    const result = calculateLedgerBalance({
      cashCap: 1000,
      transactions: [],
    });
    expect(result.cashBalance).toBe(0);
    expect(result.investmentBalance).toBe(0);
  });
});

describe("calculateLedgerBalance — deposits only", () => {
  it("accumulates deposits into cash when total is below the cap", () => {
    const result = calculateLedgerBalance({
      cashCap: 1000,
      transactions: [makeDeposit(300), makeDeposit(200)],
    });
    expect(result.cashBalance).toBe(500);
    expect(result.investmentBalance).toBe(0);
  });

  it("fills cash to the cap and overflows the remainder into investment", () => {
    const result = calculateLedgerBalance({
      cashCap: 1000,
      transactions: [makeDeposit(800), makeDeposit(400)],
    });
    expect(result.cashBalance).toBe(1000);
    expect(result.investmentBalance).toBe(200);
  });

  it("accumulates all deposits into cash when there is no cash cap", () => {
    const result = calculateLedgerBalance({
      cashCap: undefined,
      transactions: [makeDeposit(500), makeDeposit(300)],
    });
    expect(result.cashBalance).toBe(800);
    expect(result.investmentBalance).toBe(0);
  });
});

describe("calculateLedgerBalance — expenses only", () => {
  it("returns zero balances when expenses are applied to a zero balance", () => {
    const result = calculateLedgerBalance({
      cashCap: 1000,
      transactions: [makeExpense(200)],
    });
    expect(result.cashBalance).toBe(0);
    expect(result.investmentBalance).toBe(0);
  });
});

describe("calculateLedgerBalance — optional starting balances", () => {
  it("starts from the provided startingCashBalance instead of zero", () => {
    const result = calculateLedgerBalance({
      cashCap: 1000,
      startingCashBalance: 400,
      transactions: [],
    });
    expect(result.cashBalance).toBe(400);
    expect(result.investmentBalance).toBe(0);
  });

  it("starts from the provided startingInvestmentBalance instead of zero", () => {
    const result = calculateLedgerBalance({
      cashCap: 1000,
      startingInvestmentBalance: 250,
      transactions: [],
    });
    expect(result.cashBalance).toBe(0);
    expect(result.investmentBalance).toBe(250);
  });

  it("applies transactions on top of both starting balances", () => {
    // Cash already 800 of 1000 cap; deposit 400 fills 200 to cash and 200 to investment.
    // Starting investment 100 + 200 overflow = 300.
    const result = calculateLedgerBalance({
      cashCap: 1000,
      startingCashBalance: 800,
      startingInvestmentBalance: 100,
      transactions: [makeDeposit(400)],
    });
    expect(result.cashBalance).toBe(1000);
    expect(result.investmentBalance).toBe(300);
  });

  it("deducts an expense from the starting cash balance", () => {
    // Starting cash 500; expense 200; no investment draw needed.
    const result = calculateLedgerBalance({
      cashCap: 1000,
      startingCashBalance: 500,
      startingInvestmentBalance: 300,
      transactions: [makeExpense(200)],
    });
    expect(result.cashBalance).toBe(300);
    expect(result.investmentBalance).toBe(300);
  });
});

describe("calculateLedgerBalance — mixed transactions", () => {
  it("deducts expenses from cash before investment", () => {
    const result = calculateLedgerBalance({
      cashCap: 1000,
      transactions: [makeDeposit(1500, 3), makeExpense(300, 2)],
    });
    expect(result.cashBalance).toBe(700);
    expect(result.investmentBalance).toBe(500);
  });

  it("draws from investment when an expense exceeds the cash balance", () => {
    const result = calculateLedgerBalance({
      cashCap: 1000,
      transactions: [makeDeposit(1500, 3), makeExpense(1200, 2)],
    });
    expect(result.cashBalance).toBe(0);
    expect(result.investmentBalance).toBe(300);
  });

  it("processes transactions in chronological order", () => {
    // Deposit 500 on day 2 (older), deposit 800 on day 1 (newer)
    // With cap 1000: first 500 fills cash, then 500 of 800 fills cash to cap,
    // remaining 300 goes to investment.
    const result = calculateLedgerBalance({
      cashCap: 1000,
      transactions: [makeDeposit(800, 1), makeDeposit(500, 2)],
    });
    expect(result.cashBalance).toBe(1000);
    expect(result.investmentBalance).toBe(300);
  });

  it("applies deposits before expenses on the same day so the deposit funds the expense", () => {
    // Deposit 500 and spend 200 on the same day (daysAgo = 0).
    // Even though the expense appears first in the array, the deposit must be
    // processed first so the expense can be deducted from the resulting balance.
    const result = calculateLedgerBalance({
      cashCap: 1000,
      transactions: [makeExpense(200, 0), makeDeposit(500, 0)],
    });
    expect(result.cashBalance).toBe(300);
    expect(result.investmentBalance).toBe(0);
  });
});
