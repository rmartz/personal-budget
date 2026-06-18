import {
  type BudgetLedgerTransaction,
  BudgetLedgerTransactionType,
} from "@/lib/firebase/schema/budget-ledger-transactions";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

/**
 * Computes the average monthly deposit amount from a transaction history.
 *
 * The time window runs from the calendar month of the earliest deposit to the
 * calendar month of the reference date (exclusive of the start month — e.g.
 * January to June yields 5 months). The window is clamped to a minimum of 1
 * month so a single-month history still yields a meaningful rate.
 *
 * Only deposits on or before `referenceDate` are included — future-dated
 * entries (possible via the deposit dialog) are excluded from both the sum
 * and the earliest-deposit anchor, so they cannot inflate the projected rate.
 *
 * Deposit dates are stored as UTC midnight (from ISO date strings), while
 * `referenceDate` carries a local time component. The comparison is
 * normalised to UTC midnight of the local calendar day so that a deposit
 * dated "today" is always included regardless of the caller's UTC offset.
 *
 * When `cashCap` is provided, each deposit's contribution is clamped to
 * `Math.min(deposit.amount, cashCap)`, reflecting only the portion that flows
 * into the cash split. Omit `cashCap` (or pass `undefined`) for ledgers with
 * no cash cap.
 */
export function computeMonthlyDepositRate(
  transactions: BudgetLedgerTransaction[],
  referenceDate: Date = new Date(),
  cashCap?: number,
): number {
  const refDayUTC = Date.UTC(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const deposits = transactions.filter(
    (tx) =>
      tx.type === BudgetLedgerTransactionType.Deposit &&
      Date.UTC(
        tx.date.getUTCFullYear(),
        tx.date.getUTCMonth(),
        tx.date.getUTCDate(),
      ) <= refDayUTC,
  );

  if (deposits.length === 0) return 0;

  const totalDeposits = deposits.reduce(
    (sum, tx) =>
      sum + (cashCap !== undefined ? Math.min(tx.amount, cashCap) : tx.amount),
    0,
  );

  const earliestDeposit = deposits.reduce((earliest, tx) =>
    tx.date < earliest.date ? tx : earliest,
  );

  const refMonths = referenceDate.getFullYear() * 12 + referenceDate.getMonth();
  const startMonths =
    earliestDeposit.date.getFullYear() * 12 + earliestDeposit.date.getMonth();

  const monthsElapsed = Math.max(1, refMonths - startMonths);

  return totalDeposits / monthsElapsed;
}

/**
 * Computes the Zipf weight for each goal in the set, normalised so all shares
 * sum to 1. The harmonic sum is computed once for the entire set, making this
 * O(n) regardless of how many per-goal projections are subsequently derived.
 *
 * Returns an empty Map when the harmonic sum is 0, which occurs when `goals`
 * is empty or when all goals have non-finite priorities.
 */
export function computeZipfShares(
  goals: BudgetLedgerSavingsGoal[],
): Map<string, number> {
  const harmonic = goals.reduce((sum, g) => sum + 1 / g.priority, 0);
  if (harmonic === 0) return new Map();
  return new Map(goals.map((g) => [g.id, 1 / g.priority / harmonic]));
}

/**
 * Projects the date by which the given goal will be fully funded, given a
 * precomputed Zipf share for that goal and the ledger's monthly allocation.
 *
 * Returns `undefined` when:
 * - `monthlyAllocation` is 0 or `share` is 0 (cannot project without income)
 * - The goal is already fully funded (`fundedAmount >= targetAmount`)
 *
 * Prefer this function in loops where multiple goals share the same denominator
 * set — precompute shares with `computeZipfShares` and pass each goal's share
 * here to keep the total work O(n) instead of O(n²).
 */
export function computeGoalEtaFromShare(
  goal: BudgetLedgerSavingsGoal,
  share: number,
  monthlyAllocation: number,
  referenceDate: Date = new Date(),
): Date | undefined {
  const remaining = goal.targetAmount - goal.fundedAmount;
  if (remaining <= 0) return undefined;

  const monthlyForGoal = monthlyAllocation * share;
  if (!(monthlyForGoal > 0)) return undefined;

  const monthsNeeded = Math.ceil(remaining / monthlyForGoal);

  return new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + monthsNeeded,
    1,
  );
}

/**
 * Projects the date by which the given goal will be fully funded, based on a
 * Zipf-weighted share of the ledger's monthly deposit allocation.
 *
 * Returns `undefined` when:
 * - `monthlyAllocation` is 0 (cannot project without income data)
 * - The goal is already fully funded (`fundedAmount >= targetAmount`)
 *
 * `allGoals` must include `goal` itself so that the Zipf denominator is
 * computed correctly across all competing goals.
 *
 * When projecting ETAs for multiple goals that share the same denominator set,
 * prefer `computeZipfShares` + `computeGoalEtaFromShare` to avoid recomputing
 * the harmonic sum for each goal.
 */
export function computeGoalEta(
  goal: BudgetLedgerSavingsGoal,
  allGoals: BudgetLedgerSavingsGoal[],
  monthlyAllocation: number,
  referenceDate: Date = new Date(),
): Date | undefined {
  if (monthlyAllocation === 0) return undefined;

  const harmonic = allGoals.reduce((sum, g) => sum + 1 / g.priority, 0);
  const share = harmonic === 0 ? 0 : 1 / goal.priority / harmonic;

  return computeGoalEtaFromShare(goal, share, monthlyAllocation, referenceDate);
}
