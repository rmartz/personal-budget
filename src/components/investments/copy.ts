export const INVESTMENTS_VIEW_COPY = {
  applyRebalanceButton: "Apply rebalance",
  title: "Investments",
  titleSummary: (invested: string, numAccounts: number, margin: string) =>
    `${invested} invested across ${String(numAccounts)} accounts · ${margin} margin available`,
} as const;

export const POSTURE_CARD_COPY = {
  aggregateNet: "Aggregate net",
  availableMargin: "Available margin",
  postureAggressive: "Aggressive",
  postureBalanced: "Balanced",
  postureConservative: "Conservative",
  targetMargin: "Target margin",
  title: "Posture",
} as const;

export const RECOMMENDED_CARD_COPY = {
  sublabel: (alreadyInvested: string) =>
    `net of ${alreadyInvested} already invested`,
  title: "Recommended this month",
} as const;

export const AGGREGATE_BUY_SELL_COPY = {
  acrossAllLedgers: "Across all ledgers",
  buysLabel: (amount: string) => `Buys ${amount}`,
  sellsLabel: (amount: string) => `Sells ${amount}`,
  title: "Aggregate buy / sell",
} as const;

export const TARGET_ALLOCATION_COPY = {
  footerNote:
    "Vertical line = target. Bar = current. Deviation drives this month's rebalance.",
  noAccountsConfigured: "No investment accounts configured.",
  title: "Target allocation · must sum to 100%",
} as const;

export const MONTHLY_DISTRIBUTION_COPY = {
  columnAction: "Action",
  columnAmount: "Amount",
  columnAccount: "Account",
  noDistributionCalculated: "No distribution calculated yet.",
  title: (total: string) => `This month's distribution · ${total}`,
} as const;

export const LEDGER_INVESTMENT_TABLE_COPY = {
  columnCash: "Cash",
  columnInvested: "Invested",
  columnLedger: "Ledger",
  columnNetBuySell: "Net buy / sell",
  title: "Per-ledger investment portion",
  viewAllLink: (count: number) => `View all ${String(count)}`,
} as const;
