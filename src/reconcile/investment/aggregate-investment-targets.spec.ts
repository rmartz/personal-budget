import { describe, expect, it } from "vitest";

import { aggregateMonthlyInvestmentTargets } from "./aggregate-investment-targets";

describe("aggregateMonthlyInvestmentTargets — no targets", () => {
  it("returns an empty array when there are no ledger targets", () => {
    const result = aggregateMonthlyInvestmentTargets([]);
    expect(result).toEqual([]);
  });
});

describe("aggregateMonthlyInvestmentTargets — single account", () => {
  it("returns a single transaction for a single ledger target", () => {
    const result = aggregateMonthlyInvestmentTargets([
      { accountId: "acct-1", netInvestmentTarget: 400 },
    ]);
    expect(result).toEqual([
      { accountId: "acct-1", netTransactionAmount: 400 },
    ]);
  });

  it("sums multiple ledger targets belonging to the same account", () => {
    const result = aggregateMonthlyInvestmentTargets([
      { accountId: "acct-1", netInvestmentTarget: 300 },
      { accountId: "acct-1", netInvestmentTarget: 200 },
    ]);
    expect(result).toEqual([
      { accountId: "acct-1", netTransactionAmount: 500 },
    ]);
  });

  it("produces a net result when targets include both positive and negative values", () => {
    // Buy signal +500, sell signal -150 → net buy of 350
    const result = aggregateMonthlyInvestmentTargets([
      { accountId: "acct-1", netInvestmentTarget: 500 },
      { accountId: "acct-1", netInvestmentTarget: -150 },
    ]);
    expect(result).toEqual([
      { accountId: "acct-1", netTransactionAmount: 350 },
    ]);
  });
});

describe("aggregateMonthlyInvestmentTargets — multiple accounts", () => {
  it("returns one transaction per account when ledgers map to different accounts", () => {
    const result = aggregateMonthlyInvestmentTargets([
      { accountId: "acct-1", netInvestmentTarget: 400 },
      { accountId: "acct-2", netInvestmentTarget: 250 },
    ]);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      accountId: "acct-1",
      netTransactionAmount: 400,
    });
    expect(result).toContainEqual({
      accountId: "acct-2",
      netTransactionAmount: 250,
    });
  });

  it("sums independently for each account when multiple ledgers share each account", () => {
    const result = aggregateMonthlyInvestmentTargets([
      { accountId: "acct-1", netInvestmentTarget: 300 },
      { accountId: "acct-2", netInvestmentTarget: 100 },
      { accountId: "acct-1", netInvestmentTarget: 200 },
    ]);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      accountId: "acct-1",
      netTransactionAmount: 500,
    });
    expect(result).toContainEqual({
      accountId: "acct-2",
      netTransactionAmount: 100,
    });
  });
});
