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
 */
export function computeMonthlyDepositRate(
  transactions: BudgetLedgerTransaction[],
  referenceDate: Date = new Date(),
): number {
  const deposits = transactions.filter(
    (tx) => tx.type === BudgetLedgerTransactionType.Deposit,
  );

  if (deposits.length === 0) return 0;

  const totalDeposits = deposits.reduce((sum, tx) => sum + tx.amount, 0);

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
 * Computes the Zipf weight for a goal with the given priority within an ordered
 * list of goals. Goals are allocated a share of the monthly budget proportional
 * to 1/priority, normalised so all shares sum to 1.
 */
function zipfShare(priority: number, goals: BudgetLedgerSavingsGoal[]): number {
  const harmonic = goals.reduce((sum, g) => sum + 1 / g.priority, 0);
  if (harmonic === 0) return 0;
  return 1 / priority / harmonic;
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
 */
export function computeGoalEta(
  goal: BudgetLedgerSavingsGoal,
  allGoals: BudgetLedgerSavingsGoal[],
  monthlyAllocation: number,
  referenceDate: Date = new Date(),
): Date | undefined {
  if (monthlyAllocation === 0) return undefined;

  const remaining = goal.targetAmount - goal.fundedAmount;
  if (remaining <= 0) return undefined;

  const share = zipfShare(goal.priority, allGoals);
  const monthlyForGoal = monthlyAllocation * share;

  if (monthlyForGoal === 0) return undefined;

  const monthsNeeded = Math.ceil(remaining / monthlyForGoal);

  return new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + monthsNeeded,
    1,
  );
}
