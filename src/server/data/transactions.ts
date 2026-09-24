import { getAdminDatabase } from "@/lib/firebase/admin";
import {
  type BudgetLedgerTransaction,
  firebaseToBudgetLedgerTransaction,
} from "@/lib/firebase/schema/budget-ledger-transactions";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";

/**
 * Server-side transaction reads over the Firebase Admin SDK — the shared layer
 * MCP tools (and, later, HTTP endpoints) call. Scoped to a `uid` derived once
 * from a verified identity, so a caller only ever reaches its own subtree.
 */

function ledgerTxRef(uid: string, ledgerId: string) {
  return getAdminDatabase().ref(
    `users/${uid}/budgetLedgerTransactions/${ledgerId}`,
  );
}

export async function listTransactions(
  uid: string,
  ledgerId: string,
): Promise<BudgetLedgerTransaction[]> {
  const snapshot = await ledgerTxRef(uid, ledgerId).get();
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, unknown>;
  return parseCollection(data, (id, entry) =>
    firebaseToBudgetLedgerTransaction(id, ledgerId, entry),
  );
}

export async function getTransaction(
  uid: string,
  ledgerId: string,
  id: string,
): Promise<BudgetLedgerTransaction | undefined> {
  const snapshot = await ledgerTxRef(uid, ledgerId).child(id).get();
  if (!snapshot.exists()) {
    return undefined;
  }
  return firebaseToBudgetLedgerTransaction(id, ledgerId, snapshot.val());
}
