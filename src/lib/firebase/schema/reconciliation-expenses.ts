export enum ReconciliationExpenseType {
  RunningBalance = "running-balance",
  StatementBalance = "statement-balance",
}

export interface FirebaseReconciliationExpense {
  name: string;
  type: ReconciliationExpenseType;
  typicalAmount: number;
}

export interface ReconciliationExpense {
  id: string;
  name: string;
  type: ReconciliationExpenseType;
  typicalAmount: number;
}

export function reconciliationExpenseToFirebase(
  expense: Omit<ReconciliationExpense, "id">,
): FirebaseReconciliationExpense {
  return {
    name: expense.name,
    type: expense.type,
    typicalAmount: expense.typicalAmount,
  };
}

export function firebaseToReconciliationExpense(
  id: string,
  data: FirebaseReconciliationExpense,
): ReconciliationExpense {
  return {
    id,
    name: data.name,
    type: data.type,
    typicalAmount: data.typicalAmount,
  };
}
