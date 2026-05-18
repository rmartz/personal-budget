import {
  ReconciliationAccount,
  ReconciliationAccountTier,
} from "@/lib/firebase/schema/reconciliation-accounts";
import {
  ReconciliationExpense,
  ReconciliationExpenseType,
} from "@/lib/firebase/schema/reconciliation-expenses";

export interface TierTargetInputs {
  accounts: ReconciliationAccount[];
  expenseAmounts: Record<string, number | undefined>;
  expenses: ReconciliationExpense[];
  totalCash: number;
}

export interface TierTargets {
  longTerm: number;
  reserve: number;
  shortTerm: number;
}

/**
 * Calculates the target balance for each cash account tier:
 *  - Short-term: sum of ShortTerm account targetFloats + StatementBalance expense amounts
 *  - Reserve: sum of Reserve account targetFloats + RunningBalance expense amounts
 *  - Long-term: totalCash − shortTerm − reserve (the remainder)
 *
 * For expenses, uses the entered expenseAmount when available, falling back to typicalAmount.
 */
export function calculateTierTargets({
  accounts,
  expenseAmounts,
  expenses,
  totalCash,
}: TierTargetInputs): TierTargets {
  const shortTermFloat = accounts
    .filter((a) => a.tier === ReconciliationAccountTier.ShortTerm)
    .reduce((sum, a) => sum + (a.targetFloat ?? 0), 0);

  const reserveFloat = accounts
    .filter((a) => a.tier === ReconciliationAccountTier.Reserve)
    .reduce((sum, a) => sum + (a.targetFloat ?? 0), 0);

  const statementBillsTotal = expenses
    .filter((e) => e.type === ReconciliationExpenseType.StatementBalance)
    .reduce((sum, e) => sum + (expenseAmounts[e.id] ?? e.typicalAmount), 0);

  const runningBillsTotal = expenses
    .filter((e) => e.type === ReconciliationExpenseType.RunningBalance)
    .reduce((sum, e) => sum + (expenseAmounts[e.id] ?? e.typicalAmount), 0);

  const shortTerm = shortTermFloat + statementBillsTotal;
  const reserve = reserveFloat + runningBillsTotal;
  const longTerm = totalCash - shortTerm - reserve;

  return { longTerm, reserve, shortTerm };
}
