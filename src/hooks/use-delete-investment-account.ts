"use client";

import { useState } from "react";

import { deleteInvestmentAccount } from "@/services/investment-accounts";

export function useDeleteInvestmentAccount(uid: string) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteOne = async (id: string): Promise<void> => {
    if (!uid) {
      throw new Error(
        "Cannot delete investment account: user is not authenticated",
      );
    }
    setIsDeleting(true);
    try {
      await deleteInvestmentAccount(uid, id);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteOne, isDeleting };
}
