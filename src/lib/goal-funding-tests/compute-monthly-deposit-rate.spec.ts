import { afterEach, describe, expect, it } from "vitest";

import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

import { computeMonthlyDepositRate } from "../goal-funding";
import { makeTransaction, REF_DATE } from "./fixtures";

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

  describe("uses the exact cash split against the running cap", () => {
    it("counts only the cash portion once the cap is reached", () => {
      // cashCap = 500. The $800 deposit fills the cap ($500 to cash); the later
      // $600 deposit finds the cap already full and adds $0 to cash — the exact
      // split, not the $500-per-deposit upper bound the old clamp assumed.
      // Total cash: $500 over 5 months → $100/month.
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

    it("counts the full deposit while cash stays under the cap", () => {
      // cashCap = 1000; $600 then $400 keep the running cash balance at/under the
      // cap, so both flow fully into cash. Total: $1000 over 5 months → $200/month.
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

    it("frees cap space when an expense draws cash down", () => {
      // cashCap = 500. Jan $500 fills the cap; the Feb $200 expense draws cash to
      // $300, freeing $200 of cap space; Mar $400 then contributes $200 to cash.
      // Windowed cash: $500 + $200 = $700 over 5 months → $140/month. Without the
      // expense the Mar deposit would have added $0 — the running balance is what
      // makes the split exact.
      const transactions = [
        makeTransaction({ amount: 500, date: new Date("2025-01-01") }),
        makeTransaction({
          id: "tx-expense",
          type: BudgetLedgerTransactionType.Expense,
          amount: 200,
          date: new Date("2025-02-01"),
        }),
        makeTransaction({
          id: "tx-2",
          amount: 400,
          date: new Date("2025-03-01"),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, 500)).toBe(140);
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
