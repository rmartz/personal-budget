import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("firebase/database", () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  push: vi.fn(),
  remove: vi.fn(),
}));

vi.mock("@/lib/firebase/client", () => ({
  getClientApp: vi.fn(() => ({ name: "mock-app" })),
}));

import { getDatabase, ref, get, set, push, remove } from "firebase/database";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "./transactions";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

const mockDb = { type: "mock-db" };
const mockRef = { type: "mock-ref" };

beforeEach(() => {
  vi.mocked(getDatabase).mockReturnValue(mockDb as never);
  vi.mocked(ref).mockReturnValue(mockRef as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getTransactions", () => {
  it("returns an empty array when no data exists", async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false } as never);
    const result = await getTransactions("uid-1", "ledger-1");
    expect(result).toEqual([]);
  });

  it("returns mapped transactions when data exists", async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        "tx-1": {
          type: BudgetLedgerTransactionType.Expense,
          date: "2024-03-01T00:00:00.000Z",
          amount: 50,
          description: "Coffee",
        },
      }),
    } as never);

    const result = await getTransactions("uid-1", "ledger-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "tx-1",
      ledgerId: "ledger-1",
      type: BudgetLedgerTransactionType.Expense,
      amount: 50,
      description: "Coffee",
    });
    expect(result[0]!.date).toBeInstanceOf(Date);
  });
});

describe("createTransaction", () => {
  it("pushes to firebase and returns the new transaction", async () => {
    const newRef = { key: "tx-new", type: "new-ref" };
    vi.mocked(push).mockReturnValue(newRef as never);
    vi.mocked(set).mockResolvedValue(undefined);

    const date = new Date("2024-03-01T00:00:00.000Z");
    const result = await createTransaction("uid-1", "ledger-1", {
      type: BudgetLedgerTransactionType.Deposit,
      date,
      amount: 1000,
      description: "Paycheck",
    });

    expect(push).toHaveBeenCalledWith(mockRef);
    expect(result.id).toBe("tx-new");
    expect(result.amount).toBe(1000);
  });

  it("throws when the new ref has no key", async () => {
    vi.mocked(push).mockReturnValue({ key: null } as never);
    await expect(
      createTransaction("uid-1", "ledger-1", {
        type: BudgetLedgerTransactionType.Deposit,
        date: new Date(),
        amount: 100,
        description: "Test",
      }),
    ).rejects.toThrow("Failed to generate transaction key");
  });
});

describe("deleteTransaction", () => {
  it("calls remove on the transaction ref", async () => {
    vi.mocked(remove).mockResolvedValue(undefined);
    await deleteTransaction("uid-1", "ledger-1", "tx-1");
    expect(remove).toHaveBeenCalledWith(mockRef);
  });
});
