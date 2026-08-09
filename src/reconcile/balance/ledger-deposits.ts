export interface LedgerDepositInput {
  cashBalance: number;
  cashCap: number | undefined;
  id: string;
}

export interface LedgerDepositsInputs {
  ledgers: LedgerDepositInput[];
  unallocatedCash: number;
}

export interface LedgerDeposit {
  amount: number;
  ledgerId: string;
}

/**
 * Returns the recommended deposit amount for each budget ledger, distributing
 * the available unallocated cash in ledger order until the cash is exhausted.
 *
 * Only ledgers with a defined `cashCap` are eligible — ledgers without a cap
 * have no defined target and are skipped. Ledgers already at (or above) their
 * cap are also skipped. The total of all returned deposits never exceeds
 * `unallocatedCash`.
 */
export function calculateLedgerDeposits({
  ledgers,
  unallocatedCash,
}: LedgerDepositsInputs): LedgerDeposit[] {
  const deposits: LedgerDeposit[] = [];
  let remaining = unallocatedCash;

  for (const ledger of ledgers) {
    if (remaining <= 0) break;
    if (ledger.cashCap === undefined) continue;

    const needed = Math.max(0, ledger.cashCap - ledger.cashBalance);
    if (needed === 0) continue;

    const amount = Math.min(needed, remaining);
    deposits.push({ amount, ledgerId: ledger.id });
    remaining -= amount;
  }

  return deposits;
}
