export const ACCOUNTS_PAGE_COPY = {
  accountsLabel: "Accounts",
  accountsSublabel: "Short-term · Reserve · Long-term · Investment",
  addAccountButton: "+ Add account",
  configuredCount: (n: number) => `${String(n)} configured`,
  recurringExpensesLabel: "Recurring expenses",
  recurringExpensesSublabel: (missingCount: number) =>
    `${String(missingCount)} missing this month`,
  setupSectionHeading: "SETUP",
  title: "Accounts",
} as const;

export const CREATE_ACCOUNT_DIALOG_COPY = {
  cancelButton: "Cancel",
  nameLabel: "Name",
  namePlaceholder: "e.g. Chase Checking",
  nameRequiredError: "Name is required.",
  submitButton: "Add Account",
  submitError: "Failed to add account. Please try again.",
  targetFloatInvalidError: "Target float must be a positive number.",
  targetFloatLabel: "Target Float",
  targetFloatPlaceholder: "e.g. 2000",
  targetFloatRequiredError: "Target float is required.",
  title: "New Account",
  typeLabel: "Account Type",
  typePlaceholder: "Select a type…",
  typeRequiredError: "Account type is required.",
  typeOptions: {
    investment: "Investment (e.g. brokerage, 401k)",
    "long-term": "Long-term (e.g. money market)",
    reserve: "Reserve (e.g. savings)",
    "short-term": "Short-term (e.g. checking)",
  },
} as const;
