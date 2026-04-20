export const INVESTMENT_LEDGER_LIST_COPY = {
  currentBalanceLabel: "Balance",
  deleteAction: "Delete",
  editAction: "Edit",
  emptyStateDescription:
    "Investment ledgers represent your actual brokerage or investment accounts, such as a stock portfolio or bond fund. Add one to start tracking your investments.",
  emptyStateHeading: "No investment ledgers yet",
  loadingLabel: "Loading investment ledgers…",
  newLedgerButton: "New Investment Ledger",
  title: "Investment Ledgers",
} as const;

export const INVESTMENT_LEDGER_FORM_DIALOG_COPY = {
  cancel: "Cancel",
  createTitle: "New Investment Ledger",
  editTitle: "Edit Investment Ledger",
  nameLabel: "Name",
  namePlaceholder: "e.g. Stocks, Bonds, Real Estate",
  nameRequiredError: "Name is required",
  submitCreate: "Create",
  submitEdit: "Save",
} as const;

export const INVESTMENT_LEDGER_DELETE_DIALOG_COPY = {
  cancel: "Cancel",
  confirm: "Delete",
  description: (name: string) =>
    `Are you sure you want to delete "${name}"? All lots and balance history associated with this ledger will be permanently deleted.`,
  title: "Delete Investment Ledger",
} as const;
