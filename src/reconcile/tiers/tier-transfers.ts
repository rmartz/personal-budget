import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

/** Target cash balance for each tier, as produced by calculateTierTargets. */
export interface TierTargets {
  longTerm: number;
  reserve: number;
  shortTerm: number;
}

export interface TierCurrentBalances {
  longTerm: number;
  reserve: number;
  shortTerm: number;
}

export interface TierTransfer {
  amount: number;
  from: ReconciliationAccountTier;
  to: ReconciliationAccountTier;
}

export interface TierTransferInputs {
  currentBalances: TierCurrentBalances;
  targets: TierTargets;
}

/**
 * Calculates recommended cash transfers between account tiers to reach target balances.
 *
 * Priority order: short-term is funded first (from long-term), then reserve (from long-term).
 * Short-term surpluses fill reserve deficits before going to long-term.
 */
export function calculateTierTransfers({
  currentBalances,
  targets,
}: TierTransferInputs): TierTransfer[] {
  const transfers: TierTransfer[] = [];

  const shortTermDelta = currentBalances.shortTerm - targets.shortTerm;
  const reserveDelta = currentBalances.reserve - targets.reserve;

  // Track how much the reserve deficit is already covered by short-term surplus.
  let reserveCoveredByShortTerm = 0;

  if (shortTermDelta < 0) {
    // Short-term needs funding — draw from long-term.
    transfers.push({
      amount: -shortTermDelta,
      from: ReconciliationAccountTier.LongTerm,
      to: ReconciliationAccountTier.ShortTerm,
    });
  } else if (shortTermDelta > 0) {
    if (reserveDelta < 0) {
      // Route short-term surplus to reserve first, remainder to long-term.
      const toReserve = Math.min(shortTermDelta, -reserveDelta);
      transfers.push({
        amount: toReserve,
        from: ReconciliationAccountTier.ShortTerm,
        to: ReconciliationAccountTier.Reserve,
      });
      reserveCoveredByShortTerm = toReserve;
      const remainder = shortTermDelta - toReserve;
      if (remainder > 0) {
        transfers.push({
          amount: remainder,
          from: ReconciliationAccountTier.ShortTerm,
          to: ReconciliationAccountTier.LongTerm,
        });
      }
    } else {
      transfers.push({
        amount: shortTermDelta,
        from: ReconciliationAccountTier.ShortTerm,
        to: ReconciliationAccountTier.LongTerm,
      });
    }
  }

  // Settle remaining reserve vs long-term after accounting for short-term's contribution.
  const remainingReserveDelta = reserveDelta + reserveCoveredByShortTerm;
  if (remainingReserveDelta < 0) {
    transfers.push({
      amount: -remainingReserveDelta,
      from: ReconciliationAccountTier.LongTerm,
      to: ReconciliationAccountTier.Reserve,
    });
  } else if (remainingReserveDelta > 0) {
    transfers.push({
      amount: remainingReserveDelta,
      from: ReconciliationAccountTier.Reserve,
      to: ReconciliationAccountTier.LongTerm,
    });
  }

  return transfers;
}
