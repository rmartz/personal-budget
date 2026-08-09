import { Posture } from "@/lib/firebase/schema/investments";

export interface PostureRecommendationInput {
  baseRecommendation: number;
  margin: number;
  posture: Posture;
}

/**
 * Adjusts a base monthly investment recommendation according to the user's
 * selected reconciliation posture and the current investment margin.
 *
 * Posture rules:
 * - Aggressive: always return the base recommendation unchanged.
 * - Balanced: offset buy recommendations by positive margin (user is ahead);
 *   offset sell recommendations by negative margin (user is behind).
 * - Conservative: offset buy recommendations by positive margin;
 *   sell recommendations are always returned at the full base amount.
 *
 * A positive return value signals a buy; a negative value signals a sell.
 */
export function applyPostureAdjustment({
  baseRecommendation,
  margin,
  posture,
}: PostureRecommendationInput): number {
  if (posture === Posture.Aggressive) {
    return baseRecommendation;
  }

  if (baseRecommendation > 0 && margin > 0) {
    // Both Balanced and Conservative offset buy recommendations by positive margin
    return Math.max(0, baseRecommendation - margin);
  }

  if (baseRecommendation < 0 && margin < 0 && posture === Posture.Balanced) {
    // Only Balanced offsets sell recommendations by negative margin
    return Math.min(0, baseRecommendation - margin);
  }

  return baseRecommendation;
}
