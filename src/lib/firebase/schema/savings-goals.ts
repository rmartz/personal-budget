export interface FirebaseBudgetLedgerSavingsGoal {
  name: string;
  targetAmount: number;
  fundedAmount: number;
  priority: number;
}

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
  data: FirebaseBudgetLedgerSavingsGoal,
): BudgetLedgerSavingsGoal {
  return {
    id,
    ledgerId,
    name: data.name,
    targetAmount: data.targetAmount,
    fundedAmount: data.fundedAmount,
    priority: data.priority,
  };
}
