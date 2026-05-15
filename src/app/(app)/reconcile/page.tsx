"use client";

import { useState } from "react";

import type { CreateExpenseInput } from "@/components/reconcile/CreateExpenseDialog";
import { CreateExpenseDialog } from "@/components/reconcile/CreateExpenseDialog";
import { ReconcileView } from "@/components/reconcile/ReconcileView";
import { useAuth } from "@/hooks/use-auth";
import { createReconciliationExpense } from "@/services/reconciliation-expenses";

export default function ReconcilePage() {
  const { user } = useAuth();
  const uid = user?.uid ?? "";
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const handleCreateExpense = async (data: CreateExpenseInput) => {
    await createReconciliationExpense(uid, {
      name: data.name,
      type: data.type,
      typicalAmount: data.typicalAmount,
    });
  };

  return (
    <>
      <ReconcileView
        onNewExpense={() => {
          setExpenseDialogOpen(true);
        }}
      />
      <CreateExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        onSubmit={handleCreateExpense}
      />
    </>
  );
}
