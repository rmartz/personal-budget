import { describe, expect, it } from "vitest";

import { applyDepositSplit } from "./deposit-split";

describe("applyDepositSplit — no cash cap", () => {
  it("deposits entirely into cash when there is no cash cap", () => {
    const result = applyDepositSplit({
      cashBalance: 100,
      cashCap: undefined,
      depositAmount: 500,
      investmentBalance: 0,
    });
    expect(result.cashBalance).toBe(600);
    expect(result.investmentBalance).toBe(0);
  });

  it("preserves an existing investment balance when there is no cash cap", () => {
    const result = applyDepositSplit({
      cashBalance: 0,
      cashCap: undefined,
      depositAmount: 300,
      investmentBalance: 150,
    });
    expect(result.cashBalance).toBe(300);
    expect(result.investmentBalance).toBe(150);
  });
});

describe("applyDepositSplit — cash below cap", () => {
  it("deposits entirely into cash when the deposit fits within the remaining cap space", () => {
    const result = applyDepositSplit({
      cashBalance: 200,
      cashCap: 1000,
      depositAmount: 300,
      investmentBalance: 0,
    });
    expect(result.cashBalance).toBe(500);
    expect(result.investmentBalance).toBe(0);
  });

  it("fills cash to the cap and overflows the remainder into investment", () => {
    const result = applyDepositSplit({
      cashBalance: 700,
      cashCap: 1000,
      depositAmount: 500,
      investmentBalance: 50,
    });
    expect(result.cashBalance).toBe(1000);
    expect(result.investmentBalance).toBe(250);
  });

  it("fills cash exactly to the cap with no overflow when the deposit matches the remaining space", () => {
    const result = applyDepositSplit({
      cashBalance: 600,
      cashCap: 1000,
      depositAmount: 400,
      investmentBalance: 0,
    });
    expect(result.cashBalance).toBe(1000);
    expect(result.investmentBalance).toBe(0);
  });
});

describe("applyDepositSplit — cash at or above cap", () => {
  it("deposits entirely into investment when cash is already at the cap", () => {
    const result = applyDepositSplit({
      cashBalance: 1000,
      cashCap: 1000,
      depositAmount: 200,
      investmentBalance: 100,
    });
    expect(result.cashBalance).toBe(1000);
    expect(result.investmentBalance).toBe(300);
  });

  it("deposits entirely into investment when cash already exceeds the cap", () => {
    const result = applyDepositSplit({
      cashBalance: 1200,
      cashCap: 1000,
      depositAmount: 150,
      investmentBalance: 0,
    });
    expect(result.cashBalance).toBe(1200);
    expect(result.investmentBalance).toBe(150);
  });
});
