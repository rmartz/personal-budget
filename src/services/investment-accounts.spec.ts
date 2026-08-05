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

import {
  createInvestmentAccount,
  deleteInvestmentAccount,
  getInvestmentAccounts,
  updateInvestmentAccount,
} from "./investment-accounts";

const mockDb = { type: "mock-db" };
const mockRef = { type: "mock-ref" };

beforeEach(() => {
  vi.mocked(getDatabase).mockReturnValue(mockDb as never);
  vi.mocked(ref).mockReturnValue(mockRef as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getInvestmentAccounts", () => {
  it("returns an empty array when no data exists", async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false } as never);
    const result = await getInvestmentAccounts("uid-1");
    expect(result).toEqual([]);
  });

  it("returns mapped investment accounts keyed by their id", async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        "acct-1": {
          name: "Vanguard Brokerage",
          currentPercent: 42,
          targetPercent: 60,
        },
      }),
    } as never);

    const result = await getInvestmentAccounts("uid-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "acct-1",
      name: "Vanguard Brokerage",
      currentPercent: 42,
      targetPercent: 60,
    });
  });
});

describe("createInvestmentAccount", () => {
  it("pushes to firebase and returns the new account", async () => {
    const newRef = { key: "acct-new", type: "new-ref" };
    vi.mocked(push).mockReturnValue(newRef as never);
    vi.mocked(set).mockResolvedValue(undefined);

    const result = await createInvestmentAccount("uid-1", {
      name: "Roth IRA",
      currentPercent: 10,
      targetPercent: 25,
    });

    expect(push).toHaveBeenCalledWith(mockRef);
    expect(set).toHaveBeenCalledWith(newRef, {
      name: "Roth IRA",
      currentPercent: 10,
      targetPercent: 25,
    });
    expect(result.id).toBe("acct-new");
    expect(result.name).toBe("Roth IRA");
  });

  it("throws when the new ref has no key", async () => {
    vi.mocked(push).mockReturnValue({ key: null } as never);
    await expect(
      createInvestmentAccount("uid-1", {
        name: "401k",
        currentPercent: 5,
        targetPercent: 15,
      }),
    ).rejects.toThrow("Failed to generate investment account key");
  });
});

describe("updateInvestmentAccount", () => {
  it("calls update with only the provided fields", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateInvestmentAccount("uid-1", "acct-1", { targetPercent: 55 });
    expect(update).toHaveBeenCalledWith(mockRef, { targetPercent: 55 });
  });

  it("omits fields that are not provided", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateInvestmentAccount("uid-1", "acct-1", { name: "Renamed" });
    const calledWith = vi.mocked(update).mock.calls[0]![1] as Record<
      string,
      unknown
    >;
    expect("currentPercent" in calledWith).toBe(false);
    expect("targetPercent" in calledWith).toBe(false);
  });
});

describe("deleteInvestmentAccount", () => {
  it("calls remove on the account ref", async () => {
    vi.mocked(remove).mockResolvedValue(undefined);
    await deleteInvestmentAccount("uid-1", "acct-1");
    expect(remove).toHaveBeenCalledWith(mockRef);
  });
});
