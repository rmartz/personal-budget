"use client";

import { useState } from "react";

import type { AddExpenseInput } from "@/components/ledger-transactions/AddExpenseDialog";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import { createTransaction } from "@/services/transactions";

export function useCreateTransaction(uid: string, ledgerId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addExpense = async (data: AddExpenseInput): Promise<void> => {
    if (!uid || !ledgerId) {
      throw new Error("Cannot create transaction: missing uid or ledgerId");
    }
    setIsSubmitting(true);
    try {
      await createTransaction(uid, ledgerId, {
        type: BudgetLedgerTransactionType.Expense,
        date: data.date,
        amount: data.amount,
        description: data.description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { addExpense, isSubmitting };
}
