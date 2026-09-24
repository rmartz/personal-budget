import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/admin", () => ({
  getAdminDatabase: vi.fn(),
}));

import { getAdminDatabase } from "@/lib/firebase/admin";

import { getSavingsGoal, listSavingsGoals } from "./savings-goals";

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

describe("listSavingsGoals", () => {
  it("scopes the query to the caller's ledger subtree", async () => {
    get.mockResolvedValue({ exists: () => false });
    await listSavingsGoals("uid-1", "ledger-a");
    expect(ref).toHaveBeenCalledWith(
      "users/uid-1/budgetLedgerSavingsGoals/ledger-a",
    );
  });

  it("returns an empty array when the ledger has no savings goals", async () => {
    get.mockResolvedValue({ exists: () => false });
    expect(await listSavingsGoals("uid-1", "ledger-a")).toEqual([]);
  });

  it("maps stored savings goals to domain savings goals", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        "goal-a": {
          name: "New laptop",
          targetAmount: 2000,
          fundedAmount: 500,
          priority: 1,
        },
      }),
    });
    expect(await listSavingsGoals("uid-1", "ledger-a")).toEqual([
      {
        id: "goal-a",
        ledgerId: "ledger-a",
        name: "New laptop",
        targetAmount: 2000,
        fundedAmount: 500,
        priority: 1,
      },
    ]);
  });

  it("skips malformed records without failing the entire list", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        "goal-good": {
          name: "Vacation",
          targetAmount: 3000,
          fundedAmount: 100,
          priority: 2,
        },
        "goal-bad": { invalid: true },
      }),
    });
    const result = await listSavingsGoals("uid-1", "ledger-a");
    expect(result.map((goal) => goal.id)).toEqual(["goal-good"]);
  });
});

describe("getSavingsGoal", () => {
  it("returns undefined when the savings goal does not exist", async () => {
    get.mockResolvedValue({ exists: () => false });
    expect(
      await getSavingsGoal("uid-1", "ledger-a", "missing"),
    ).toBeUndefined();
    expect(child).toHaveBeenCalledWith("missing");
  });

  it("maps the stored savings goal when it exists", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        name: "Emergency buffer",
        targetAmount: 5000,
        fundedAmount: 1200,
        priority: 3,
      }),
    });
    expect(await getSavingsGoal("uid-1", "ledger-a", "goal-a")).toEqual({
      id: "goal-a",
      ledgerId: "ledger-a",
      name: "Emergency buffer",
      targetAmount: 5000,
      fundedAmount: 1200,
      priority: 3,
    });
  });
});
