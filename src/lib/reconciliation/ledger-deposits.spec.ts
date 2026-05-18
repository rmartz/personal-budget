import { describe, expect, it } from "vitest";

import { calculateLedgerDeposits } from "./ledger-deposits";

describe("calculateLedgerDeposits — single ledger", () => {
  it("deposits up to the cap deficit when unallocated cash covers it fully", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [{ cashBalance: 200, cashCap: 1000, id: "ledger-1" }],
      unallocatedCash: 2000,
    });
    expect(deposits).toEqual([{ amount: 800, ledgerId: "ledger-1" }]);
  });

  it("deposits only the available cash when less than the cap deficit", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [{ cashBalance: 200, cashCap: 1000, id: "ledger-1" }],
      unallocatedCash: 300,
    });
    expect(deposits).toEqual([{ amount: 300, ledgerId: "ledger-1" }]);
  });

  it("excludes a ledger already at its cap", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [{ cashBalance: 1000, cashCap: 1000, id: "ledger-1" }],
      unallocatedCash: 500,
    });
    expect(deposits).toEqual([]);
  });

  it("excludes a ledger whose balance exceeds its cap", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [{ cashBalance: 1200, cashCap: 1000, id: "ledger-1" }],
      unallocatedCash: 500,
    });
    expect(deposits).toEqual([]);
  });

  it("excludes a ledger without a cashCap", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [{ cashBalance: 0, cashCap: undefined, id: "ledger-1" }],
      unallocatedCash: 500,
    });
    expect(deposits).toEqual([]);
  });
});

describe("calculateLedgerDeposits — multiple ledgers", () => {
  it("fills ledgers in order until cash is exhausted", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [
        { cashBalance: 0, cashCap: 500, id: "ledger-1" },
        { cashBalance: 0, cashCap: 500, id: "ledger-2" },
        { cashBalance: 0, cashCap: 500, id: "ledger-3" },
      ],
      unallocatedCash: 900,
    });
    expect(deposits).toEqual([
      { amount: 500, ledgerId: "ledger-1" },
      { amount: 400, ledgerId: "ledger-2" },
    ]);
  });

  it("skips capped ledgers while continuing to fill others", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [
        { cashBalance: 500, cashCap: 500, id: "ledger-full" },
        { cashBalance: 0, cashCap: 400, id: "ledger-empty" },
      ],
      unallocatedCash: 1000,
    });
    expect(deposits).toEqual([{ amount: 400, ledgerId: "ledger-empty" }]);
  });

  it("skips cap-less ledgers while continuing to fill capped ones", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [
        { cashBalance: 0, cashCap: undefined, id: "ledger-no-cap" },
        { cashBalance: 0, cashCap: 300, id: "ledger-capped" },
      ],
      unallocatedCash: 1000,
    });
    expect(deposits).toEqual([{ amount: 300, ledgerId: "ledger-capped" }]);
  });
});

describe("calculateLedgerDeposits — edge cases", () => {
  it("returns an empty array when unallocatedCash is zero", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [{ cashBalance: 0, cashCap: 500, id: "ledger-1" }],
      unallocatedCash: 0,
    });
    expect(deposits).toEqual([]);
  });

  it("returns an empty array when there are no ledgers", () => {
    const deposits = calculateLedgerDeposits({
      ledgers: [],
      unallocatedCash: 1000,
    });
    expect(deposits).toEqual([]);
  });
});
