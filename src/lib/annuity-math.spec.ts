import { describe, expect, it } from "vitest";

import { calculateMonthlyPayment } from "./annuity-math";

describe("calculateMonthlyPayment", () => {
  it("calculates the correct monthly payment for a known loan", () => {
    // $10,000 at 5% annual interest for 12 months
    // Expected: PMT = 10000 * (0.05/12) / (1 - (1 + 0.05/12)^(-12))
    // = 10000 * 0.004167 / (1 - 0.9513) ≈ $856.07
    const result = calculateMonthlyPayment({
      presentValue: 10000,
      annualRatePercent: 5,
      durationMonths: 12,
    });
    expect(Math.round(result * 100) / 100).toBe(856.07);
  });

  it("calculates the correct monthly payment for a 30-year mortgage", () => {
    // $200,000 at 6% for 360 months ≈ $1,199.10
    const result = calculateMonthlyPayment({
      presentValue: 200000,
      annualRatePercent: 6,
      durationMonths: 360,
    });
    expect(Math.round(result * 100) / 100).toBe(1199.1);
  });

  it("returns presentValue / durationMonths when rate is 0", () => {
    const result = calculateMonthlyPayment({
      presentValue: 1200,
      annualRatePercent: 0,
      durationMonths: 12,
    });
    expect(result).toBe(100);
  });
});
