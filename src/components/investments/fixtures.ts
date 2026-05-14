// Placeholder values from the wireframe — grep INVESTMENTS_PLACEHOLDER_FIXTURE
// to remove when real data is wired up in epics #10, #11.
export const INVESTMENTS_PLACEHOLDER_FIXTURE = {
  aggregateNet: "$2,840.00",
  buysTotal: "$3,200.00",
  emptyMargin: "—",
  emptyTotalInvested: "$0.00",
  investedTotal: "$48,200.00",
  ledgerRows: [
    {
      cashBalance: "$4,200.00",
      investedBalance: "$12,000.00",
      ledgerName: "Primary",
      netBuySell: "+$800.00",
    },
    {
      cashBalance: "$1,600.00",
      investedBalance: "$8,400.00",
      ledgerName: "Travel Fund",
      netBuySell: "+$360.00",
    },
  ],
  marginAvailable: "18%",
  recommendedAmount: "$3,200.00",
  recommendedSublabel: "$560.00",
  sellsTotal: "$360.00",
  targetMargin: "20%",
  totalLedgerCount: 14,
} as const;
