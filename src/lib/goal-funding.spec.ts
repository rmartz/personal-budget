import { describe, expect, it } from "vitest";

import {
  type BudgetLedgerTransaction,
  BudgetLedgerTransactionType,
} from "@/lib/firebase/schema/budget-ledger-transactions";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import {
  computeGoalEta,
  computeGoalEtaFromShare,
  computeMonthlyDepositRate,
  computeZipfShares,
} from "./goal-funding";

function makeTransaction(
  overrides: Partial<BudgetLedgerTransaction> = {},
): BudgetLedgerTransaction {
  return {
    id: "tx-1",
    ledgerId: "ledger-1",
    type: BudgetLedgerTransactionType.Deposit,
    date: new Date(2025, 0, 1), // Jan 1, 2025 local
    amount: 500,
    description: "Test deposit",
    ...overrides,
  };
}

function makeGoal(
  overrides: Partial<BudgetLedgerSavingsGoal> = {},
): BudgetLedgerSavingsGoal {
  return {
    id: "goal-1",
    ledgerId: "ledger-1",
    name: "Test Goal",
    targetAmount: 1000,
    fundedAmount: 0,
    priority: 1,
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
        makeTransaction({ amount: 600, date: new Date(2025, 0, 1) }),
        makeTransaction({
          id: "tx-2",
          amount: 600,
          date: new Date(2025, 2, 1),
        }),
        makeTransaction({
          id: "tx-3",
          amount: 300,
          date: new Date(2025, 4, 1),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(300);
    });

    it("uses a minimum window of 1 month when all deposits are in the reference month", () => {
      // All deposits in Jun 2025 → 0 elapsed months → clamped to 1
      const transactions = [
        makeTransaction({ amount: 900, date: new Date(2025, 5, 1) }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(900);
    });

    it("ignores expense amounts but uses all deposit dates for the window", () => {
      // Deposits: Jan $600 + Apr $600 = $1200; expenses excluded from total.
      // Window: Jan to Jun = 5 months → $240/month
      const transactions = [
        makeTransaction({ amount: 600, date: new Date(2025, 0, 1) }),
        makeTransaction({
          id: "tx-expense",
          type: BudgetLedgerTransactionType.Expense,
          amount: 999,
          date: new Date(2025, 1, 1),
        }),
        makeTransaction({
          id: "tx-2",
          amount: 600,
          date: new Date(2025, 3, 1),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(240);
    });
  });

  describe("excludes future-dated deposits", () => {
    it("returns 0 when all deposits are after the reference date", () => {
      // Only future deposits (Jul 2025) — nothing to base a rate on
      const transactions = [
        makeTransaction({ amount: 600, date: new Date(2025, 6, 1) }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(0);
    });

    it("excludes future deposits from the total but includes past deposits", () => {
      // Past: Jan $600; future: Jul $1200 (should be excluded).
      // Window: Jan to Jun = 5 months → $120/month
      const transactions = [
        makeTransaction({ amount: 600, date: new Date(2025, 0, 1) }),
        makeTransaction({
          id: "tx-future",
          amount: 1200,
          date: new Date(2025, 6, 1),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(120);
    });

    it("uses the reference-date month itself as in-window (not future)", () => {
      // Deposit on Jun 1 (same as REF_DATE) is not future — it counts.
      // Window is clamped to min 1; $900 / 1 = $900
      const transactions = [
        makeTransaction({ amount: 900, date: new Date(2025, 5, 1) }),
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
        makeTransaction({ amount: 600, date: new Date(2025, 0, 1) }),
        makeTransaction({
          id: "tx-future",
          amount: 600,
          date: new Date(2026, 0, 1), // Jan 2026 — clearly future
        }),
      ];
      // Only Jan 2025 deposit counts: $600 over 5 months = $120/month
      expect(computeMonthlyDepositRate(transactions, REF_DATE)).toBe(120);
    });
  });

  describe("clamps each deposit to cashCap when provided", () => {
    it("limits each deposit to the cashCap before summing", () => {
      // cashCap = 500; deposits of $800 and $600 → clamped to $500 each
      // Total cash: $1000 over 5 months → $200/month
      const transactions = [
        makeTransaction({ amount: 800, date: new Date(2025, 0, 1) }),
        makeTransaction({
          id: "tx-2",
          amount: 600,
          date: new Date(2025, 3, 1),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, 500)).toBe(200);
    });

    it("does not clamp deposits that are below cashCap", () => {
      // cashCap = 1000; deposits of $600 and $400 are both under cap
      // Total: $1000 over 5 months → $200/month (same as uncapped)
      const transactions = [
        makeTransaction({ amount: 600, date: new Date(2025, 0, 1) }),
        makeTransaction({
          id: "tx-2",
          amount: 400,
          date: new Date(2025, 3, 1),
        }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, 1000)).toBe(200);
    });

    it("behaves identically to no cashCap when cashCap is undefined", () => {
      // $600 deposit, Jan to Jun = 5 months → $120/month with or without cap
      const transactions = [
        makeTransaction({ amount: 600, date: new Date(2025, 0, 1) }),
      ];
      expect(computeMonthlyDepositRate(transactions, REF_DATE, undefined)).toBe(
        computeMonthlyDepositRate(transactions, REF_DATE),
      );
    });
  });
});

describe("computeGoalEta", () => {
  describe("returns undefined when there is no monthly allocation", () => {
    it("returns undefined when monthlyAllocation is 0", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 0 });
      expect(computeGoalEta(goal, [goal], 0, REF_DATE)).toBeUndefined();
    });
  });

  describe("returns undefined when the goal is already fully funded", () => {
    it("returns undefined when fundedAmount equals targetAmount", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 1000 });
      expect(computeGoalEta(goal, [goal], 500, REF_DATE)).toBeUndefined();
    });

    it("returns undefined when fundedAmount exceeds targetAmount", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 1200 });
      expect(computeGoalEta(goal, [goal], 500, REF_DATE)).toBeUndefined();
    });
  });

  describe("computes ETA for a single goal", () => {
    it("returns a date 2 months out when a $1000 goal gets $500/month with Zipf share 1.0", () => {
      // 1 goal → Zipf share = 1.0; $500/month; $1000 remaining → 2 months
      const goal = makeGoal({
        targetAmount: 1000,
        fundedAmount: 0,
        priority: 1,
      });
      const eta = computeGoalEta(goal, [goal], 500, REF_DATE);
      // REF_DATE = Jun 1, 2025 + 2 months = Aug 1, 2025
      expect(eta).toBeDefined();
      expect(eta!.getFullYear()).toBe(2025);
      expect(eta!.getMonth()).toBe(7); // August (0-indexed)
    });

    it("returns a date 1 month out when the goal needs $250 at $500/month", () => {
      const goal = makeGoal({
        targetAmount: 500,
        fundedAmount: 250,
        priority: 1,
      });
      const eta = computeGoalEta(goal, [goal], 500, REF_DATE);
      // $250 remaining / $500 per month = 0.5 months → round up to 1 month
      expect(eta).toBeDefined();
      expect(eta!.getFullYear()).toBe(2025);
      expect(eta!.getMonth()).toBe(6); // July
    });
  });

  describe("applies Zipf weights across multiple goals", () => {
    it("priority-1 goal gets funded before priority-2 goal with equal remaining amounts", () => {
      const goal1 = makeGoal({
        id: "g1",
        priority: 1,
        targetAmount: 1000,
        fundedAmount: 0,
      });
      const goal2 = makeGoal({
        id: "g2",
        priority: 2,
        targetAmount: 1000,
        fundedAmount: 0,
      });
      const allGoals = [goal1, goal2];

      const eta1 = computeGoalEta(goal1, allGoals, 600, REF_DATE);
      const eta2 = computeGoalEta(goal2, allGoals, 600, REF_DATE);

      expect(eta1).toBeDefined();
      expect(eta2).toBeDefined();
      expect(eta1!.getTime()).toBeLessThan(eta2!.getTime());
    });

    it("distributes monthly allocation by Zipf weights between two goals", () => {
      // 2 goals: Zipf share for priority-1 = (1) / (1 + 0.5) = 2/3
      // Zipf share for priority-2 = (0.5) / (1 + 0.5) = 1/3
      // Monthly allocation: $900; goal1 gets $600/month, goal2 gets $300/month
      // goal1 needs $600 → 1 month; goal2 needs $600 → 2 months
      const goal1 = makeGoal({
        id: "g1",
        priority: 1,
        targetAmount: 600,
        fundedAmount: 0,
      });
      const goal2 = makeGoal({
        id: "g2",
        priority: 2,
        targetAmount: 600,
        fundedAmount: 0,
      });
      const allGoals = [goal1, goal2];

      const eta1 = computeGoalEta(goal1, allGoals, 900, REF_DATE);
      const eta2 = computeGoalEta(goal2, allGoals, 900, REF_DATE);

      expect(eta1).toBeDefined();
      expect(eta2).toBeDefined();
      // goal1: 1 month from Jun → Jul 2025
      expect(eta1!.getMonth()).toBe(6); // July
      // goal2: 2 months from Jun → Aug 2025
      expect(eta2!.getMonth()).toBe(7); // August
    });
  });
});

