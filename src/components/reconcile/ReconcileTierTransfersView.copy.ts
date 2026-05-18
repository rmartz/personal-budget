import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

export const RECONCILE_TIER_TRANSFERS_VIEW_COPY = {
  emptyState: "No transfers needed — all tiers are at their targets.",
  tierLabel: {
    [ReconciliationAccountTier.Investment]: "Investment",
    [ReconciliationAccountTier.LongTerm]: "Long-term",
    [ReconciliationAccountTier.Reserve]: "Reserve",
    [ReconciliationAccountTier.ShortTerm]: "Short-term",
  } as Record<ReconciliationAccountTier, string>,
  transferArrow: "→",
} as const;
