import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { deleteSavingsGoalAndReorder } from "./savings-goals";
import { createTransaction, deleteTransaction } from "./transactions";

export interface PurchaseGoalInput {
  amount: number;
  date: Date;
  description: string;
}

export async function purchaseGoal(
  uid: string,
  goal: BudgetLedgerSavingsGoal,
  data: PurchaseGoalInput,
): Promise<void> {
  const description =
    data.description.trim() !== "" ? data.description.trim() : goal.name;
  const transaction = await createTransaction(uid, goal.ledgerId, {
    type: BudgetLedgerTransactionType.Expense,
    date: data.date,
    amount: data.amount,
    description,
  });
  try {
    await deleteSavingsGoalAndReorder(uid, goal.ledgerId, goal.id);
  } catch (err) {
    let rollbackErr: unknown;
    try {
      await deleteTransaction(uid, goal.ledgerId, transaction.id);
    } catch (e) {
      rollbackErr = e;
    }
    if (rollbackErr !== undefined) {
      throw new AggregateError(
        [err, rollbackErr],
        "Goal deletion failed and transaction rollback also failed",
        { cause: err },
      );
    }
    throw err;
  }
}