describe("computeZipfShares", () => {
  describe("returns an empty Map when the goals list is empty", () => {
    it("returns an empty Map for an empty goals array", () => {
      expect(computeZipfShares([])).toEqual(new Map());
    });
  });

  describe("returns a share of 1.0 for a single goal", () => {
    it("single goal gets the full allocation", () => {
      const goal = makeGoal({ id: "g1", priority: 1 });
      const shares = computeZipfShares([goal]);
      expect(shares.get("g1")).toBe(1);
    });
  });

  describe("distributes shares proportionally to 1/priority", () => {
    it("priority-1 gets twice the share of priority-2", () => {
      // harmonic = 1/1 + 1/2 = 1.5; g1 share = 2/3, g2 share = 1/3
      const g1 = makeGoal({ id: "g1", priority: 1 });
      const g2 = makeGoal({ id: "g2", priority: 2 });
      const shares = computeZipfShares([g1, g2]);
      expect(shares.get("g1")).toBeCloseTo(2 / 3);
      expect(shares.get("g2")).toBeCloseTo(1 / 3);
    });

    it("all shares sum to 1 across multiple goals", () => {
      const goals = [
        makeGoal({ id: "g1", priority: 1 }),
        makeGoal({ id: "g2", priority: 2 }),
        makeGoal({ id: "g3", priority: 3 }),
      ];
      const shares = computeZipfShares(goals);
      const total = [...shares.values()].reduce((sum, s) => sum + s, 0);
      expect(total).toBeCloseTo(1);
    });
  });
});

