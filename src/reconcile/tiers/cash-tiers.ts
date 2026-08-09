import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

export const CASH_TIERS = new Set<ReconciliationAccountTier>([
  ReconciliationAccountTier.LongTerm,
  ReconciliationAccountTier.Reserve,
  ReconciliationAccountTier.ShortTerm,
]);
