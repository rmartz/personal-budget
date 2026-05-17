"use client";

import { useState } from "react";

import { deleteAnnuity } from "@/services/annuities";

export function useDeleteAnnuity(uid: string) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteOne = async (id: string): Promise<void> => {
    if (!uid) {
      throw new Error("Cannot delete annuity: user is not authenticated");
    }
    setIsDeleting(true);
    try {
      await deleteAnnuity(uid, id);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteOne, isDeleting };
}
