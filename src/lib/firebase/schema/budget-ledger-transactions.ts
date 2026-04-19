export enum BudgetLedgerTransactionType {
  Deposit = "deposit",
  Expense = "expense",
}

export interface FirebaseBudgetLedgerTransaction {
  type: BudgetLedgerTransactionType;
  date: string;
  amount: number;
  description: string;
}

export interface BudgetLedgerTransaction {
  id: string;
  ledgerId: string;
  type: BudgetLedgerTransactionType;
  date: Date;
  amount: number;
  description: string;
}

export function budgetLedgerTransactionToFirebase(
  transaction: Omit<BudgetLedgerTransaction, "id" | "ledgerId">,
): FirebaseBudgetLedgerTransaction {
  return {
    type: transaction.type,
    date: transaction.date.toISOString(),
    amount: transaction.amount,
    description: transaction.description,
  };
}

export function firebaseToBudgetLedgerTransaction(
  id: string,
  ledgerId: string,
  data: FirebaseBudgetLedgerTransaction,
): BudgetLedgerTransaction {
  return {
    id,
    ledgerId,
    type: data.type,
    date: new Date(data.date),
    amount: data.amount,
    description: data.description,
  };
}
