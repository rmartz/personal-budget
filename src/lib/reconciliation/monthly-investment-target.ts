import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

import { applyDepositSplit } from "./deposit-split";
import { applyExpenseDeduction } from "./expense-deduction";

export interface MonthlyInvestmentTargetInput {
  cashCap: number | undefined;
  startingCashBalance: number;
  startingInvestmentBalance: number;
  transactions: BudgetLedgerTransaction[];
}

export interface MonthlyInvestmentTargetResult {
  netInvestmentTarget: number;
}

/**
 * Computes the net investment buy/sell target for a single ledger over a
 * given period by replaying its transactions from the provided starting balances.
 *
 * A positive result means the investment portion grew (buy signal); a negative
 * result means the investment portion shrank (sell signal). The caller is
 * responsible for passing only the transactions that fall within the period of
 * interest (e.g. a single calendar month).
 *
 * Deposit overflow: deposits fill cash up to the cap; any remainder goes to
 * investment. Expense shortfall: expenses draw from cash first; when cash is
 * exhausted the remainder deducts from investment. Balances are clamped to zero.
 */
export function calculateMonthlyInvestmentTarget({
  cashCap,
  startingCashBalance,
  startingInvestmentBalance,
  transactions,
}: MonthlyInvestmentTargetInput): MonthlyInvestmentTargetResult {
  const sorted = [...transactions].sort((a, b) => {
    const dateDiff = a.date.getTime() - b.date.getTime();
    if (dateDiff !== 0) return dateDiff;
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
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  const ending = sorted.reduce(
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

  return {
    netInvestmentTarget: ending.investmentBalance - startingInvestmentBalance,
  };
}
