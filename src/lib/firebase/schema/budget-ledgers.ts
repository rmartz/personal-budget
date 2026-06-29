import { z } from "zod";

const FirebaseBudgetLedgerSchema = z.object({
  name: z.string(),
  cashCap: z.number().nullable(),
});

export type FirebaseBudgetLedger = z.infer<typeof FirebaseBudgetLedgerSchema>;

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
  data: unknown,
): BudgetLedger {
  const parsed = FirebaseBudgetLedgerSchema.parse(data);
  return {
    id,
    name: parsed.name,
    cashCap: parsed.cashCap ?? undefined,
  };
}
