export const INVESTMENT_LEDGER_LIST_COPY = {
  title: "Investment Ledgers",
  emptyStateHeading: "No investment ledgers yet",
  emptyStateDescription:
    "Investment ledgers represent your actual brokerage or investment accounts, such as a stock portfolio or bond fund. Add one to start tracking your investments.",
  newLedgerButton: "New Investment Ledger",
  loadingLabel: "Loading investment ledgers…",
  currentBalanceLabel: "Balance",
  editAction: "Edit",
  deleteAction: "Delete",
} as const;

export const INVESTMENT_LEDGER_FORM_DIALOG_COPY = {
  createTitle: "New Investment Ledger",
  editTitle: "Edit Investment Ledger",
  nameLabel: "Name",
  namePlaceholder: "e.g. Stocks, Bonds, Real Estate",
  nameRequiredError: "Name is required",
  submitCreate: "Create",
  submitEdit: "Save",
  cancel: "Cancel",
} as const;

export const INVESTMENT_LEDGER_DELETE_DIALOG_COPY = {
  title: "Delete Investment Ledger",
  description: (name: string) =>
    `Are you sure you want to delete "${name}"? All lots and balance history associated with this ledger will be permanently deleted.`,
  confirm: "Delete",
  cancel: "Cancel",
} as const;
