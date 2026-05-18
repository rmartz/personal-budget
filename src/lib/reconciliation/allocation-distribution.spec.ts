import { describe, expect, it } from "vitest";

import { distributeInvestmentAllocation } from "./allocation-distribution";

describe("distributeInvestmentAllocation — empty and zero inputs", () => {
  it("returns an empty array when no accounts are provided", () => {
    expect(distributeInvestmentAllocation([], 1000)).toEqual([]);
  });

  it("allocates zero to every account when totalAmount is zero", () => {
    const result = distributeInvestmentAllocation(
      [
        { accountId: "a", currentBalance: 500, targetPercent: 60 },
        { accountId: "b", currentBalance: 300, targetPercent: 40 },
      ],
      0,
    );
    expect(result).toHaveLength(2);
    expect(result.find((r) => r.accountId === "a")?.allocatedAmount).toBe(0);
    expect(result.find((r) => r.accountId === "b")?.allocatedAmount).toBe(0);
  });
});

describe("distributeInvestmentAllocation — single account", () => {
  it("allocates the full amount to a single account", () => {
    const result = distributeInvestmentAllocation(
      [{ accountId: "a", currentBalance: 200, targetPercent: 100 }],
      500,
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.accountId).toBe("a");
    expect(result[0]?.allocatedAmount).toBe(500);
  });
});

describe("distributeInvestmentAllocation — gap-weighted distribution", () => {
  it("sends all funds to the account furthest below target when the other is at target", () => {
    // A: balance=600, target=60% → current share=60%, gap=0%
    // B: balance=200, target=30% → current share=20%, gap=10%
    // C: balance=200, target=10% → current share=20%, gap=-10% (above target)
    // Only B has a positive gap — it receives 100% of the amount
    const result = distributeInvestmentAllocation(
      [
        { accountId: "a", currentBalance: 600, targetPercent: 60 },
        { accountId: "b", currentBalance: 200, targetPercent: 30 },
        { accountId: "c", currentBalance: 200, targetPercent: 10 },
      ],
      1000,
    );
    expect(result.find((r) => r.accountId === "a")?.allocatedAmount).toBe(0);
    expect(result.find((r) => r.accountId === "b")?.allocatedAmount).toBe(1000);
    expect(result.find((r) => r.accountId === "c")?.allocatedAmount).toBe(0);
  });

  it("distributes proportionally by gap when multiple accounts are below target", () => {
    // A: balance=300, target=60% → current share=30%, gap=30%
    // B: balance=200, target=40% → current share=20%, gap=20%
    // Total positive gap = 50%. A gets 30/50=60%, B gets 20/50=40%
    // With totalAmount=500: A=300, B=200
    const result = distributeInvestmentAllocation(
      [
        { accountId: "a", currentBalance: 300, targetPercent: 60 },
        { accountId: "b", currentBalance: 200, targetPercent: 40 },
      ],
      500,
    );
    expect(
      result.find((r) => r.accountId === "a")?.allocatedAmount,
    ).toBeCloseTo(300, 5);
    expect(
      result.find((r) => r.accountId === "b")?.allocatedAmount,
    ).toBeCloseTo(200, 5);
  });

  it("gives zero to an above-target account even when others are below target", () => {
    // A: balance=700, target=50% → current share=70%, gap=-20% (above target)
    // B: balance=300, target=50% → current share=30%, gap=20%
    // Only B gets funds
    const result = distributeInvestmentAllocation(
      [
        { accountId: "a", currentBalance: 700, targetPercent: 50 },
        { accountId: "b", currentBalance: 300, targetPercent: 50 },
      ],
      400,
    );
    expect(result.find((r) => r.accountId === "a")?.allocatedAmount).toBe(0);
    expect(result.find((r) => r.accountId === "b")?.allocatedAmount).toBe(400);
  });
});

describe("distributeInvestmentAllocation — fallback to target percent", () => {
  it("distributes by target percent when all accounts are at target", () => {
    // A: balance=600, target=60% → gap=0
    // B: balance=400, target=40% → gap=0
    // No positive gaps → distribute by target percent: A=60%, B=40%
    const result = distributeInvestmentAllocation(
      [
        { accountId: "a", currentBalance: 600, targetPercent: 60 },
        { accountId: "b", currentBalance: 400, targetPercent: 40 },
      ],
      1000,
    );
    expect(
      result.find((r) => r.accountId === "a")?.allocatedAmount,
    ).toBeCloseTo(600, 5);
    expect(
      result.find((r) => r.accountId === "b")?.allocatedAmount,
    ).toBeCloseTo(400, 5);
  });

  it("distributes by target percent when all balances are zero (fresh start)", () => {
    // All current balances = 0 → current shares = 0 → gaps = targetPercent/100 for all
    // Positive gaps exist → distribute by gap weight = distribute by target percent
    const result = distributeInvestmentAllocation(
      [
        { accountId: "a", currentBalance: 0, targetPercent: 70 },
        { accountId: "b", currentBalance: 0, targetPercent: 30 },
      ],
      1000,
    );
    expect(
      result.find((r) => r.accountId === "a")?.allocatedAmount,
    ).toBeCloseTo(700, 5);
    expect(
      result.find((r) => r.accountId === "b")?.allocatedAmount,
    ).toBeCloseTo(300, 5);
  });
});

describe("distributeInvestmentAllocation — output shape", () => {
  it("returns one result per input account with matching accountId", () => {
    const accounts = [
      { accountId: "alpha", currentBalance: 500, targetPercent: 50 },
      { accountId: "beta", currentBalance: 500, targetPercent: 50 },
    ];
    const result = distributeInvestmentAllocation(accounts, 200);
    expect(result).toHaveLength(2);
    const ids = result.map((r) => r.accountId).sort();
    expect(ids).toEqual(["alpha", "beta"]);
  });

  it("allocations sum to the total amount", () => {
    const result = distributeInvestmentAllocation(
      [
        { accountId: "a", currentBalance: 400, targetPercent: 60 },
        { accountId: "b", currentBalance: 600, targetPercent: 40 },
      ],
      750,
    );
    const total = result.reduce((sum, r) => sum + r.allocatedAmount, 0);
    expect(total).toBeCloseTo(750, 5);
  });
});
