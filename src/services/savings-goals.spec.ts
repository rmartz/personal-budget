import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

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
  getDatabase,
  ref,
  get,
  set,
  update,
  push,
  remove,
} from "firebase/database";
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "./savings-goals";

const mockDb = { type: "mock-db" };
const mockRef = { type: "mock-ref" };

beforeEach(() => {
  vi.mocked(getDatabase).mockReturnValue(mockDb as never);
  vi.mocked(ref).mockReturnValue(mockRef as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getSavingsGoals", () => {
  it("returns an empty array when no data exists", async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false } as never);
    const result = await getSavingsGoals("uid-1", "ledger-1");
    expect(result).toEqual([]);
  });

  it("returns mapped goals when data exists", async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        "goal-1": {
          name: "Emergency Fund",
          targetAmount: 5000,
          fundedAmount: 1000,
          priority: 1,
        },
      }),
    } as never);
    const result = await getSavingsGoals("uid-1", "ledger-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "goal-1",
      ledgerId: "ledger-1",
      name: "Emergency Fund",
      targetAmount: 5000,
      fundedAmount: 1000,
      priority: 1,
    });
  });
});

describe("createSavingsGoal", () => {
  it("pushes to firebase and returns the new goal", async () => {
    const newRef = { key: "goal-new", type: "new-ref" };
    vi.mocked(push).mockReturnValue(newRef as never);
    vi.mocked(set).mockResolvedValue(undefined);

    const result = await createSavingsGoal("uid-1", "ledger-1", {
      name: "Vacation",
      targetAmount: 2000,
      fundedAmount: 0,
      priority: 2,
    });

    expect(push).toHaveBeenCalledWith(mockRef);
    expect(set).toHaveBeenCalled();
    expect(result.id).toBe("goal-new");
    expect(result.name).toBe("Vacation");
  });

  it("throws when the new ref has no key", async () => {
    vi.mocked(push).mockReturnValue({ key: null } as never);
    await expect(
      createSavingsGoal("uid-1", "ledger-1", {
        name: "Vacation",
        targetAmount: 2000,
        fundedAmount: 0,
        priority: 2,
      }),
    ).rejects.toThrow("Failed to generate savings goal key");
  });
});

describe("updateSavingsGoal", () => {
  it("calls update with the partial fields", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateSavingsGoal("uid-1", "ledger-1", "goal-1", {
      fundedAmount: 500,
    });
    expect(update).toHaveBeenCalledWith(mockRef, { fundedAmount: 500 });
  });
});

describe("deleteSavingsGoal", () => {
  it("calls remove on the goal ref", async () => {
    vi.mocked(remove).mockResolvedValue(undefined);
    await deleteSavingsGoal("uid-1", "ledger-1", "goal-1");
    expect(remove).toHaveBeenCalledWith(mockRef);
  });
});
