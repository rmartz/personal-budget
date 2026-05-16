import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

export const RECONCILE_SETUP_VIEW_COPY = {
  accountsEmptyState: "No accounts yet. Add your first account to get started.",
  accountsSectionHeading: "Accounts",
  cashAccountsGroupLabel: "Cash accounts",
  cashTierLabels: {
    [ReconciliationAccountTier.LongTerm]: "Long-term",
    [ReconciliationAccountTier.Reserve]: "Reserve",
    [ReconciliationAccountTier.ShortTerm]: "Short-term",
  } as Record<ReconciliationAccountTier, string>,
  deleteAccountAriaLabel: (name: string) => `Delete ${name}`,
  deleteButton: "Delete",
  deleteExpenseAriaLabel: (name: string) => `Delete ${name}`,
  editAccountAriaLabel: (name: string) => `Edit ${name}`,
  editButton: "Edit",
  editExpenseAriaLabel: (name: string) => `Edit ${name}`,
  expensesEmptyState:
    "No recurring expenses yet. Add your first expense to get started.",
  expensesSectionHeading: "Recurring expenses",
  expenseTypeRunningBalance: "Running balance",
  expenseTypeStatementBalance: "Statement",
  investmentAccountsGroupLabel: "Investment accounts",
} as const;
