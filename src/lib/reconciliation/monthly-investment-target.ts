import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";

import { calculateLedgerBalance } from "./ledger-balance";

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
  const { investmentBalance } = calculateLedgerBalance({
    cashCap,
    startingCashBalance,
    startingInvestmentBalance,
    transactions,
  });
  return { netInvestmentTarget: investmentBalance - startingInvestmentBalance };
}
