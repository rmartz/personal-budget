import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("firebase/database", () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  push: vi.fn(),
  remove: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@/lib/firebase/client", () => ({
  getClientApp: vi.fn(() => ({ name: "mock-app" })),
}));

import {
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "./transactions";

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

describe("updateTransaction", () => {
  it("calls update on the transaction ref with the partial payload", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    const date = new Date("2024-03-01T00:00:00.000Z");
    await updateTransaction("uid-1", "ledger-1", "tx-1", {
      date,
      amount: 250,
      description: "Updated coffee",
    });
    expect(ref).toHaveBeenCalledWith(
      mockDb,
      "users/uid-1/budgetLedgerTransactions/ledger-1/tx-1",
    );
    expect(update).toHaveBeenCalledWith(mockRef, {
      date: "2024-03-01T00:00:00.000Z",
      amount: 250,
      description: "Updated coffee",
    });
  });

  it("does not include a type field in the update payload", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateTransaction("uid-1", "ledger-1", "tx-1", {
      date: new Date("2024-03-01T00:00:00.000Z"),
      amount: 250,
      description: "Updated coffee",
    });
    const payload = vi.mocked(update).mock.calls[0]![1] as Record<
      string,
      unknown
    >;
    expect(Object.keys(payload).sort()).toEqual([
      "amount",
      "date",
      "description",
    ]);
    expect(payload["type"]).toBeUndefined();
  });
});
