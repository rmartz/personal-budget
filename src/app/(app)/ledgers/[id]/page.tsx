"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { LedgerDetailView } from "@/components/ledger-detail/LedgerDetailView";
import {
  AddExpenseDialog,
  EditTransactionDialog,
} from "@/components/ledger-transactions";
import { AddDepositDialog } from "@/components/ledgers";
import { NewSavingsGoalDialog } from "@/components/savings-goals";
import { useAuth } from "@/hooks/use-auth";
import { useCreateDeposit } from "@/hooks/use-create-deposit";
import { useCreateTransaction } from "@/hooks/use-create-transaction";
import { useDeleteSavingsGoal } from "@/hooks/use-delete-savings-goal";
import { useDeleteTransaction } from "@/hooks/use-delete-transaction";
import { useLedgersSubscription } from "@/hooks/use-ledgers-subscription";
import { useSavingsGoals } from "@/hooks/use-savings-goals";
import { useTransactions } from "@/hooks/use-transactions";
import { useUpdateSavingsGoal } from "@/hooks/use-update-savings-goal";
import { useUpdateTransaction } from "@/hooks/use-update-transaction";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { calculateLedgerBalance } from "@/lib/reconciliation/ledger-balance";
import type { Ledger, UpdateLedgerInput } from "@/lib/types";
import { updateLedger } from "@/services/ledgers";
import { createSavingsGoal } from "@/services/savings-goals";

type DepositInput = Omit<BudgetLedgerTransaction, "id" | "ledgerId" | "type">;

export default function LedgerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";

  const { ledgers, isLoading: ledgersLoading } = useLedgersSubscription(uid);
  const { transactions, isLoading: txLoading } = useTransactions(uid, id);
  const { addExpense, isSubmitting: isExpenseSubmitting } =
    useCreateTransaction(uid, id);
  const { mutateAsync: createDeposit, isPending: isDepositPending } =
    useCreateDeposit(uid, id);
  const { mutate: deleteTransaction } = useDeleteTransaction(uid, id);
  const { savingsGoals } = useSavingsGoals(uid, id);
  const { editGoal, reorderGoal } = useUpdateSavingsGoal(uid, id);
  const { mutate: deleteGoal } = useDeleteSavingsGoal(uid, id);
  const { mutateAsync: updateTransaction, isPending: isUpdatePending } =
    useUpdateTransaction(uid, id);

  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    BudgetLedgerTransaction | undefined
  >(undefined);

  const budgetLedger = ledgers.find((l) => l.id === id);
  const ledger: Ledger | undefined = budgetLedger
    ? {
        ...budgetLedger,
        ...calculateLedgerBalance({
          cashCap: budgetLedger.cashCap,
          transactions,
        }),
      }
    : undefined;
  const isLoading = authLoading || ledgersLoading || txLoading;

  const handleAddDeposit = async (data: DepositInput): Promise<void> => {
    await createDeposit(data);
  };

  const handleSaveLedger = async (
    ledgerId: string,
    data: UpdateLedgerInput,
  ): Promise<void> => {
    await updateLedger(uid, ledgerId, data);
  };

  const handleAddGoal = async (
    name: string,
    targetAmount: number,
  ): Promise<void> => {
    await createSavingsGoal(uid, id, {
      name,
      targetAmount,
      fundedAmount: 0,
      priority: savingsGoals.length + 1,
    });
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <>
      <LedgerDetailView
        ledger={ledger}
        transactions={transactions}
        savingsGoals={savingsGoals}
        isLoading={isLoading}
        onSaveLedger={handleSaveLedger}
        onAddExpense={() => {
          setExpenseDialogOpen(true);
        }}
        onAddDeposit={() => {
          setDepositDialogOpen(true);
        }}
        onAddGoal={() => {
          setGoalDialogOpen(true);
        }}
        onDeleteTransaction={deleteTransaction}
        onEditTransaction={(tx) => {
          setEditingTransaction(tx);
        }}
        onDeleteGoal={deleteGoal}
        onEditGoal={editGoal}
        onReorderGoal={reorderGoal}
      />
      <AddDepositDialog
        open={depositDialogOpen}
        onOpenChange={setDepositDialogOpen}
        onSubmit={handleAddDeposit}
        isSubmitting={isDepositPending}
      />
      <AddExpenseDialog
        open={expenseDialogOpen}
        onSubmit={addExpense}
        onClose={() => {
          setExpenseDialogOpen(false);
        }}
        isSubmitting={isExpenseSubmitting}
      />
      <NewSavingsGoalDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        onSubmit={handleAddGoal}
      />
      {editingTransaction !== undefined && (
        <EditTransactionDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(undefined);
          }}
          onSubmit={(data) =>
            updateTransaction({ id: editingTransaction.id, data })
          }
          isSubmitting={isUpdatePending}
          initialDate={editingTransaction.date}
          initialAmount={editingTransaction.amount}
          initialDescription={editingTransaction.description}
        />
      )}
    </>
  );
}
