"use client";

import { useState } from "react";

import { Posture } from "@/lib/firebase/schema/investments";
import { updateUserSettings } from "@/services/user-settings";

export function useUpdateReconciliationPosture(uid: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setPosture = async (posture: Posture): Promise<void> => {
    if (!uid) {
      throw new Error("Cannot update posture: user is not authenticated");
    }
    setIsSubmitting(true);
    try {
      await updateUserSettings(uid, { reconciliationPosture: posture });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { setPosture, isSubmitting };
}
