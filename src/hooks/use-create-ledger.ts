"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateLedgerInput } from "@/lib/types";
import { createLedger } from "@/services/ledgers";

export function useCreateLedger(uid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLedgerInput) => {
      if (!uid) {
        return Promise.reject(
          new Error("Cannot create ledger: user is not authenticated"),
        );
      }
      return createLedger(uid, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ledgers", uid] });
    },
  });
}
