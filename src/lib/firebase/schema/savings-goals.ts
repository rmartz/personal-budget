export interface FirebaseSavingsGoal {
  name: string;
  targetAmount: number;
  fundedAmount: number;
  priority: number;
}

export interface SavingsGoal {
  id: string;
  ledgerId: string;
  name: string;
  targetAmount: number;
  fundedAmount: number;
  priority: number;
}

export function savingsGoalToFirebase(
  goal: Omit<SavingsGoal, "id" | "ledgerId">,
): FirebaseSavingsGoal {
  return {
    name: goal.name,
    targetAmount: goal.targetAmount,
    fundedAmount: goal.fundedAmount,
    priority: goal.priority,
  };
}

export function firebaseToSavingsGoal(
  id: string,
  ledgerId: string,
  data: FirebaseSavingsGoal,
): SavingsGoal {
  return {
    id,
    ledgerId,
    name: data.name,
    targetAmount: data.targetAmount,
    fundedAmount: data.fundedAmount,
    priority: data.priority,
  };
}
