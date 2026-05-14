// TODO: Implement real data model in epic #8 (Investment Ledger Management)
// and epic #11 (Investment Target Allocation).

export enum Posture {
  Aggressive = "aggressive",
  Balanced = "balanced",
  Conservative = "conservative",
}

export interface FirebaseInvestmentAccount {
  // TODO: Define real Firebase shape when wiring lands (#8, #11)
  id: string;
  name: string;
  currentPercent: number;
  targetPercent: number;
}

export interface InvestmentAccount {
  id: string;
  name: string;
  currentPercent: number;
  targetPercent: number;
}

export interface FirebaseAllocationTarget {
  // TODO: Define real Firebase shape when wiring lands (#8, #11)
  accountId: string;
  accountName: string;
  action: "buy" | "hold" | "sell";
  amount: number;
}

export interface AllocationTarget {
  accountId: string;
  accountName: string;
  action: "buy" | "hold" | "sell";
  amount: number;
}

// TODO: Update mapper implementations when real Firebase wiring lands (#8, #11)
export function firebaseToInvestmentAccount(
  data: FirebaseInvestmentAccount,
): InvestmentAccount {
  return {
    id: data.id,
    name: data.name,
    currentPercent: data.currentPercent,
    targetPercent: data.targetPercent,
  };
}

// TODO: Update mapper implementations when real Firebase wiring lands (#8, #11)
export function firebaseToAllocationTarget(
  data: FirebaseAllocationTarget,
): AllocationTarget {
  return {
    accountId: data.accountId,
    accountName: data.accountName,
    action: data.action,
    amount: data.amount,
  };
}
