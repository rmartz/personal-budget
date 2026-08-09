export interface AccountSnapshot {
  accountId: string;
  balance: number;
}

export interface LedgerInvestmentPortion {
  investmentBalance: number;
  ledgerId: string;
}

export interface InvestmentMarginInput {
  accountSnapshots: AccountSnapshot[];
  ledgerInvestmentPortions: LedgerInvestmentPortion[];
}

export interface InvestmentMarginResult {
  margin: number;
}

/**
 * Calculates the investment margin: the difference between the sum of actual
 * investment account balance snapshots and the sum of theoretical investment
 * portions implied by budget ledger balances.
 *
 * A positive margin means actual investments exceed the theoretical amount
 * (user is ahead of target). A negative margin means actual investments fall
 * short of the theoretical amount (user is behind target).
 */
export function calculateInvestmentMargin({
  accountSnapshots,
  ledgerInvestmentPortions,
}: InvestmentMarginInput): InvestmentMarginResult {
  const totalAccountBalance = accountSnapshots.reduce(
    (sum, s) => sum + s.balance,
    0,
  );
  const totalLedgerPortions = ledgerInvestmentPortions.reduce(
    (sum, l) => sum + l.investmentBalance,
    0,
  );
  return { margin: totalAccountBalance - totalLedgerPortions };
}
