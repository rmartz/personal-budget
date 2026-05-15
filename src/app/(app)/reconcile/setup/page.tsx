"use client";

import { useState } from "react";

import { DeleteAccountDialog } from "@/components/reconcile/DeleteAccountDialog";
import { DeleteExpenseDialog } from "@/components/reconcile/DeleteExpenseDialog";
import type { EditAccountInput } from "@/components/reconcile/EditAccountDialog";
import { EditAccountDialog } from "@/components/reconcile/EditAccountDialog";
import type { EditExpenseInput } from "@/components/reconcile/EditExpenseDialog";
import { EditExpenseDialog } from "@/components/reconcile/EditExpenseDialog";
import { ReconcileSetupView } from "@/components/reconcile/ReconcileSetupView";
import { useAuth } from "@/hooks/use-auth";
import { useReconciliationAccounts } from "@/hooks/use-reconciliation-accounts";
import { useReconciliationExpenses } from "@/hooks/use-reconciliation-expenses";
import type { ReconciliationAccount } from "@/lib/firebase/schema/reconciliation-accounts";
import type { ReconciliationExpense } from "@/lib/firebase/schema/reconciliation-expenses";
import {
  deleteReconciliationAccount,
  updateReconciliationAccount,
} from "@/services/reconciliation-accounts";
import {
  deleteReconciliationExpense,
  updateReconciliationExpense,
} from "@/services/reconciliation-expenses";

export default function ReconcileSetupPage() {
  const { user } = useAuth();
  const uid = user?.uid ?? "";
  const { reconciliationAccounts } = useReconciliationAccounts(uid);
  const { reconciliationExpenses } = useReconciliationExpenses(uid);

  const [editingAccount, setEditingAccount] = useState<
    ReconciliationAccount | undefined
  >(undefined);
  const [deletingAccount, setDeletingAccount] = useState<
    ReconciliationAccount | undefined
  >(undefined);
  const [accountDeleteError, setAccountDeleteError] = useState<
    string | undefined
  >(undefined);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [editingExpense, setEditingExpense] = useState<
    ReconciliationExpense | undefined
  >(undefined);
  const [deletingExpense, setDeletingExpense] = useState<
    ReconciliationExpense | undefined
  >(undefined);
  const [expenseDeleteError, setExpenseDeleteError] = useState<
    string | undefined
  >(undefined);
  const [isDeletingExpense, setIsDeletingExpense] = useState(false);

  async function handleUpdateAccount(
    id: string,
    data: EditAccountInput,
  ): Promise<void> {
    await updateReconciliationAccount(uid, id, {
      name: data.name,
      targetFloat: data.targetFloat,
    });
  }

  async function handleConfirmDeleteAccount(): Promise<void> {
    if (!deletingAccount) return;
    setAccountDeleteError(undefined);
    setIsDeletingAccount(true);
    try {
      await deleteReconciliationAccount(uid, deletingAccount.id);
      setDeletingAccount(undefined);
    } catch {
      setAccountDeleteError("Failed to delete account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  }

  async function handleUpdateExpense(
    id: string,
    data: EditExpenseInput,
  ): Promise<void> {
    await updateReconciliationExpense(uid, id, {
      name: data.name,
      type: data.type,
      typicalAmount: data.typicalAmount,
    });
  }

  async function handleConfirmDeleteExpense(): Promise<void> {
    if (!deletingExpense) return;
    setExpenseDeleteError(undefined);
    setIsDeletingExpense(true);
    try {
      await deleteReconciliationExpense(uid, deletingExpense.id);
      setDeletingExpense(undefined);
    } catch {
      setExpenseDeleteError("Failed to delete expense. Please try again.");
    } finally {
      setIsDeletingExpense(false);
    }
  }

  return (
    <>
      <ReconcileSetupView
        accounts={reconciliationAccounts}
        expenses={reconciliationExpenses}
        onEditAccount={setEditingAccount}
        onDeleteAccount={setDeletingAccount}
        onEditExpense={setEditingExpense}
        onDeleteExpense={setDeletingExpense}
      />

      <EditAccountDialog
        open={editingAccount !== undefined}
        onOpenChange={(open) => {
          if (!open) setEditingAccount(undefined);
        }}
        account={editingAccount}
        onSubmit={handleUpdateAccount}
      />

      <DeleteAccountDialog
        open={deletingAccount !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingAccount(undefined);
            setAccountDeleteError(undefined);
          }
        }}
        accountName={deletingAccount?.name ?? ""}
        onConfirm={() => void handleConfirmDeleteAccount()}
        isDeleting={isDeletingAccount}
        deleteError={accountDeleteError}
      />

      <EditExpenseDialog
        open={editingExpense !== undefined}
        onOpenChange={(open) => {
          if (!open) setEditingExpense(undefined);
        }}
        expense={editingExpense}
        onSubmit={handleUpdateExpense}
      />

      <DeleteExpenseDialog
        open={deletingExpense !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingExpense(undefined);
            setExpenseDeleteError(undefined);
          }
        }}
        expenseName={deletingExpense?.name ?? ""}
        onConfirm={() => void handleConfirmDeleteExpense()}
        isDeleting={isDeletingExpense}
        deleteError={expenseDeleteError}
      />
    </>
  );
}
