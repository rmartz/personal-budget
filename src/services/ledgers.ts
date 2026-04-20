import {
  getDatabase,
  ref,
  get,
  set,
  update,
  remove,
  push,
} from "firebase/database";
import { getClientApp } from "@/lib/firebase/client";
import {
  firebaseToBudgetLedger,
  budgetLedgerToFirebase,
  type FirebaseBudgetLedger,
} from "@/lib/firebase/schema/budget-ledgers";
import type { CreateLedgerInput, Ledger, UpdateLedgerInput } from "@/lib/types";

function db() {
  return getDatabase(getClientApp());
}

function ledgersRef(uid: string) {
  return ref(db(), `users/${uid}/budgetLedgers`);
}

function ledgerRef(uid: string, id: string) {
  return ref(db(), `users/${uid}/budgetLedgers/${id}`);
}

export async function getLedgers(uid: string): Promise<Ledger[]> {
  const snapshot = await get(ledgersRef(uid));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, FirebaseBudgetLedger>;
  return Object.entries(data).map(([id, entry]) => ({
    ...firebaseToBudgetLedger(id, entry),
    cashBalance: 0,
    investmentBalance: 0,
  }));
}

export async function createLedger(
  uid: string,
  data: CreateLedgerInput,
): Promise<Ledger> {
  const newRef = push(ledgersRef(uid));
  if (!newRef.key) {
    throw new Error("Failed to generate ledger key");
  }
  await set(
    newRef,
    budgetLedgerToFirebase({ name: data.name, cashCap: data.cashCap }),
  );
  return {
    id: newRef.key,
    name: data.name,
    cashCap: data.cashCap,
    cashBalance: 0,
    investmentBalance: 0,
  };
}

export async function updateLedger(
  uid: string,
  id: string,
  data: UpdateLedgerInput,
): Promise<void> {
  const updates: Partial<FirebaseBudgetLedger> = {};
  if (data.name !== undefined) {
    updates.name = data.name;
  }
  if (data.cashCap !== undefined) {
    updates.cashCap = data.cashCap;
  }
  await update(ledgerRef(uid, id), updates);
}

export async function deleteLedger(uid: string, id: string): Promise<void> {
  await remove(ledgerRef(uid, id));
}
