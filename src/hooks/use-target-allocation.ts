"use client";

// TODO: Implement real Firebase subscription in epic #11 (Investment Target Allocation)
import {
  Posture,
  type AllocationTarget,
} from "@/lib/firebase/schema/investments";

export function useTargetAllocation(_uid: string): {
  allocation: AllocationTarget[];
  posture: Posture;
  isLoading: boolean;
} {
  return {
    allocation: [],
    posture: Posture.Balanced,
    isLoading: false,
  };
}
