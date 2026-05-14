// TODO: Implement real data model in epic #8 (Investment Ledger Management)
// and epic #11 (Investment Target Allocation).

export enum Posture {
  Aggressive = "aggressive",
  Balanced = "balanced",
  Conservative = "conservative",
}

export interface InvestmentAccount {
  id: string;
  name: string;
  currentPercent: number;
  targetPercent: number;
}

export interface AllocationTarget {
  accountId: string;
  accountName: string;
  action: "buy" | "hold" | "sell";
  amount: number;
}
