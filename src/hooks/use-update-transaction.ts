"use client";

import { useMutation } from "@tanstack/react-query";
import { updateTransaction } from "@/services/transactions";
import type { EditTransactionInput } from "@/components/ledger-transactions/EditTransactionDialog";

interface UpdateTransactionArgs {
  id: string;
  data: EditTransactionInput;
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
