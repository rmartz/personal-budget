import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";
export { ReconciliationAccountTier as AccountTier };

export interface Account {
  id: string;
  name: string;
  tier: ReconciliationAccountTier;
  targetFloat?: number;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
}
