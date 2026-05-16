"use client";

import { useState } from "react";

import type { CreateExpenseInput } from "@/components/reconcile/CreateExpenseDialog";
import { CreateExpenseDialog } from "@/components/reconcile/CreateExpenseDialog";
import { ReconcileView } from "@/components/reconcile/ReconcileView";
import { useAuth } from "@/hooks/use-auth";
import { createReconciliationExpense } from "@/services/reconciliation-expenses";

export default function ReconcilePage() {
  const { user, loading: authLoading } = useAuth();
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const handleCreateExpense = async (data: CreateExpenseInput) => {
    if (authLoading || !user) return;
    await createReconciliationExpense(user.uid, {
      name: data.name,
      type: data.type,
      typicalAmount: data.typicalAmount,
    });
  };

  return (
    <>
      <ReconcileView
        onNewExpense={
          authLoading || !user
            ? undefined
            : () => {
                setExpenseDialogOpen(true);
              }
        }
      />
      <CreateExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        onSubmit={handleCreateExpense}
      />
    </>
  );
}
