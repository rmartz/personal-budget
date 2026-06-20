import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

import { applyDepositSplit } from "./deposit-split";
import { applyExpenseDeduction } from "./expense-deduction";

export interface LedgerBalanceInput {
  cashCap: number | undefined;
  startingCashBalance?: number;
  startingInvestmentBalance?: number;
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
 *
 * @param startingCashBalance - Initial cash balance before replaying
 *   transactions. Defaults to 0. Pass a non-zero value to continue from an
 *   arbitrary balance, e.g. when chaining multi-period calculations.
 * @param startingInvestmentBalance - Initial investment balance before
 *   replaying transactions. Defaults to 0. Pass a non-zero value to continue
 *   from an arbitrary balance, e.g. when chaining multi-period calculations.
 */
export function calculateLedgerBalance({
  cashCap,
  startingCashBalance = 0,
  startingInvestmentBalance = 0,
  transactions,
}: LedgerBalanceInput): LedgerBalanceResult {
  const dayOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const sorted = [...transactions].sort((a, b) => {
    const dateDiff = dayOf(a.date) - dayOf(b.date);
    if (dateDiff !== 0) return dateDiff;
    // Same day: deposits before expenses so same-day deposits can fund same-day expenses
    if (
      a.type === BudgetLedgerTransactionType.Deposit &&
      b.type === BudgetLedgerTransactionType.Expense
    )
      return -1;
    if (
      a.type === BudgetLedgerTransactionType.Expense &&
      b.type === BudgetLedgerTransactionType.Deposit
    )
      return 1;
    // Same type, same day: stable ordering by id
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

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
    {
      cashBalance: startingCashBalance,
      investmentBalance: startingInvestmentBalance,
    },
  );
}
