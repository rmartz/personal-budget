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
});
