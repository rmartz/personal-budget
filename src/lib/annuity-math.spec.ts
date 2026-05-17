import { describe, expect, it } from "vitest";

import {
  calculateMonthlyPayment,
  calculateRemainingPrincipal,
} from "./annuity-math";

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

describe("calculateRemainingPrincipal", () => {
  it("returns the full present value when 0 payments have been made", () => {
    const result = calculateRemainingPrincipal({
      presentValue: 10000,
      annualRatePercent: 5,
      durationMonths: 12,
      monthsElapsed: 0,
    });
    expect(result).toBe(10000);
  });

  it("returns approximately 0 when all payments have been made", () => {
    const result = calculateRemainingPrincipal({
      presentValue: 10000,
      annualRatePercent: 5,
      durationMonths: 12,
      monthsElapsed: 12,
    });
    expect(Math.abs(result)).toBeLessThan(0.01);
  });

  it("returns PV - PMT * n when rate is 0", () => {
    // $1200 at 0% for 12 months → PMT = $100/month; after 6 payments: $600
    const result = calculateRemainingPrincipal({
      presentValue: 1200,
      annualRatePercent: 0,
      durationMonths: 12,
      monthsElapsed: 6,
    });
    expect(result).toBe(600);
  });

  it("returns the correct mid-term balance for a known mortgage", () => {
    // $200,000 at 6% for 360 months, after 1 payment
    // B(1) = PV*(1+r) - PMT = 201000 - 1199.10 = 199800.90
    const result = calculateRemainingPrincipal({
      presentValue: 200000,
      annualRatePercent: 6,
      durationMonths: 360,
      monthsElapsed: 1,
    });
    expect(Math.round(result * 100) / 100).toBe(199800.9);
  });

  it("returns 0 when monthsElapsed exceeds durationMonths (with interest rate)", () => {
    const result = calculateRemainingPrincipal({
      presentValue: 10000,
      annualRatePercent: 5,
      durationMonths: 12,
      monthsElapsed: 13,
    });
    expect(result).toBe(0);
  });

  it("returns 0 when monthsElapsed exceeds durationMonths (zero rate)", () => {
    const result = calculateRemainingPrincipal({
      presentValue: 1200,
      annualRatePercent: 0,
      durationMonths: 12,
      monthsElapsed: 15,
    });
    expect(result).toBe(0);
  });
});
