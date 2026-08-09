import { describe, expect, it } from "vitest";

import { validateAllocationRatios } from "./allocation-validation";

describe("validateAllocationRatios — valid inputs", () => {
  it("returns true when ratios sum to exactly 100", () => {
    expect(
      validateAllocationRatios([
        { targetPercent: 60 },
        { targetPercent: 30 },
        { targetPercent: 10 },
      ]),
    ).toBe(true);
  });

  it("returns true for a single account at 100%", () => {
    expect(validateAllocationRatios([{ targetPercent: 100 }])).toBe(true);
  });

  it("returns true when floating-point ratios sum to within the strict tolerance", () => {
    // 33.333 + 33.333 + 33.333 = 99.999 — 0.001 away from 100, within the < 0.01 threshold
    expect(
      validateAllocationRatios([
        { targetPercent: 33.333 },
        { targetPercent: 33.333 },
        { targetPercent: 33.333 },
      ]),
    ).toBe(true);
  });
});

describe("validateAllocationRatios — invalid inputs", () => {
  it("returns false when ratios sum to less than 100", () => {
    expect(
      validateAllocationRatios([{ targetPercent: 60 }, { targetPercent: 30 }]),
    ).toBe(false);
  });

  it("returns false when ratios sum to more than 100", () => {
    expect(
      validateAllocationRatios([
        { targetPercent: 60 },
        { targetPercent: 30 },
        { targetPercent: 15 },
      ]),
    ).toBe(false);
  });

  it("returns false when the array is empty", () => {
    expect(validateAllocationRatios([])).toBe(false);
  });

  it("returns false when ratios are close but outside tolerance", () => {
    // sum = 99.9 — 0.1 away from 100, outside the strict < 0.01 threshold
    expect(
      validateAllocationRatios([
        { targetPercent: 49.9 },
        { targetPercent: 50 },
      ]),
    ).toBe(false);
  });

  it("returns false when ratios are exactly at the tolerance boundary", () => {
    // 50.005 + 50.005 = 100.01 — exactly 0.01 away; the boundary is exclusive (< not <=)
    expect(
      validateAllocationRatios([
        { targetPercent: 50.005 },
        { targetPercent: 50.005 },
      ]),
    ).toBe(false);
  });
});
