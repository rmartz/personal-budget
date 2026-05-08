import {
  getDatabase,
  ref,
  get,
  set,
  update,
  push,
  remove,
} from "firebase/database";
import { getClientApp } from "@/lib/firebase/client";
import {
  budgetLedgerSavingsGoalToFirebase,
  firebaseToBudgetLedgerSavingsGoal,
  type FirebaseBudgetLedgerSavingsGoal,
  type BudgetLedgerSavingsGoal,
} from "@/lib/firebase/schema/savings-goals";

function db() {
  return getDatabase(getClientApp());
}

function savingsGoalsRef(uid: string, ledgerId: string) {
  return ref(db(), `users/${uid}/budgetLedgerSavingsGoals/${ledgerId}`);
}

function savingsGoalRef(uid: string, ledgerId: string, id: string) {
  return ref(db(), `users/${uid}/budgetLedgerSavingsGoals/${ledgerId}/${id}`);
}

export async function getSavingsGoals(
  uid: string,
  ledgerId: string,
): Promise<BudgetLedgerSavingsGoal[]> {
  const snapshot = await get(savingsGoalsRef(uid, ledgerId));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<
    string,
    FirebaseBudgetLedgerSavingsGoal
  >;
  return Object.entries(data).map(([id, entry]) =>
    firebaseToBudgetLedgerSavingsGoal(id, ledgerId, entry),
  );
}

export async function createSavingsGoal(
  uid: string,
  ledgerId: string,
  data: Omit<BudgetLedgerSavingsGoal, "id" | "ledgerId">,
): Promise<BudgetLedgerSavingsGoal> {
  const newRef = push(savingsGoalsRef(uid, ledgerId));
  if (!newRef.key) {
    throw new Error("Failed to generate savings goal key");
  }
  await set(newRef, budgetLedgerSavingsGoalToFirebase(data));
  return { id: newRef.key, ledgerId, ...data };
}

export async function updateSavingsGoal(
  uid: string,
  ledgerId: string,
  id: string,
  data: Partial<Omit<BudgetLedgerSavingsGoal, "id" | "ledgerId">>,
): Promise<void> {
  const updates: Partial<FirebaseBudgetLedgerSavingsGoal> = {};
  if (data.name !== undefined) {
    updates.name = data.name;
  }
  if (data.targetAmount !== undefined) {
    updates.targetAmount = data.targetAmount;
  }
  if (data.fundedAmount !== undefined) {
    updates.fundedAmount = data.fundedAmount;
  }
  if (data.priority !== undefined) {
    updates.priority = data.priority;
  }
  await update(savingsGoalRef(uid, ledgerId, id), updates);
}

export async function deleteSavingsGoal(
  uid: string,
  ledgerId: string,
  id: string,
): Promise<void> {
  await remove(savingsGoalRef(uid, ledgerId, id));
}

export async function deleteSavingsGoalAndReorder(
  uid: string,
  ledgerId: string,
  id: string,
): Promise<void> {
  const snapshot = await get(savingsGoalsRef(uid, ledgerId));
  await remove(savingsGoalRef(uid, ledgerId, id));

  if (!snapshot.exists()) {
    return;
  }

  const data = snapshot.val() as Record<
    string,
    FirebaseBudgetLedgerSavingsGoal
  >;
  const remaining = Object.entries(data)
    .filter(([goalId]) => goalId !== id)
    .map(([goalId, entry]) =>
      firebaseToBudgetLedgerSavingsGoal(goalId, ledgerId, entry),
    )
    .sort((a, b) => a.priority - b.priority);

  await Promise.all(
    remaining.map((goal, index) =>
      update(savingsGoalRef(uid, ledgerId, goal.id), { priority: index + 1 }),
    ),
  );
}
