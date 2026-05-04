export const LEDGERS_PAGE_COPY = {
  emptyStateMessage: "You don't have any ledgers yet.",
  loadingMessage: "Loading ledgers…",
  newLedgerButton: "New Ledger",
  title: "Budget Ledgers",
} as const;

export const NEW_LEDGER_DIALOG_COPY = {
  cancelButton: "Cancel",
  cashCapLabel: "Cash Cap (optional)",
  cashCapPlaceholder: "0.00",
  cashCapError: "Cash cap must be a positive number.",
  nameLabel: "Name",
  namePlaceholder: "e.g. Everyday Spending",
  nameError: "Name is required.",
  submitButton: "Create Ledger",
  title: "New Ledger",
} as const;

export const LEDGER_LIST_ITEM_COPY = {
  deleteCancelButton: "Cancel",
  deleteConfirmButton: "Delete",
  deleteConfirmDescription:
    "This will permanently delete this ledger and all its associated transactions and goals. This action cannot be undone.",
  deleteConfirmTitle: "Delete ledger?",
  deleteMenuLabel: "Delete",
  overflowMenuLabel: "More options",
} as const;
