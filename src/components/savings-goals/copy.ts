export const SAVINGS_GOAL_LIST_COPY = {
  columnFunded: "Funded",
  columnName: "Goal",
  columnPriority: "#",
  columnProgress: "Progress",
  columnTarget: "Target",
  emptyStateMessage:
    "No savings goals yet. Create your first goal to get started.",
  title: "Savings Goals",
} as const;

export const SAVINGS_GOAL_LIST_ITEM_COPY = {
  deleteCancelButton: "Cancel",
  deleteConfirmButton: "Delete",
  deleteConfirmDescription:
    "This will permanently delete this savings goal. Any funded progress will be lost and cannot be recovered.",
  deleteConfirmTitle: "Delete savings goal?",
  deleteMenuLabel: "Delete",
  overflowMenuLabel: "More options",
} as const;
