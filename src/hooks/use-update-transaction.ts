"use client";

import { useMutation } from "@tanstack/react-query";
import type { BudgetLedgerTransaction } from "@/lib/firebase/schema/budget-ledger-transactions";
import { updateTransaction } from "@/services/transactions";

type UpdateTransactionInput = Pick<
  BudgetLedgerTransaction,
  "date" | "amount" | "description"
>;

interface UpdateTransactionArgs {
  id: string;
  data: UpdateTransactionInput;
}

export function useUpdateTransaction(uid: string, ledgerId: string) {
  return useMutation({
    mutationFn: ({ id, data }: UpdateTransactionArgs) => {
      if (!uid || !ledgerId) {
        return Promise.reject(
          new Error("Cannot update transaction: missing uid or ledgerId"),
        );
      }
      return updateTransaction(uid, ledgerId, id, data);
    },
  });
}
