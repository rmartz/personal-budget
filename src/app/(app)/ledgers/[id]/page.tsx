"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useLedgersSubscription } from "@/hooks/use-ledgers-subscription";
import { useCreateTransaction } from "@/hooks/use-create-transaction";
import { useCreateDeposit } from "@/hooks/use-create-deposit";
import { useDeleteTransaction } from "@/hooks/use-delete-transaction";
import { useSavingsGoals } from "@/hooks/use-savings-goals";
import { useUpdateSavingsGoal } from "@/hooks/use-update-savings-goal";
import { useDeleteSavingsGoal } from "@/hooks/use-delete-savings-goal";
import { useUpdateTransaction } from "@/hooks/use-update-transaction";
import {
  LedgerTransactionListView,
  AddExpenseDialog,
  EditTransactionDialog,
} from "@/components/ledger-transactions";
import { AddDepositDialog } from "@/components/ledgers";
import { SavingsGoalListView } from "@/components/savings-goals";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";

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
  const [editingTransaction, setEditingTransaction] = useState<
    BudgetLedgerTransaction | undefined
  >(undefined);

  const ledger = ledgers.find((l) => l.id === id);
  const isLoading = authLoading || ledgersLoading || txLoading;
  const ledgerName = ledger?.name ?? "";

  const handleAddDeposit = async (data: DepositInput): Promise<void> => {
    await createDeposit(data);
  };

  const handleEditTransaction = (transaction: BudgetLedgerTransaction) => {
    setEditingTransaction(transaction);
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <LedgerTransactionListView
        ledgerName={ledgerName}
        transactions={transactions}
        isLoading={isLoading}
        onAddDeposit={() => {
          setDepositDialogOpen(true);
        }}
        onAddExpense={() => {
          setExpenseDialogOpen(true);
        }}
        onDeleteTransaction={deleteTransaction}
        onEditTransaction={handleEditTransaction}
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
      <SavingsGoalListView
        goals={savingsGoals}
        onDelete={deleteGoal}
        onEdit={editGoal}
        onReorder={reorderGoal}
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
    </div>
  );
}
