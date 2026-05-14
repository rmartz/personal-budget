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

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

import {
  createReconciliationAccount,
  deleteReconciliationAccount,
  getReconciliationAccounts,
  updateReconciliationAccount,
} from "./reconciliation-accounts";

const mockDb = { type: "mock-db" };
const mockRef = { type: "mock-ref" };

beforeEach(() => {
  vi.mocked(getDatabase).mockReturnValue(mockDb as never);
  vi.mocked(ref).mockReturnValue(mockRef as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getReconciliationAccounts", () => {
  it("returns an empty array when no data exists", async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false } as never);
    const result = await getReconciliationAccounts("uid-1");
    expect(result).toEqual([]);
  });

  it("returns mapped accounts when data exists", async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        "account-1": {
          name: "Chase Checking",
          tier: ReconciliationAccountTier.ShortTerm,
          targetFloat: 2000,
        },
      }),
    } as never);

    const result = await getReconciliationAccounts("uid-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "account-1",
      name: "Chase Checking",
      tier: ReconciliationAccountTier.ShortTerm,
      targetFloat: 2000,
    });
  });
});

describe("createReconciliationAccount", () => {
  it("pushes to firebase and returns the new account", async () => {
    const newRef = { key: "account-new", type: "new-ref" };
    vi.mocked(push).mockReturnValue(newRef as never);
    vi.mocked(set).mockResolvedValue(undefined);

    const result = await createReconciliationAccount("uid-1", {
      name: "Savings",
      tier: ReconciliationAccountTier.Reserve,
      targetFloat: 5000,
    });

    expect(push).toHaveBeenCalledWith(mockRef);
    expect(result.id).toBe("account-new");
    expect(result.name).toBe("Savings");
  });

  it("throws when the new ref has no key", async () => {
    vi.mocked(push).mockReturnValue({ key: null } as never);
    await expect(
      createReconciliationAccount("uid-1", {
        name: "Savings",
        tier: ReconciliationAccountTier.Reserve,
        targetFloat: 5000,
      }),
    ).rejects.toThrow("Failed to generate reconciliation account key");
  });
});

describe("updateReconciliationAccount", () => {
  it("calls update with the partial fields", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateReconciliationAccount("uid-1", "account-1", {
      targetFloat: 3000,
    });
    expect(update).toHaveBeenCalledWith(mockRef, { targetFloat: 3000 });
  });
});

describe("deleteReconciliationAccount", () => {
  it("calls remove on the account ref", async () => {
    vi.mocked(remove).mockResolvedValue(undefined);
    await deleteReconciliationAccount("uid-1", "account-1");
    expect(remove).toHaveBeenCalledWith(mockRef);
  });
});
