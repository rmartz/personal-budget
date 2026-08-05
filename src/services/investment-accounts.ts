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
  type FirebaseInvestmentAccount,
  firebaseToInvestmentAccount,
  type InvestmentAccount,
  investmentAccountToFirebase,
} from "@/lib/firebase/schema/investments";

function db() {
  return getDatabase(getClientApp());
}

function investmentAccountsRef(uid: string) {
  return ref(db(), `users/${uid}/investmentAccounts`);
}

function investmentAccountRef(uid: string, id: string) {
  return ref(db(), `users/${uid}/investmentAccounts/${id}`);
}

export async function getInvestmentAccounts(
  uid: string,
): Promise<InvestmentAccount[]> {
  const snapshot = await get(investmentAccountsRef(uid));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, FirebaseInvestmentAccount>;
  return Object.entries(data).map(([id, entry]) =>
    firebaseToInvestmentAccount(id, entry),
  );
}

export async function createInvestmentAccount(
  uid: string,
  data: Omit<InvestmentAccount, "id">,
): Promise<InvestmentAccount> {
  const newRef = push(investmentAccountsRef(uid));
  if (!newRef.key) {
    throw new Error("Failed to generate investment account key");
  }
  await set(newRef, investmentAccountToFirebase(data));
  return { id: newRef.key, ...data };
}

export async function updateInvestmentAccount(
  uid: string,
  id: string,
  data: Partial<Omit<InvestmentAccount, "id">>,
): Promise<void> {
  const updates: Partial<FirebaseInvestmentAccount> = {};
  if (data.name !== undefined) {
    updates.name = data.name;
  }
  if (data.currentPercent !== undefined) {
    updates.currentPercent = data.currentPercent;
  }
  if (data.targetPercent !== undefined) {
    updates.targetPercent = data.targetPercent;
  }
  await update(investmentAccountRef(uid, id), updates);
}

export async function deleteInvestmentAccount(
  uid: string,
  id: string,
): Promise<void> {
  await remove(investmentAccountRef(uid, id));
}
