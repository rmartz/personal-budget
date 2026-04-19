export enum LedgerTransactionType {
  Deposit = "deposit",
  Expense = "expense",
}

export interface FirebaseLedgerTransaction {
  type: LedgerTransactionType;
  date: string;
  amount: number;
  description: string;
}

export interface LedgerTransaction {
  id: string;
  type: LedgerTransactionType;
  date: Date;
  amount: number;
  description: string;
}

export function ledgerTransactionToFirebase(
  transaction: Omit<LedgerTransaction, "id">,
): FirebaseLedgerTransaction {
  return {
    type: transaction.type,
    date: transaction.date.toISOString(),
    amount: transaction.amount,
    description: transaction.description,
  };
}

export function firebaseToLedgerTransaction(
  id: string,
  data: FirebaseLedgerTransaction,
): LedgerTransaction {
  return {
    id,
    type: data.type,
    date: new Date(data.date),
    amount: data.amount,
    description: data.description,
  };
}
