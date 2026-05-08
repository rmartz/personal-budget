"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteSavingsGoalAndReorder } from "@/services/savings-goals";

export function useDeleteSavingsGoal(uid: string, ledgerId: string) {
  return useMutation({
    mutationFn: (id: string) => {
      if (!uid) {
        return Promise.reject(
          new Error("Cannot delete savings goal: user is not authenticated"),
        );
      }
      if (!ledgerId) {
        return Promise.reject(
          new Error("Cannot delete savings goal: ledger id is required"),
        );
      }
      return deleteSavingsGoalAndReorder(uid, ledgerId, id);
    },
  });
}
