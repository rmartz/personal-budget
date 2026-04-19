export interface FirebaseBudgetLedger {
  name: string;
  cashCap: number | null;
}

export interface BudgetLedger {
  id: string;
  name: string;
  cashCap: number | undefined;
}

export function budgetLedgerToFirebase(
  ledger: Omit<BudgetLedger, "id">,
): FirebaseBudgetLedger {
  return {
    name: ledger.name,
    cashCap: ledger.cashCap ?? null,
  };
}

export function firebaseToBudgetLedger(
  id: string,
  data: FirebaseBudgetLedger,
): BudgetLedger {
  return {
    id,
    name: data.name,
    cashCap: data.cashCap ?? undefined,
  };
}
