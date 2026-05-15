"use client";

import { useState } from "react";

import type { EditAnnuityInput } from "@/components/annuities";
import { updateAnnuity } from "@/services/annuities";

export function useUpdateAnnuity(uid: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateOne = async (
    id: string,
    data: EditAnnuityInput,
  ): Promise<void> => {
    if (!uid) {
      throw new Error("Cannot update annuity: user is not authenticated");
    }
    setIsSubmitting(true);
    try {
      await updateAnnuity(uid, id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateOne, isSubmitting };
}
