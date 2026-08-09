import type { ReconciliationAccount } from "@/lib/firebase/schema/reconciliation-accounts";
import type { ReconciliationExpense } from "@/lib/firebase/schema/reconciliation-expenses";

export interface DataCompletenessInputs {
  accountBalances: Record<string, number | undefined>;
  accounts: ReconciliationAccount[];
  expenseAmounts: Record<string, number | undefined>;
  expenses: ReconciliationExpense[];
}

export interface DataCompletenessResult {
  isComplete: boolean;
  missingAccountIds: string[];
  missingExpenseIds: string[];
}

/**
 * Checks whether all required inputs for the reconciliation dashboard have
 * been provided. An input is considered missing when its entry in the
 * balances/amounts record is absent or explicitly `undefined`.
 *
 * Returns `isComplete: true` only when every account and every expense has a
 * non-undefined value. When incomplete, `missingAccountIds` and
 * `missingExpenseIds` identify exactly which inputs still need to be entered
 * so the dashboard can flag them and label its outputs as projections.
 */
export function checkDataCompleteness({
  accountBalances,
  accounts,
  expenseAmounts,
  expenses,
}: DataCompletenessInputs): DataCompletenessResult {
  const missingAccountIds = accounts
    .filter((a) => accountBalances[a.id] === undefined)
    .map((a) => a.id);

  const missingExpenseIds = expenses
    .filter((e) => expenseAmounts[e.id] === undefined)
    .map((e) => e.id);

  return {
    isComplete:
      missingAccountIds.length === 0 && missingExpenseIds.length === 0,
    missingAccountIds,
    missingExpenseIds,
  };
}
