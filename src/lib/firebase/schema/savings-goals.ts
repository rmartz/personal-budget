export interface FirebaseSavingsGoal {
  name: string;
  targetAmount: number;
  fundedAmount: number;
  priority: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  fundedAmount: number;
  priority: number;
}

export function savingsGoalToFirebase(
  goal: Omit<SavingsGoal, "id">,
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
  data: FirebaseSavingsGoal,
): SavingsGoal {
  return {
    id,
    name: data.name,
    targetAmount: data.targetAmount,
    fundedAmount: data.fundedAmount,
    priority: data.priority,
  };
}
