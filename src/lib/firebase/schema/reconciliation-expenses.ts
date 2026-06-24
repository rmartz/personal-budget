import { z } from "zod";

export enum ReconciliationExpenseType {
  RunningBalance = "running-balance",
  StatementBalance = "statement-balance",
}

const FirebaseReconciliationExpenseSchema = z.object({
  name: z.string(),
  type: z.enum(ReconciliationExpenseType),
  typicalAmount: z.number(),
});

export type FirebaseReconciliationExpense = z.infer<
  typeof FirebaseReconciliationExpenseSchema
>;

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
  data: unknown,
): ReconciliationExpense {
  const parsed = FirebaseReconciliationExpenseSchema.parse(data);
  return {
    id,
    name: parsed.name,
    type: parsed.type,
    typicalAmount: parsed.typicalAmount,
  };
}
