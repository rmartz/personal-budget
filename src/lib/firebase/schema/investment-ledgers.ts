export interface FirebaseInvestmentLedger {
  name: string;
  targetAllocationPct: number;
}

export interface InvestmentLedger {
  id: string;
  name: string;
  targetAllocationPct: number;
}

export function investmentLedgerToFirebase(
  ledger: Omit<InvestmentLedger, "id">,
): FirebaseInvestmentLedger {
  return {
    name: ledger.name,
    targetAllocationPct: ledger.targetAllocationPct,
  };
}

export function firebaseToInvestmentLedger(
  id: string,
  data: FirebaseInvestmentLedger,
): InvestmentLedger {
  return {
    id,
    name: data.name,
    targetAllocationPct: data.targetAllocationPct,
  };
}
