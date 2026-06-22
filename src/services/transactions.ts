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
  type BudgetLedgerTransaction,
  budgetLedgerTransactionToFirebase,
  firebaseToBudgetLedgerTransaction,
} from "@/lib/firebase/schema/budget-ledger-transactions";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

function db() {
  return getDatabase(getClientApp());
}

function transactionsRef(uid: string, ledgerId: string) {
  return ref(db(), `users/${uid}/budgetLedgerTransactions/${ledgerId}`);
}

function transactionRef(uid: string, ledgerId: string, id: string) {
  return ref(db(), `users/${uid}/budgetLedgerTransactions/${ledgerId}/${id}`);
}

export async function getTransactions(
  uid: string,
  ledgerId: string,
): Promise<BudgetLedgerTransaction[]> {
  const snapshot = await get(transactionsRef(uid, ledgerId));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, unknown>;
  return parseCollection(data, (id, entry) =>
    firebaseToBudgetLedgerTransaction(id, ledgerId, entry),
  );
}

export async function createTransaction(
  uid: string,
  ledgerId: string,
  data: Omit<BudgetLedgerTransaction, "id" | "ledgerId">,
): Promise<BudgetLedgerTransaction> {
  const newRef = push(transactionsRef(uid, ledgerId));
  if (!newRef.key) {
    throw new Error("Failed to generate transaction key");
  }
  await set(newRef, budgetLedgerTransactionToFirebase(data));
  return { id: newRef.key, ledgerId, ...data };
}

export async function updateTransaction(
  uid: string,
  ledgerId: string,
  id: string,
  data: Pick<BudgetLedgerTransaction, "date" | "amount" | "description">,
): Promise<void> {
  await update(transactionRef(uid, ledgerId, id), {
    date: data.date.toISOString(),
    amount: data.amount,
    description: data.description,
  });
}

export async function deleteTransaction(
  uid: string,
  ledgerId: string,
  id: string,
): Promise<void> {
  await remove(transactionRef(uid, ledgerId, id));
}
