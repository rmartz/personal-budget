import type { Account, RecurringExpense } from "@/lib/firebase/schema/accounts";

// TODO: Replace with real Firebase subscription in epic #17 (Account & Expense Setup)
export function useAccounts(_uid: string): {
  accounts: Account[];
  recurringExpenses: RecurringExpense[];
  isLoading: boolean;
} {
  return { accounts: [], recurringExpenses: [], isLoading: false };
}
