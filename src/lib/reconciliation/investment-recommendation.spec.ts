import { describe, expect, it } from "vitest";

import { calculateAdjustedInvestmentRecommendation } from "./investment-recommendation";

describe("calculateAdjustedInvestmentRecommendation — remaining amount to invest", () => {
  it("returns gross minus already-invested when already-invested is less than gross", () => {
    expect(
      calculateAdjustedInvestmentRecommendation({
        alreadyInvestedThisMonth: 300,
        grossRecommendation: 1200,
      }),
    ).toBe(900);
  });

  it("returns zero when already-invested equals the gross recommendation", () => {
    expect(
      calculateAdjustedInvestmentRecommendation({
        alreadyInvestedThisMonth: 1200,
        grossRecommendation: 1200,
      }),
    ).toBe(0);
  });

  it("returns zero when already-invested exceeds the gross recommendation", () => {
    expect(
      calculateAdjustedInvestmentRecommendation({
        alreadyInvestedThisMonth: 1500,
        grossRecommendation: 1200,
      }),
    ).toBe(0);
  });

  it("returns the full gross recommendation when nothing has been invested yet", () => {
    expect(
      calculateAdjustedInvestmentRecommendation({
        alreadyInvestedThisMonth: 0,
        grossRecommendation: 800,
      }),
    ).toBe(800);
  });

  it("returns zero when the gross recommendation is zero", () => {
    expect(
      calculateAdjustedInvestmentRecommendation({
        alreadyInvestedThisMonth: 0,
        grossRecommendation: 0,
      }),
    ).toBe(0);
  });
});
