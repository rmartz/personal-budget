import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("firebase/database", () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
  push: vi.fn(),
  remove: vi.fn(),
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

import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import {
  createReconciliationExpense,
  deleteReconciliationExpense,
  getReconciliationExpenses,
  updateReconciliationExpense,
} from "./reconciliation-expenses";

const mockDb = { type: "mock-db" };
const mockRef = { type: "mock-ref" };

beforeEach(() => {
  vi.mocked(getDatabase).mockReturnValue(mockDb as never);
  vi.mocked(ref).mockReturnValue(mockRef as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getReconciliationExpenses", () => {
  it("returns an empty array when no data exists", async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false } as never);
    const result = await getReconciliationExpenses("uid-1");
    expect(result).toEqual([]);
  });

  it("returns mapped expenses when data exists", async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        "expense-1": {
          name: "Electric Bill",
          type: ReconciliationExpenseType.StatementBalance,
          typicalAmount: 120,
        },
      }),
    } as never);

    const result = await getReconciliationExpenses("uid-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "expense-1",
      name: "Electric Bill",
      type: ReconciliationExpenseType.StatementBalance,
      typicalAmount: 120,
    });
  });
});

describe("createReconciliationExpense", () => {
  it("pushes to firebase and returns the new expense", async () => {
    const newRef = { key: "expense-new", type: "new-ref" };
    vi.mocked(push).mockReturnValue(newRef as never);
    vi.mocked(set).mockResolvedValue(undefined);

    const result = await createReconciliationExpense("uid-1", {
      name: "Internet",
      type: ReconciliationExpenseType.RunningBalance,
      typicalAmount: 80,
    });

    expect(push).toHaveBeenCalledWith(mockRef);
    expect(result.id).toBe("expense-new");
    expect(result.name).toBe("Internet");
  });

  it("throws when the new ref has no key", async () => {
    vi.mocked(push).mockReturnValue({ key: null } as never);
    await expect(
      createReconciliationExpense("uid-1", {
        name: "Internet",
        type: ReconciliationExpenseType.RunningBalance,
        typicalAmount: 80,
      }),
    ).rejects.toThrow("Failed to generate reconciliation expense key");
  });
});

describe("updateReconciliationExpense", () => {
  it("calls update with the partial fields", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateReconciliationExpense("uid-1", "expense-1", {
      typicalAmount: 90,
    });
    expect(update).toHaveBeenCalledWith(mockRef, { typicalAmount: 90 });
  });
});

describe("deleteReconciliationExpense", () => {
  it("calls remove on the expense ref", async () => {
    vi.mocked(remove).mockResolvedValue(undefined);
    await deleteReconciliationExpense("uid-1", "expense-1");
    expect(remove).toHaveBeenCalledWith(mockRef);
  });
});
