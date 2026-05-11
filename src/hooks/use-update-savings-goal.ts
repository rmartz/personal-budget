"use client";

import { useState } from "react";
import { updateSavingsGoal, getSavingsGoals } from "@/services/savings-goals";

export function useUpdateSavingsGoal(uid: string, ledgerId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editGoal = async (
    id: string,
    data: { name: string; targetAmount: number },
  ): Promise<void> => {
    if (!uid || !ledgerId) {
      throw new Error("Cannot update goal: missing uid or ledgerId");
    }
    setIsSubmitting(true);
    try {
      await updateSavingsGoal(uid, ledgerId, id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reorderGoal = async (
    goalId: string,
    swapWithId: string,
  ): Promise<void> => {
    if (!uid || !ledgerId) {
      throw new Error("Cannot reorder goal: missing uid or ledgerId");
    }
    setIsSubmitting(true);
    try {
      const goals = await getSavingsGoals(uid, ledgerId);
      const goal = goals.find((g) => g.id === goalId);
      const swapWith = goals.find((g) => g.id === swapWithId);
      if (!goal || !swapWith) {
        throw new Error("Cannot reorder goal: one or both goals not found");
      }
      await Promise.all([
        updateSavingsGoal(uid, ledgerId, goalId, {
          priority: swapWith.priority,
        }),
        updateSavingsGoal(uid, ledgerId, swapWithId, {
          priority: goal.priority,
        }),
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { editGoal, reorderGoal, isSubmitting };
}
