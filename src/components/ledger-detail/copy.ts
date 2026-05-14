export const LEDGER_DETAIL_COPY = {
  addDepositButton: "+ Deposit",
  addExpenseButton: "+ Expense",
  addGoalButton: "+ Goal",
  breadcrumbParent: "Ledgers",
  goalsSectionTitle: "Goals in this ledger",
  headerNoCashCap: "No cash cap",
  headerSummary: (cap: string, count: number) =>
    `${cap} · ${String(count)} active ${count === 1 ? "goal" : "goals"}`,
  monthDepositsLabel: "Deposits",
  monthExpensesLabel: "Expenses",
  monthNetLabel: "Net",
  monthSectionTitle: "This month",
  splitCashLabel: "Cash",
  splitInvestmentLabel: "Invested",
  splitSectionTitle: "Cash / Investment",
  totalSectionTitle: "Total balance",
  totalSubLabel: (cash: string, invested: string) =>
    `${cash} cash + ${invested} invested`,
} as const;
