"use client";

import { useMutation } from "@tanstack/react-query";

import { deleteTransaction } from "@/services/transactions";

export function useDeleteTransaction(uid: string, ledgerId: string) {
  return useMutation({
    mutationFn: (transactionId: string) => {
      if (!uid || !ledgerId) {
        return Promise.reject(
          new Error(
            "Cannot delete transaction: user is not authenticated or ledger id is missing",
          ),
        );
      }
      return deleteTransaction(uid, ledgerId, transactionId);
    },
  });
}
