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

  it("returns true when floating-point ratios round to 100 within tolerance", () => {
    // 33.33 + 33.33 + 33.34 = 100.00
    expect(
      validateAllocationRatios([
        { targetPercent: 33.33 },
        { targetPercent: 33.33 },
        { targetPercent: 33.34 },
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
    // sum = 99.9 — outside the 0.01 tolerance
    expect(
      validateAllocationRatios([
        { targetPercent: 49.9 },
        { targetPercent: 50 },
      ]),
    ).toBe(false);
  });
});
