import { afterEach, describe, expect, it } from "vitest";

import {
  type BudgetLedgerTransaction,
  BudgetLedgerTransactionType,
} from "@/lib/firebase/schema/budget-ledger-transactions";

import { computeMonthlyDepositRate } from "../goal-funding";

function makeTransaction(
  overrides: Partial<BudgetLedgerTransaction> = {},
): BudgetLedgerTransaction {
  return {
    id: "tx-1",
    ledgerId: "ledger-1",
    type: BudgetLedgerTransactionType.Deposit,
    date: new Date("2025-01-01"), // Jan 1, 2025 UTC midnight (matches production)
    amount: 500,
    description: "Test deposit",
    ...overrides,
  };
}

// Reference date used across tests for determinism (local Jun 1, 2025)
const REF_DATE = new Date(2025, 5, 1);

describe("computeMonthlyDepositRate", () => {
  describe("returns 0 for empty or deposit-free transaction sets", () => {
    it("returns 0 when there are no transactions", () => {
      expect(computeMonthlyDepositRate([], REF_DATE)).toBe(0);
    });

    it("returns 0 when there are only expense transactions", () => {
      const transactions = [
        makeTransaction({
          type: BudgetLedgerTransactionType.Expense,
          amount: 200,
          date: new Date("2025-01-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(0);
    });
  });

  describe("computes deposit rate over the correct time window", () => {
    it("divides total deposits by calendar months from first deposit to reference", () => {
      // Jan to Jun = 5 calendar months; total = $1500 → $300/month
      const transactions = [
        makeTransaction({ amount: 600, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-2",
          amount: 600,
          date: new Date("2025-03-01"),
        }),
        makeTransaction({
          id: "tx-3",
          amount: 300,
          date: new Date("2025-05-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(300);
    });

    it("uses a minimum window of 1 month when all deposits are in the reference month", () => {
      // All deposits in Jun 2025 → 0 elapsed months → clamped to 1
      const transactions = [
        makeTransaction({ amount: 900, date: new Date("2025-06-01") }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(900);
    });

    it("ignores expense amounts but uses all deposit dates for the window", () => {
      // Deposits: Jan $600 + Apr $600 = $1200; expenses excluded from total.
      // Window: Jan to Jun = 5 months → $240/month
      const transactions = [
        makeTransaction({ amount: 600, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-expense",
          type: BudgetLedgerTransactionType.Expense,
          amount: 999,
          date: new Date("2025-02-01"),
        }),
        makeTransaction({
          id: "tx-2",
          amount: 600,
          date: new Date("2025-04-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(240);
    });
  });

  describe("excludes future-dated deposits", () => {
    it("returns 0 when all deposits are after the reference date", () => {
      // Only future deposits (Jul 2025) — nothing to base a rate on
      const transactions = [
        makeTransaction({ amount: 600, date: new Date("2025-07-01") }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(0);
    });

    it("excludes future deposits from the total but includes past deposits", () => {
      // Past: Jan $600; future: Jul $1200 (should be excluded).
      // Window: Jan to Jun = 5 months → $120/month
      const transactions = [
        makeTransaction({ amount: 600, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-future",
          amount: 1200,
          date: new Date("2025-07-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(120);
    });

    it("uses the reference-date month itself as in-window (not future)", () => {
      // Deposit on Jun 1 (same as REF_DATE) is not future — it counts.
      // Window is clamped to min 1; $900 / 1 = $900
      const transactions = [
        makeTransaction({ amount: 900, date: new Date("2025-06-01") }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(900);
    });

    it("includes a UTC-midnight deposit on the same local calendar day as referenceDate", () => {
      // Deposit dates travel through the system as UTC midnight (new Date("YYYY-MM-DD")).
      // A same-day deposit must be included even when referenceDate has a time component,
      // which requires normalising the comparison to local-date UTC midnight.
      const refDateWithTime = new Date(2025, 5, 15, 12, 0, 0); // June 15 at noon local
      const sameDayDeposit = new Date("2025-06-15"); // UTC midnight June 15
      const transactions = [
        makeTransaction({ amount: 300, date: sameDayDeposit }),
      ];
      // $300 over min 1 month = $300/month
      expect(computeMonthlyDepositRate(transactions, refDateWithTime)).toBe(
        300,
      );
    });

    it("excludes a UTC-midnight deposit dated the next local calendar day", () => {
      // A deposit dated June 16 (UTC midnight) must be excluded when referenceDate is
      // June 15 (any local time), because June 16 is a future date relative to June 15.
      const refDateWithTime = new Date(2025, 5, 15, 12, 0, 0); // June 15 at noon local
      const transactions = [
        makeTransaction({ amount: 300, date: new Date("2025-06-15") }),
        makeTransaction({
          id: "tx-next",
          amount: 600,
          date: new Date("2025-06-16"),
        }),
      ];
      // Only June 15 deposit ($300) counts — June 16 is excluded
      expect(computeMonthlyDepositRate(transactions, refDateWithTime)).toBe(
        300,
      );
    });

    it("excludes a future-dated deposit from the sum and earliest-deposit anchor", () => {
      // Jan 2026 deposit is after REF_DATE (Jun 2025) — it must not contribute
      // to the sum or serve as the earliest-deposit anchor.
      // Only Jan 2025 ($600) counts: window = 5 months → $120/month.
      const transactions = [
        makeTransaction({ amount: 600, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-future",
          amount: 600,
          date: new Date("2026-01-01"), // Jan 2026 — clearly future
        }),
      ];
      // Only Jan 2025 deposit counts: $600 over 5 months = $120/month
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(120);
    });
  });

  describe("uses the exact cash-allocated portion of each deposit when cashCap is provided", () => {
    it("counts only the cash portion of each deposit against the running balance", () => {
      // cashCap = 500. Replaying through the split:
      //   $800 deposit: cash fills to 500 (cash portion $500), $300 overflows.
      //   $600 deposit: cash already at 500, so cash portion is $0.
      // Total cash = $500 over 5 months → $100/month. The old Math.min(amount,
      // cashCap) approximation would count $500 + $500 = $1000 → $200/month.
      const transactions = [
        makeTransaction({ amount: 800, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-2",
          amount: 600,
          date: new Date("2025-04-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, 500)).toBe(100);
    });

    it("does not overstate the rate when the cash balance is persistently high", () => {
      // Reproduces the issue's example. cashCap = 500.
      //   $450 deposit: cash portion $450 (cash now at 450).
      //   $1000 deposit: only $50 fits before the cap (cash portion $50).
      // Total cash = $500 over 5 months → $100/month. The old approximation
      // would count $450 + min(1000, 500) = $950 → $190/month.
      const transactions = [
        makeTransaction({ amount: 450, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-2",
          amount: 1000,
          date: new Date("2025-04-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, 500)).toBe(100);
    });

    it("frees cap space for later deposits when an expense draws cash down", () => {
      // cashCap = 500.
      //   $500 deposit: cash portion $500 (cash now at cap, 500).
      //   $400 expense: draws cash down to 100, freeing $400 of cap space.
      //   $500 deposit: only $400 fits before the cap (cash portion $400).
      // Total in-window deposit cash = $500 + $400 = $900 over 5 months → $180.
      const transactions = [
        makeTransaction({ amount: 500, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-expense",
          type: BudgetLedgerTransactionType.Expense,
          amount: 400,
          date: new Date("2025-02-01"),
        }),
        makeTransaction({
          id: "tx-2",
          amount: 500,
          date: new Date("2025-04-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, 500)).toBe(180);
    });

    it("counts the full amount of deposits that stay below the cap", () => {
      // cashCap = 1000; deposits of $600 then $400 stay within the cap, so the
      // full $1000 is cash. Over 5 months → $200/month (same as uncapped).
      const transactions = [
        makeTransaction({ amount: 600, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-2",
          amount: 400,
          date: new Date("2025-04-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, 1000)).toBe(200);
    });

    it("behaves identically to no cashCap when cashCap is undefined", () => {
      // $600 deposit, Jan to Jun = 5 months → $120/month with or without cap
      const transactions = [
        makeTransaction({ amount: 600, date: new Date("2025-01-01") }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, undefined)).toBe(
        computeMonthlyDepositRate(transactions, REF_DATE),
      );
    });
  });

  describe("derives the window from UTC months regardless of local timezone", () => {
    const originalTZ = process.env["TZ"];
    afterEach(() => {
      if (originalTZ === undefined) {
        delete process.env["TZ"];
      } else {
        process.env["TZ"] = originalTZ;
      }
    });

    it("counts the earliest deposit's UTC month in a negative-offset timezone", () => {
      // Deposit dates are stored as UTC midnight. In UTC-7, local-time getters on
      // a UTC-midnight Jan 1 read the prior Dec 31, inflating the elapsed window by
      // a month and lowering the rate. Pinning the timezone makes the regression
      // deterministic even though CI itself runs in UTC.
      process.env["TZ"] = "America/Denver";
      const transactions = [
        makeTransaction({ amount: 600, date: new Date("2025-01-01") }),
      ];
      const referenceDate = new Date(2025, 5, 15); // local June 15
      // Jan → Jun = 5 months; $600 / 5 = $120 (a local-getter regression yields $100)
      expect(computeMonthlyDepositRate(transactions, referenceDate)).toBe(120);
    });
  });
});
