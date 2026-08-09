export interface AdjustedInvestmentRecommendationInputs {
  alreadyInvestedThisMonth: number;
  grossRecommendation: number;
}

/**
 * Returns how much of the gross investment recommendation still needs to be
 * invested this month, after subtracting contributions already made.
 *
 * Never returns a negative value — if more has been invested than recommended,
 * the adjusted recommendation is 0 (not a signal to withdraw).
 */
export function calculateAdjustedInvestmentRecommendation({
  alreadyInvestedThisMonth,
  grossRecommendation,
}: AdjustedInvestmentRecommendationInputs): number {
  return Math.max(0, grossRecommendation - alreadyInvestedThisMonth);
}
