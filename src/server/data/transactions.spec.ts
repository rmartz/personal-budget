import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/admin", () => ({
  getAdminDatabase: vi.fn(),
}));

import { getAdminDatabase } from "@/lib/firebase/admin";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

import { getTransaction, listTransactions } from "./transactions";

const child = vi.fn();
const get = vi.fn();
const ref = vi.fn();

const refObject = { child, get };

beforeEach(() => {
  child.mockReturnValue(refObject);
  ref.mockReturnValue(refObject);
  vi.mocked(getAdminDatabase).mockReturnValue({ ref } as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("listTransactions", () => {
  it("scopes the query to the caller's ledger subtree", async () => {
    get.mockResolvedValue({ exists: () => false });
    await listTransactions("uid-1", "ledger-a");
    expect(ref).toHaveBeenCalledWith(
      "users/uid-1/budgetLedgerTransactions/ledger-a",
    );
  });

  it("returns an empty array when the ledger has no transactions", async () => {
    get.mockResolvedValue({ exists: () => false });
    expect(await listTransactions("uid-1", "ledger-a")).toEqual([]);
  });

  it("maps stored transactions to domain transactions", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        "tx-a": {
          type: BudgetLedgerTransactionType.Deposit,
          date: "2026-01-15T00:00:00.000Z",
          amount: 250,
          description: "Paycheck",
        },
      }),
    });
    expect(await listTransactions("uid-1", "ledger-a")).toEqual([
      {
        id: "tx-a",
        ledgerId: "ledger-a",
        type: BudgetLedgerTransactionType.Deposit,
        date: new Date("2026-01-15T00:00:00.000Z"),
        amount: 250,
        description: "Paycheck",
      },
    ]);
  });

  it("skips malformed records without failing the entire list", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        "tx-good": {
          type: BudgetLedgerTransactionType.Expense,
          date: "2026-01-16T00:00:00.000Z",
          amount: 40,
          description: "Groceries",
        },
        "tx-bad": { invalid: true },
      }),
    });
    const result = await listTransactions("uid-1", "ledger-a");
    expect(result.map((tx) => tx.id)).toEqual(["tx-good"]);
  });
});

describe("getTransaction", () => {
  it("returns undefined when the transaction does not exist", async () => {
    get.mockResolvedValue({ exists: () => false });
    expect(
      await getTransaction("uid-1", "ledger-a", "missing"),
    ).toBeUndefined();
    expect(child).toHaveBeenCalledWith("missing");
  });

  it("maps the stored transaction when it exists", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        type: BudgetLedgerTransactionType.Expense,
        date: "2026-02-01T00:00:00.000Z",
        amount: 12.5,
        description: "Coffee",
      }),
    });
    expect(await getTransaction("uid-1", "ledger-a", "tx-a")).toEqual({
      id: "tx-a",
      ledgerId: "ledger-a",
      type: BudgetLedgerTransactionType.Expense,
      date: new Date("2026-02-01T00:00:00.000Z"),
      amount: 12.5,
      description: "Coffee",
    });
  });
});
