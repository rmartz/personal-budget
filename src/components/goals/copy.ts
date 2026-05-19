export const GOALS_LIST_COPY = {
  emptyStateMessage:
    "No savings goals yet. Add a goal inside any ledger to get started.",
  errorMessage: "Failed to load goals. Please try again later.",
  etaFunded: "Funded",
  etaPlaceholder: "—",
  fullyFundedCount: (count: number) => `${String(count)} fully funded`,
  goalCount: (count: number) =>
    count === 1 ? "1 goal" : `${String(count)} goals`,
  newGoalButton: "+ New goal",
  readyToPurchase: "Ready to purchase",
  sortByEta: "By ETA",
  sortByLedger: "By ledger",
  sortByPriority: "By priority",
  title: "Goals",
  zipfProgress: "—% weighted progress",
} as const;

export const GOAL_CARD_COPY = {
  eyebrowSeparator: "·",
  fullyFunded: "Fully funded",
  fundedLabel: (percent: number) => `${String(percent)}% funded`,
  ofTarget: (target: string) => `of ${target}`,
  priorityLabel: (n: number) => `P${String(n)}`,
  toGoLabel: (amount: string) => `${amount} to go`,
} as const;
