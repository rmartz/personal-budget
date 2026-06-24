import { z } from "zod";

export enum BudgetLedgerTransactionType {
  Deposit = "deposit",
  Expense = "expense",
}

const FirebaseBudgetLedgerTransactionSchema = z.object({
  type: z.enum(BudgetLedgerTransactionType),
  date: z.string(),
  amount: z.number(),
  description: z.string(),
});

export type FirebaseBudgetLedgerTransaction = z.infer<
  typeof FirebaseBudgetLedgerTransactionSchema
>;

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
  data: unknown,
): BudgetLedgerTransaction {
  const parsed = FirebaseBudgetLedgerTransactionSchema.parse(data);
  return {
    id,
    ledgerId,
    type: parsed.type,
    date: new Date(parsed.date),
    amount: parsed.amount,
    description: parsed.description,
  };
}
