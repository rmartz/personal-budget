import { describe, expect, it } from "vitest";

import { calculateInvestmentMargin } from "./investment-margin";

describe("calculateInvestmentMargin — empty inputs", () => {
  it("returns zero margin when both account snapshots and ledger portions are empty", () => {
    const result = calculateInvestmentMargin({
      accountSnapshots: [],
      ledgerInvestmentPortions: [],
    });
    expect(result.margin).toBe(0);
  });
});

describe("calculateInvestmentMargin — accounts only", () => {
  it("returns a positive margin equal to total account balances when there are no ledger portions", () => {
    const result = calculateInvestmentMargin({
      accountSnapshots: [
        { accountId: "acct-1", balance: 5000 },
        { accountId: "acct-2", balance: 3000 },
      ],
      ledgerInvestmentPortions: [],
    });
    expect(result.margin).toBe(8000);
  });
});

describe("calculateInvestmentMargin — ledger portions only", () => {
  it("returns a negative margin equal to total ledger portions when there are no account balances", () => {
    const result = calculateInvestmentMargin({
      accountSnapshots: [],
      ledgerInvestmentPortions: [
        { ledgerId: "ledger-1", investmentBalance: 2000 },
        { ledgerId: "ledger-2", investmentBalance: 1500 },
      ],
    });
    expect(result.margin).toBe(-3500);
  });
});

describe("calculateInvestmentMargin — mixed", () => {
  it("returns zero when total account balances exactly match total ledger portions", () => {
    const result = calculateInvestmentMargin({
      accountSnapshots: [{ accountId: "acct-1", balance: 4000 }],
      ledgerInvestmentPortions: [
        { ledgerId: "ledger-1", investmentBalance: 2500 },
        { ledgerId: "ledger-2", investmentBalance: 1500 },
      ],
    });
    expect(result.margin).toBe(0);
  });

  it("returns a positive margin when accounts exceed ledger portions", () => {
    const result = calculateInvestmentMargin({
      accountSnapshots: [{ accountId: "acct-1", balance: 6000 }],
      ledgerInvestmentPortions: [
        { ledgerId: "ledger-1", investmentBalance: 4000 },
      ],
    });
    expect(result.margin).toBe(2000);
  });

  it("returns a negative margin when ledger portions exceed account balances", () => {
    const result = calculateInvestmentMargin({
      accountSnapshots: [{ accountId: "acct-1", balance: 3000 }],
      ledgerInvestmentPortions: [
        { ledgerId: "ledger-1", investmentBalance: 5000 },
      ],
    });
    expect(result.margin).toBe(-2000);
  });
});
