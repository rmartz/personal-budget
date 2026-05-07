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
  goalsNone: "—",
  overflowMenuLabel: "More options",
} as const;

export const LEDGERS_PAGE_COPY = {
  columnCapUsage: "Cap usage",
  columnCash: "Cash",
  columnGoals: "Goals",
  columnInvestment: "Investment",
  columnLedger: "Ledger",
  columnTotal: "Total",
  emptyStateMessage: "You don't have any ledgers yet.",
  headerSummary: (count: number, cash: string, invested: string) =>
    `${String(count)} ${count === 1 ? "ledger" : "ledgers"} · ${cash} cash · ${invested} invested`,
  importButton: "Import",
  loadingMessage: "Loading ledgers…",
  mobileTotalLabel: "Total",
  newLedgerButton: "New Ledger",
  noCashCapLabel: "no cash cap",
  title: "Budget Ledgers",
} as const;

export const NEW_LEDGER_DIALOG_COPY = {
  cancelButton: "Cancel",
  cashCapError: "Cash cap must be a positive number.",
  cashCapLabel: "Cash Cap (optional)",
  cashCapPlaceholder: "0.00",
  nameError: "Name is required.",
  nameLabel: "Name",
  namePlaceholder: "e.g. Everyday Spending",
  submitButton: "Create Ledger",
  submitError: "Something went wrong. Please try again.",
  title: "New Ledger",
} as const;
