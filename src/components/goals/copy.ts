export const GOALS_LIST_COPY = {
  emptyStateMessage:
    "No savings goals yet. Add a goal inside any ledger to get started.",
  etaFunded: "Funded",
  etaPlaceholder: "—",
  newGoalButton: "+ New goal",
  readyToPurchase: "Ready to purchase",
  sortByEta: "By ETA",
  sortByLedger: "By ledger",
  sortByPriority: "By priority",
  title: "Goals",
} as const;

export const GOAL_CARD_COPY = {
  eyebrowSeparator: "·",
  fundedLabel: (percent: number) => `${String(percent)}% funded`,
  ofTarget: (target: string) => `of ${target}`,
  toGoLabel: (amount: string) => `${amount} to go`,
} as const;
