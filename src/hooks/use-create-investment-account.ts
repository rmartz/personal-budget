"use client";

import { useState } from "react";

import type { InvestmentAccount } from "@/lib/firebase/schema/investments";
import { createInvestmentAccount } from "@/services/investment-accounts";

export function useCreateInvestmentAccount(uid: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOne = async (
    data: Omit<InvestmentAccount, "id">,
  ): Promise<InvestmentAccount> => {
    if (!uid) {
      throw new Error(
        "Cannot create investment account: user is not authenticated",
      );
    }
    setIsSubmitting(true);
    try {
      return await createInvestmentAccount(uid, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createOne, isSubmitting };
}
