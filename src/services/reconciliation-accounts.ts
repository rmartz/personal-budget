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
  reconciliationAccountToFirebase,
  firebaseToReconciliationAccount,
  type FirebaseReconciliationAccount,
  type ReconciliationAccount,
} from "@/lib/firebase/schema/reconciliation-accounts";

function db() {
  return getDatabase(getClientApp());
}

function reconciliationAccountsRef(uid: string) {
  return ref(db(), `users/${uid}/reconciliationAccounts`);
}

function reconciliationAccountRef(uid: string, id: string) {
  return ref(db(), `users/${uid}/reconciliationAccounts/${id}`);
}

export async function getReconciliationAccounts(
  uid: string,
): Promise<ReconciliationAccount[]> {
  const snapshot = await get(reconciliationAccountsRef(uid));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, FirebaseReconciliationAccount>;
  return Object.entries(data).map(([id, entry]) =>
    firebaseToReconciliationAccount(id, entry),
  );
}

export async function createReconciliationAccount(
  uid: string,
  data: Omit<ReconciliationAccount, "id">,
): Promise<ReconciliationAccount> {
  const newRef = push(reconciliationAccountsRef(uid));
  if (!newRef.key) {
    throw new Error("Failed to generate reconciliation account key");
  }
  await set(newRef, reconciliationAccountToFirebase(data));
  return { id: newRef.key, ...data };
}

export async function updateReconciliationAccount(
  uid: string,
  id: string,
  data: Partial<Omit<ReconciliationAccount, "id">>,
): Promise<void> {
  const updates: Partial<FirebaseReconciliationAccount> = {};
  if (data.name !== undefined) {
    updates.name = data.name;
  }
  if (data.tier !== undefined) {
    updates.tier = data.tier;
  }
  if (data.targetFloat !== undefined) {
    updates.targetFloat = data.targetFloat;
  }
  await update(reconciliationAccountRef(uid, id), updates);
}

export async function deleteReconciliationAccount(
  uid: string,
  id: string,
): Promise<void> {
  await remove(reconciliationAccountRef(uid, id));
}
