import {
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

import { getClientApp } from "@/lib/firebase/client";
import {
  type FirebaseReconciliationExpense,
  firebaseToReconciliationExpense,
  type ReconciliationExpense,
  reconciliationExpenseToFirebase,
} from "@/lib/firebase/schema/reconciliation-expenses";

function db() {
  return getDatabase(getClientApp());
}

function reconciliationExpensesRef(uid: string) {
  return ref(db(), `users/${uid}/reconciliationExpenses`);
}

function reconciliationExpenseRef(uid: string, id: string) {
  return ref(db(), `users/${uid}/reconciliationExpenses/${id}`);
}

export async function getReconciliationExpenses(
  uid: string,
): Promise<ReconciliationExpense[]> {
  const snapshot = await get(reconciliationExpensesRef(uid));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, FirebaseReconciliationExpense>;
  return Object.entries(data).map(([id, entry]) =>
    firebaseToReconciliationExpense(id, entry),
  );
}

export async function createReconciliationExpense(
  uid: string,
  data: Omit<ReconciliationExpense, "id">,
): Promise<ReconciliationExpense> {
  const newRef = push(reconciliationExpensesRef(uid));
  if (!newRef.key) {
    throw new Error("Failed to generate reconciliation expense key");
  }
  await set(newRef, reconciliationExpenseToFirebase(data));
  return { id: newRef.key, ...data };
}

export async function updateReconciliationExpense(
  uid: string,
  id: string,
  data: Partial<Omit<ReconciliationExpense, "id">>,
): Promise<void> {
  const updates: Partial<FirebaseReconciliationExpense> = {};
  if (data.name !== undefined) {
    updates.name = data.name;
  }
  if (data.type !== undefined) {
    updates.type = data.type;
  }
  if (data.typicalAmount !== undefined) {
    updates.typicalAmount = data.typicalAmount;
  }
  await update(reconciliationExpenseRef(uid, id), updates);
}

export async function deleteReconciliationExpense(
  uid: string,
  id: string,
): Promise<void> {
  await remove(reconciliationExpenseRef(uid, id));
}
