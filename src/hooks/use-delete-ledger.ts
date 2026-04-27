"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLedger } from "@/services/ledgers";

export function useDeleteLedger(uid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!uid) {
        return Promise.reject(
          new Error("Cannot delete ledger: user is not authenticated"),
        );
      }
      return deleteLedger(uid, id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ledgers", uid] });
    },
  });
}
