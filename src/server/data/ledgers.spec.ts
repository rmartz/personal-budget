import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/admin", () => ({
  getAdminDatabase: vi.fn(),
}));

import { getAdminDatabase } from "@/lib/firebase/admin";

import {
  createLedger,
  deleteLedger,
  getLedger,
  listLedgers,
  updateLedger,
} from "./ledgers";

const child = vi.fn();
const get = vi.fn();
const set = vi.fn();
const update = vi.fn();
const push = vi.fn();
const pushedSet = vi.fn();
const ref = vi.fn();

const refObject = { child, get, set, update, push };

beforeEach(() => {
  child.mockReturnValue(refObject);
  ref.mockReturnValue(refObject);
  push.mockReturnValue({ key: "generated-id", set: pushedSet });
  vi.mocked(getAdminDatabase).mockReturnValue({ ref } as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("listLedgers", () => {
  it("scopes the query to the caller's user subtree", async () => {
    get.mockResolvedValue({ exists: () => false });
    await listLedgers("uid-1");
    expect(ref).toHaveBeenCalledWith("users/uid-1");
    expect(child).toHaveBeenCalledWith("budgetLedgers");
  });

  it("returns an empty array when the user has no ledgers", async () => {
    get.mockResolvedValue({ exists: () => false });
    expect(await listLedgers("uid-1")).toEqual([]);
  });

  it("maps stored ledgers to domain ledgers", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({ "ledger-a": { name: "Groceries", cashCap: 300 } }),
    });
    expect(await listLedgers("uid-1")).toEqual([
      { id: "ledger-a", name: "Groceries", cashCap: 300 },
    ]);
  });

  it("skips malformed records without failing the entire list", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        "ledger-good": { name: "Groceries", cashCap: 300 },
        "ledger-bad": { invalid: true },
      }),
    });
    expect(await listLedgers("uid-1")).toEqual([
      { id: "ledger-good", name: "Groceries", cashCap: 300 },
    ]);
  });
});

describe("getLedger", () => {
  it("returns undefined when the ledger does not exist", async () => {
    get.mockResolvedValue({ exists: () => false });
    expect(await getLedger("uid-1", "missing")).toBeUndefined();
  });

  it("maps the stored ledger when it exists", async () => {
    get.mockResolvedValue({
      exists: () => true,
      val: () => ({ name: "Rent", cashCap: null }),
    });
    expect(await getLedger("uid-1", "ledger-a")).toEqual({
      id: "ledger-a",
      name: "Rent",
      cashCap: undefined,
    });
  });
});

describe("createLedger", () => {
  it("writes the converted ledger under the user's subtree", async () => {
    await createLedger("uid-1", { name: "Rent", cashCap: 100 });
    expect(ref).toHaveBeenCalledWith("users/uid-1");
    expect(pushedSet).toHaveBeenCalledWith({ name: "Rent", cashCap: 100 });
  });

  it("returns the created ledger with the generated id", async () => {
    const result = await createLedger("uid-1", { name: "Rent" });
    expect(result).toEqual({
      id: "generated-id",
      name: "Rent",
      cashCap: undefined,
    });
  });
});

describe("updateLedger", () => {
  it("writes only the provided fields, clearing cash cap with null", async () => {
    await updateLedger("uid-1", "ledger-a", { name: "New", cashCap: null });
    expect(child).toHaveBeenCalledWith("budgetLedgers/ledger-a");
    expect(update).toHaveBeenCalledWith({ name: "New", cashCap: null });
  });
});

describe("deleteLedger", () => {
  it("fans out the delete across the ledger's related paths", async () => {
    await deleteLedger("uid-1", "ledger-a");
    expect(update).toHaveBeenCalledWith({
      "budgetLedgers/ledger-a": null,
      "budgetLedgerTransactions/ledger-a": null,
      "budgetLedgerSavingsGoals/ledger-a": null,
    });
  });
});
