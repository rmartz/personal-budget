"use client";

import { useMutation } from "@tanstack/react-query";

import {
  type BudgetLedgerTransaction,
  BudgetLedgerTransactionType,
} from "@/lib/firebase/schema/budget-ledger-transactions";
import { createTransaction } from "@/services/transactions";

type DepositInput = Omit<BudgetLedgerTransaction, "id" | "ledgerId" | "type">;

export function useCreateDeposit(uid: string, ledgerId: string) {
  return useMutation({
    mutationFn: (data: DepositInput) => {
      if (!uid || !ledgerId) {
        return Promise.reject(
          new Error("Cannot create transaction: missing uid or ledgerId"),
        );
      }
      return createTransaction(uid, ledgerId, {
        ...data,
        type: BudgetLedgerTransactionType.Deposit,
      });
    },
  });
}
