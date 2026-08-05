"use client";

import { useState } from "react";

import type { InvestmentAccount } from "@/lib/firebase/schema/investments";
import { updateInvestmentAccount } from "@/services/investment-accounts";

export function useUpdateInvestmentAccount(uid: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateOne = async (
    id: string,
    data: Partial<Omit<InvestmentAccount, "id">>,
  ): Promise<void> => {
    if (!uid) {
      throw new Error(
        "Cannot update investment account: user is not authenticated",
      );
    }
    setIsSubmitting(true);
    try {
      await updateInvestmentAccount(uid, id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateOne, isSubmitting };
}
