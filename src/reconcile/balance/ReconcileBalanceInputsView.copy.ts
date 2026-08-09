export const RECONCILE_BALANCE_INPUTS_COPY = {
  accountBalanceAriaLabel: (name: string) => `Current balance for ${name}`,
  accountsSectionHeading: "Account balances",
  emptyState: "No accounts or expenses configured.",
  expenseAmountAriaLabel: (name: string) => `Current amount for ${name}`,
  expensesSectionHeading: "Expense amounts",
} as const;
