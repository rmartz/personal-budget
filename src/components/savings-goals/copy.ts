export const EDIT_SAVINGS_GOAL_DIALOG_COPY = {
  cancelButton: "Cancel",
  dialogTitle: "Edit Goal",
  editButton: "Edit",
  nameLabel: "Name",
  namePlaceholder: "e.g. Emergency Fund",
  nameRequired: "Name is required.",
  saveButton: "Save",
  submitError: "Failed to save. Please try again.",
  targetAmountInvalid: "Target amount must be a positive number.",
  targetAmountLabel: "Target Amount",
  targetAmountPlaceholder: "e.g. 5000",
} as const;

export const SAVINGS_GOAL_LIST_COPY = {
  columnActions: "Actions",
  columnFunded: "Funded",
  columnName: "Goal",
  columnPriority: "#",
  columnProgress: "Progress",
  columnTarget: "Target",
  emptyStateMessage:
    "No savings goals yet. Create your first goal to get started.",
  moveDownButton: "Move down",
  moveUpButton: "Move up",
  title: "Savings Goals",
} as const;

export const SAVINGS_GOAL_LIST_ITEM_COPY = {
  deleteCancelButton: "Cancel",
  deleteConfirmButton: "Delete",
  deleteConfirmDescription:
    "This will permanently delete this savings goal. Any funded progress will be lost and cannot be recovered.",
  deleteConfirmTitle: "Delete savings goal?",
  deleteMenuLabel: "Delete",
  fundedLabel: "Funded",
  overflowMenuLabel: "More options",
} as const;
