import { getDatabase, ref, get, set, push, remove } from "firebase/database";
import { getClientApp } from "@/lib/firebase/client";
import {
  budgetLedgerTransactionToFirebase,
  firebaseToBudgetLedgerTransaction,
  type FirebaseBudgetLedgerTransaction,
  type BudgetLedgerTransaction,
} from "@/lib/firebase/schema/budget-ledger-transactions";

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
  const data = snapshot.val() as Record<
    string,
    FirebaseBudgetLedgerTransaction
  >;
  return Object.entries(data).map(([id, entry]) =>
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

export async function deleteTransaction(
  uid: string,
  ledgerId: string,
  id: string,
): Promise<void> {
  await remove(transactionRef(uid, ledgerId, id));
}