describe("computeGoalEtaFromShare", () => {
  describe("returns undefined when there is no allocation or goal is funded", () => {
    it("returns undefined when monthlyAllocation is 0", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 0 });
      expect(computeGoalEtaFromShare(goal, 1, 0, REF_DATE)).toBeUndefined();
    });

    it("returns undefined when the goal is already fully funded", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 1000 });
      expect(computeGoalEtaFromShare(goal, 1, 500, REF_DATE)).toBeUndefined();
    });

    it("returns undefined when the Zipf share is 0", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 0 });
      expect(computeGoalEtaFromShare(goal, 0, 500, REF_DATE)).toBeUndefined();
    });
  });

  describe("computes the same ETA as computeGoalEta given the matching share", () => {
    it("produces the same date for a single goal with share 1.0", () => {
      const goal = makeGoal({
        targetAmount: 1000,
        fundedAmount: 0,
        priority: 1,
      });
      const etaFromShare = computeGoalEtaFromShare(goal, 1.0, 500, REF_DATE);
      const etaDirect = computeGoalEta(goal, [goal], 500, REF_DATE);
      expect(etaFromShare?.getTime()).toBe(etaDirect?.getTime());
    });

    it("produces the same date for a priority-1 goal in a two-goal set", () => {
      const goal1 = makeGoal({ id: "g1", priority: 1, targetAmount: 600 });
      const goal2 = makeGoal({ id: "g2", priority: 2, targetAmount: 600 });
      const allGoals = [goal1, goal2];
      const shares = computeZipfShares(allGoals);

      const etaFromShare = computeGoalEtaFromShare(
        goal1,
        shares.get("g1") ?? 0,
        900,
        REF_DATE,
      );
      const etaDirect = computeGoalEta(goal1, allGoals, 900, REF_DATE);
      expect(etaFromShare?.getTime()).toBe(etaDirect?.getTime());
    });
  });
});
