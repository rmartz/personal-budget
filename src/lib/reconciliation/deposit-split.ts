export interface DepositSplitInput {
  cashBalance: number;
  cashCap: number | undefined;
  depositAmount: number;
  investmentBalance: number;
}

export interface DepositSplitResult {
  cashBalance: number;
  investmentBalance: number;
}

/**
 * Applies a deposit to a ledger's cash/investment balance split.
 *
 * When a cash cap is defined, deposits fill the cash portion up to the cap;
 * any remainder overflows into the investment portion. When no cap is set,
 * the entire deposit goes into cash.
 */
export function applyDepositSplit({
  cashBalance,
  cashCap,
  depositAmount,
  investmentBalance,
}: DepositSplitInput): DepositSplitResult {
  if (cashCap === undefined) {
    return { cashBalance: cashBalance + depositAmount, investmentBalance };
  }

  const cashSpace = Math.max(0, cashCap - cashBalance);
  const cashPortion = Math.min(depositAmount, cashSpace);
  const investmentPortion = depositAmount - cashPortion;

  return {
    cashBalance: cashBalance + cashPortion,
    investmentBalance: investmentBalance + investmentPortion,
  };
}
