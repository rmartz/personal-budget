import { describe, expect, it } from "vitest";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

import { calculateTierTransfers } from "./tier-transfers";

describe("calculateTierTransfers — short-term deficit", () => {
  it("draws from long-term when reserve is at target and long-term has surplus", () => {
    const transfers = calculateTierTransfers({
      currentBalances: {
        longTerm: 5000,
        reserve: 8000,
        shortTerm: 2000,
      },
      targets: { longTerm: 4000, reserve: 8000, shortTerm: 3000 },
    });
    expect(transfers).toEqual([
      {
        amount: 1000,
        from: ReconciliationAccountTier.LongTerm,
        to: ReconciliationAccountTier.ShortTerm,
      },
    ]);
  });

  it("draws from long-term when reserve cannot cover the short-term deficit", () => {
    const transfers = calculateTierTransfers({
      currentBalances: {
        longTerm: 5000,
        reserve: 500,
        shortTerm: 1000,
      },
      targets: { longTerm: 4000, reserve: 500, shortTerm: 3000 },
    });
    expect(transfers).toEqual([
      {
        amount: 2000,
        from: ReconciliationAccountTier.LongTerm,
        to: ReconciliationAccountTier.ShortTerm,
      },
    ]);
  });

  it("splits the short-term deficit across reserve and long-term when reserve is partially sufficient", () => {
    const transfers = calculateTierTransfers({
      currentBalances: {
        longTerm: 5000,
        reserve: 800,
        shortTerm: 1000,
      },
      targets: { longTerm: 4200, reserve: 800, shortTerm: 3000 },
    });
    expect(transfers).toHaveLength(1);
    expect(transfers[0]).toMatchObject({
      amount: 2000,
      from: ReconciliationAccountTier.LongTerm,
      to: ReconciliationAccountTier.ShortTerm,
    });
  });
});

describe("calculateTierTransfers — short-term surplus", () => {
  it("recommends moving surplus from short-term to reserve when reserve is underfunded", () => {
    const transfers = calculateTierTransfers({
      currentBalances: {
        longTerm: 4000,
        reserve: 6000,
        shortTerm: 5000,
      },
      targets: { longTerm: 2000, reserve: 8000, shortTerm: 3000 },
    });
    expect(transfers).toEqual([
      {
        amount: 2000,
        from: ReconciliationAccountTier.ShortTerm,
        to: ReconciliationAccountTier.Reserve,
      },
    ]);
  });

  it("moves short-term surplus to long-term when reserve is already at target", () => {
    const transfers = calculateTierTransfers({
      currentBalances: {
        longTerm: 4000,
        reserve: 8000,
        shortTerm: 5000,
      },
      targets: { longTerm: 6000, reserve: 8000, shortTerm: 3000 },
    });
    expect(transfers).toEqual([
      {
        amount: 2000,
        from: ReconciliationAccountTier.ShortTerm,
        to: ReconciliationAccountTier.LongTerm,
      },
    ]);
  });
});

describe("calculateTierTransfers — reserve deficit with short-term at target", () => {
  it("recommends moving from long-term to reserve", () => {
    const transfers = calculateTierTransfers({
      currentBalances: {
        longTerm: 7000,
        reserve: 5000,
        shortTerm: 3000,
      },
      targets: { longTerm: 5000, reserve: 7000, shortTerm: 3000 },
    });
    expect(transfers).toEqual([
      {
        amount: 2000,
        from: ReconciliationAccountTier.LongTerm,
        to: ReconciliationAccountTier.Reserve,
      },
    ]);
  });
});

describe("calculateTierTransfers — reserve surplus with short-term at target", () => {
  it("recommends moving surplus from reserve to long-term", () => {
    const transfers = calculateTierTransfers({
      currentBalances: {
        longTerm: 3000,
        reserve: 10000,
        shortTerm: 3000,
      },
      targets: { longTerm: 6000, reserve: 7000, shortTerm: 3000 },
    });
    expect(transfers).toEqual([
      {
        amount: 3000,
        from: ReconciliationAccountTier.Reserve,
        to: ReconciliationAccountTier.LongTerm,
      },
    ]);
  });
});

describe("calculateTierTransfers — all at target", () => {
  it("returns an empty list when all tiers are at their targets", () => {
    const transfers = calculateTierTransfers({
      currentBalances: {
        longTerm: 5000,
        reserve: 8000,
        shortTerm: 3000,
      },
      targets: { longTerm: 5000, reserve: 8000, shortTerm: 3000 },
    });
    expect(transfers).toEqual([]);
  });
});
