export interface AllocationAccount {
  accountId: string;
  currentBalance: number;
  targetPercent: number;
}

export interface AllocationResult {
  accountId: string;
  allocatedAmount: number;
}

/**
 * Distributes a recommended investment amount across accounts weighted by
 * how far each account is below its target allocation.
 *
 * For a given total amount R:
 * - Compute each account's current share: balance / Σ(all balances)
 * - Compute each account's gap: targetPercent / 100 − current share
 * - Distribute R across accounts weighted by their positive gaps
 *   (accounts above target receive nothing in this pass)
 *
 * Falls back to distributing by target percent when no account has a
 * positive gap (i.e. all accounts are at or above their targets).
 * Note: accounts with zero balances produce positive gaps equal to their
 * target fraction, so they naturally take the gap-weighted path.
 *
 * Returns an empty array for an empty input. Accounts whose target percents
 * all sum to zero receive zero allocations regardless of totalAmount.
 */
export function distributeInvestmentAllocation(
  accounts: AllocationAccount[],
  totalAmount: number,
): AllocationResult[] {
  if (accounts.length === 0) return [];

  const totalBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);

  const gaps = accounts.map((account) => {
    const currentShare =
      totalBalance > 0 ? account.currentBalance / totalBalance : 0;
    return account.targetPercent / 100 - currentShare;
  });

  const totalPositiveGap = gaps.reduce(
    (sum, gap) => (gap > 0 ? sum + gap : sum),
    0,
  );

  if (totalPositiveGap > 0) {
    return accounts.map((account, i) => {
      const gap = gaps[i] ?? 0;
      return {
        accountId: account.accountId,
        allocatedAmount: gap > 0 ? (gap / totalPositiveGap) * totalAmount : 0,
      };
    });
  }

  const totalTargetPercent = accounts.reduce(
    (sum, a) => sum + a.targetPercent,
    0,
  );

  if (totalTargetPercent <= 0) {
    return accounts.map((account) => ({
      accountId: account.accountId,
      allocatedAmount: 0,
    }));
  }

  return accounts.map((account) => ({
    accountId: account.accountId,
    allocatedAmount: (account.targetPercent / totalTargetPercent) * totalAmount,
  }));
}
