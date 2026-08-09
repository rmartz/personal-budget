export const DELETE_EXPENSE_DIALOG_COPY = {
  cancelButton: "Cancel",
  confirmButton: "Delete",
  deleteError: "Failed to delete expense. Please try again.",
  deletingButton: "Deleting…",
  message: (name: string) =>
    `Are you sure you want to delete "${name}"? This action cannot be undone.`,
  title: "Delete Expense",
} as const;
