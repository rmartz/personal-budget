export interface AllocationRatio {
  targetPercent: number;
}

/**
 * Returns true when the target allocation ratios across all investment
 * accounts sum to exactly 100% (within a floating-point tolerance of 0.01).
 *
 * Returns false for an empty array — at least one account must be defined
 * for the allocation to be meaningful.
 */
export function validateAllocationRatios(ratios: AllocationRatio[]): boolean {
  if (ratios.length === 0) return false;
  const total = ratios.reduce(
    (sum, { targetPercent }) => sum + targetPercent,
    0,
  );
  return Math.abs(total - 100) < 0.01;
}
