import { z } from "zod";

const FirebaseBudgetLedgerSavingsGoalSchema = z.object({
  name: z.string(),
  targetAmount: z.number(),
  fundedAmount: z.number().default(0),
  priority: z.number(),
});

export type FirebaseBudgetLedgerSavingsGoal = z.infer<
  typeof FirebaseBudgetLedgerSavingsGoalSchema
>;

export interface BudgetLedgerSavingsGoal {
  id: string;
  ledgerId: string;
  name: string;
  targetAmount: number;
  fundedAmount: number;
  priority: number;
}

export function budgetLedgerSavingsGoalToFirebase(
  goal: Omit<BudgetLedgerSavingsGoal, "id" | "ledgerId">,
): FirebaseBudgetLedgerSavingsGoal {
  return {
    name: goal.name,
    targetAmount: goal.targetAmount,
    fundedAmount: goal.fundedAmount,
    priority: goal.priority,
  };
}

export function firebaseToBudgetLedgerSavingsGoal(
  id: string,
  ledgerId: string,
  data: unknown,
): BudgetLedgerSavingsGoal {
  const parsed = FirebaseBudgetLedgerSavingsGoalSchema.parse(data);
  return {
    id,
    ledgerId,
    name: parsed.name,
    targetAmount: parsed.targetAmount,
    fundedAmount: parsed.fundedAmount,
    priority: parsed.priority,
  };
}
