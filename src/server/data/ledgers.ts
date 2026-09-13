import { getAdminDatabase } from "@/lib/firebase/admin";
import {
  type BudgetLedger,
  budgetLedgerToFirebase,
  type FirebaseBudgetLedger,
  firebaseToBudgetLedger,
} from "@/lib/firebase/schema/budget-ledgers";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";
import type { CreateLedgerInput, UpdateLedgerInput } from "@/lib/types";

/**
 * Server-side ledger data access over the Firebase Admin SDK — the single layer
 * shared by the HTTP endpoints (UI) and the MCP tools (agents). Every function
 * is scoped to a `uid` derived once from a verified identity, so a caller can
 * only ever reach its own `users/${uid}/...` subtree. Future incremental
 * read-time schema migrations belong here, behind the `firebaseTo*` converters.
 */

function userRef(uid: string) {
  return getAdminDatabase().ref(`users/${uid}`);
}

export async function listLedgers(uid: string): Promise<BudgetLedger[]> {
  const snapshot = await userRef(uid).child("budgetLedgers").get();
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, unknown>;
  return parseCollection(data, firebaseToBudgetLedger);
}

export async function getLedger(
  uid: string,
  id: string,
): Promise<BudgetLedger | undefined> {
  const snapshot = await userRef(uid).child(`budgetLedgers/${id}`).get();
  if (!snapshot.exists()) {
    return undefined;
  }
  return firebaseToBudgetLedger(id, snapshot.val() as FirebaseBudgetLedger);
}

export async function createLedger(
  uid: string,
  input: CreateLedgerInput,
): Promise<BudgetLedger> {
  const newRef = userRef(uid).child("budgetLedgers").push();
  if (!newRef.key) {
    throw new Error("Failed to generate ledger key");
  }
  await newRef.set(
    budgetLedgerToFirebase({ name: input.name, cashCap: input.cashCap }),
  );
  return { id: newRef.key, name: input.name, cashCap: input.cashCap };
}

export async function updateLedger(
  uid: string,
  id: string,
  input: UpdateLedgerInput,
): Promise<void> {
  const updates: Partial<FirebaseBudgetLedger> = {};
  if (input.name !== undefined) {
    updates.name = input.name;
  }
  if (input.cashCap !== undefined) {
    updates.cashCap = input.cashCap ?? null;
  }
  await userRef(uid).child(`budgetLedgers/${id}`).update(updates);
}

export async function deleteLedger(uid: string, id: string): Promise<void> {
  await userRef(uid).update({
    [`budgetLedgers/${id}`]: null,
    [`budgetLedgerTransactions/${id}`]: null,
    [`budgetLedgerSavingsGoals/${id}`]: null,
  });
}
