export const GOAL_PURCHASE_PAGE_COPY = {
  errorMessage: "Failed to load goal. Please try again later.",
} as const;

export const GOAL_PURCHASE_VIEW_COPY = {
  breadcrumbParent: "Goals",
  headerPrefix: "Mark purchased",
  headerSummary: (ledgerName: string, targetAmount: string) =>
    `${ledgerName} · ${targetAmount} target`,
} as const;

export const GOAL_PURCHASE_FORM_COPY = {
  amountError: "Please enter a valid amount greater than zero.",
  amountLabel: "Amount actually spent",
  amountPrefix: "$",
  cancelButton: "Cancel",
  dateError: "Please enter a valid date.",
  dateLabel: "Date",
  expenseNote: (ledgerName: string) =>
    `Will record an expense in ${ledgerName}`,
  noteLabel: "Note",
  notePlaceholder: "e.g. Studio Display refurb…",
  submitButton: "Mark purchased",
  submitError: "Something went wrong. Please try again.",
} as const;

export const GOAL_PURCHASE_WARNING_COPY = {
  description:
    "This ledger does not have enough cash to cover this purchase. The difference will be reallocated from the investment portion at the next reconciliation.",
  title: "Insufficient cash in ledger",
} as const;

export const GOAL_SIBLING_PROJECTIONS_COPY = {
  columnGoal: "Goal",
  columnNewEta: "New ETA",
  columnPriorEta: "Was",
  etaPlaceholder: "—",
  footer:
    "Recalculated using current Zipf weights and the ledger's monthly allocation.",
  title: "Sibling Goals · Projected Funding",
} as const;
