export interface LedgerAccountTarget {
  accountId: string;
  netInvestmentTarget: number;
}

export interface AccountMonthlyTransaction {
  accountId: string;
  netTransactionAmount: number;
}

/**
 * Aggregates per-ledger monthly net investment targets into a single net
 * transaction per investment account.
 *
 * Each entry in `targets` provides the net buy/sell signal (positive = buy,
 * negative = sell) computed for one budget ledger and its associated investment
 * account. This function groups entries by `accountId` and sums the targets,
 * returning one `AccountMonthlyTransaction` per account.
 */
export function aggregateMonthlyInvestmentTargets(
  targets: LedgerAccountTarget[],
): AccountMonthlyTransaction[] {
  const totals = new Map<string, number>();

  for (const { accountId, netInvestmentTarget } of targets) {
    totals.set(accountId, (totals.get(accountId) ?? 0) + netInvestmentTarget);
  }

  return Array.from(totals.entries()).map(
    ([accountId, netTransactionAmount]) => ({
      accountId,
      netTransactionAmount,
    }),
  );
}
