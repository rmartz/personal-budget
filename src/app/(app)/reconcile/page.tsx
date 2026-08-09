"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import {
  CreateExpenseDialog,
  type CreateExpenseInput,
  createReconciliationExpense,
  ReconcileView,
} from "@/reconcile";

export default function ReconcilePage() {
  const { user, loading: authLoading } = useAuth();
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const handleCreateExpense = async (data: CreateExpenseInput) => {
    if (authLoading || !user) throw new Error("User is not authenticated");
    await createReconciliationExpense(user.uid, {
      name: data.name,
      type: data.type,
      typicalAmount: data.typicalAmount,
    });
  };

  if (authLoading || !user) return null;

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
