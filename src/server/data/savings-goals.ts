import { getAdminDatabase } from "@/lib/firebase/admin";
import { parseCollection } from "@/lib/firebase/schema/parse-collection";
import {
  type BudgetLedgerSavingsGoal,
  firebaseToBudgetLedgerSavingsGoal,
} from "@/lib/firebase/schema/savings-goals";

/**
 * Server-side savings-goal reads over the Firebase Admin SDK — the shared layer
 * MCP tools (and, later, HTTP endpoints) call. Scoped to a `uid` derived once
 * from a verified identity, so a caller only ever reaches its own subtree.
 */

function ledgerGoalsRef(uid: string, ledgerId: string) {
  return getAdminDatabase().ref(
    `users/${uid}/budgetLedgerSavingsGoals/${ledgerId}`,
  );
}

export async function listSavingsGoals(
  uid: string,
  ledgerId: string,
): Promise<BudgetLedgerSavingsGoal[]> {
  const snapshot = await ledgerGoalsRef(uid, ledgerId).get();
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val() as Record<string, unknown>;
  return parseCollection(data, (id, entry) =>
    firebaseToBudgetLedgerSavingsGoal(id, ledgerId, entry),
  );
}

export async function getSavingsGoal(
  uid: string,
  ledgerId: string,
  id: string,
): Promise<BudgetLedgerSavingsGoal | undefined> {
  const snapshot = await ledgerGoalsRef(uid, ledgerId).child(id).get();
  if (!snapshot.exists()) {
    return undefined;
  }
  return firebaseToBudgetLedgerSavingsGoal(id, ledgerId, snapshot.val());
}
