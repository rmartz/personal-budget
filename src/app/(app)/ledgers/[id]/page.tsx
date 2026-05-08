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
import {
  LedgerTransactionListView,
  AddExpenseDialog,
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

  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const ledger = ledgers.find((l) => l.id === id);
  const isLoading = authLoading || ledgersLoading || txLoading;
  const ledgerName = ledger?.name ?? "";

  const handleAddDeposit = async (data: DepositInput): Promise<void> => {
    await createDeposit(data);
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
        onEdit={editGoal}
        onReorder={reorderGoal}
      />
    </div>
  );
}
