export const CREATE_LEDGER_DIALOG_COPY = {
  cancelButton: "Cancel",
  cashCapInvalidError: "Cash cap must be a positive number.",
  cashCapLabel: "Cash Cap (optional)",
  cashCapPlaceholder: "e.g. 1000",
  createButton: "Creating…",
  nameLabel: "Name",
  namePlaceholder: "e.g. Everyday Spending",
  nameRequiredError: "Name is required.",
  submitButton: "Create Ledger",
  submitError: "Failed to create ledger. Please try again.",
  title: "New Ledger",
} as const;

export const LEDGERS_PAGE_COPY = {
  emptyStateMessage: "You don't have any ledgers yet.",
  loadingMessage: "Loading ledgers…",
  newLedgerButton: "New Ledger",
  title: "Budget Ledgers",
} as const;

export const EDIT_LEDGER_DIALOG_COPY = {
  cancelButton: "Cancel",
  cashCapInvalid: "Cash cap must be a positive number.",
  cashCapLabel: "Cash Cap (optional)",
  cashCapPlaceholder: "e.g. 1000",
  dialogTitle: "Edit Ledger",
  editButton: "Edit",
  nameLabel: "Name",
  namePlaceholder: "e.g. Everyday Spending",
  nameRequired: "Name is required.",
  saveButton: "Save",
  submitError: "Failed to save. Please try again.",
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
