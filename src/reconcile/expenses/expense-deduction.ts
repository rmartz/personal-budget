export interface ExpenseDeductionInput {
  cashBalance: number;
  expenseAmount: number;
  investmentBalance: number;
}

export interface ExpenseDeductionResult {
  cashBalance: number;
  investmentBalance: number;
}

/**
 * Applies an expense deduction to a ledger's cash/investment balance split.
 *
 * Expenses draw from the cash portion first. When cash is exhausted, any
 * remaining expense amount deducts from the investment portion.
 */
export function applyExpenseDeduction({
  cashBalance,
  expenseAmount,
  investmentBalance,
}: ExpenseDeductionInput): ExpenseDeductionResult {
  const cashDeduction = Math.min(expenseAmount, cashBalance);
  const investmentDeduction = expenseAmount - cashDeduction;

  return {
    cashBalance: cashBalance - cashDeduction,
    investmentBalance: investmentBalance - investmentDeduction,
  };
}
