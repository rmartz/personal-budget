import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

import { applyDepositSplit } from "./deposit-split";
import { applyExpenseDeduction } from "./expense-deduction";

export interface LedgerBalanceInput {
  cashCap: number | undefined;
  transactions: BudgetLedgerTransaction[];
}

export interface LedgerBalanceResult {
  cashBalance: number;
  investmentBalance: number;
}

/**
 * Computes the cash and investment balance of a ledger by replaying its
 * transactions in chronological order.
 *
 * Deposits fill the cash portion up to the cash cap; any amount above the cap
 * overflows into the investment portion. Expenses deduct from cash first; when
 * cash is exhausted, the remainder deducts from investment.
 */
export function calculateLedgerBalance({
  cashCap,
  transactions,
}: LedgerBalanceInput): LedgerBalanceResult {
  const sorted = [...transactions].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  return sorted.reduce<LedgerBalanceResult>(
    (balance, tx) => {
      if (tx.type === BudgetLedgerTransactionType.Deposit) {
        return applyDepositSplit({
          cashBalance: balance.cashBalance,
          cashCap,
          depositAmount: tx.amount,
          investmentBalance: balance.investmentBalance,
        });
      }
      const next = applyExpenseDeduction({
        cashBalance: balance.cashBalance,
        expenseAmount: tx.amount,
        investmentBalance: balance.investmentBalance,
      });
      return {
        cashBalance: Math.max(0, next.cashBalance),
        investmentBalance: Math.max(0, next.investmentBalance),
      };
    },
    { cashBalance: 0, investmentBalance: 0 },
  );
}
