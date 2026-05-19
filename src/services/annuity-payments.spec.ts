import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

import { get, getDatabase, push, ref, remove, set } from "firebase/database";

import {
  createAnnuityPayment,
  deleteAnnuityPayment,
  getAnnuityPayments,
} from "./annuity-payments";

const mockDb = { type: "mock-db" };
const mockRef = { type: "mock-ref" };

beforeEach(() => {
  vi.mocked(getDatabase).mockReturnValue(mockDb as never);
  vi.mocked(ref).mockReturnValue(mockRef as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getAnnuityPayments", () => {
  it("returns an empty array when no data exists", async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false } as never);
    const result = await getAnnuityPayments("uid-1", "ann-1");
    expect(result).toEqual([]);
  });

  it("queries the correct firebase path", async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false } as never);
    await getAnnuityPayments("uid-1", "ann-1");
    expect(ref).toHaveBeenCalledWith(
      mockDb,
      "users/uid-1/annuityPayments/ann-1",
    );
  });

  it("returns mapped payments when data exists", async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        "pay-1": {
          amount: 250,
          date: "2024-03-01T00:00:00.000Z",
        },
      }),
    } as never);

    const result = await getAnnuityPayments("uid-1", "ann-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "pay-1",
      annuityId: "ann-1",
      amount: 250,
    });
    expect(result[0]!.date).toBeInstanceOf(Date);
  });
});

describe("createAnnuityPayment", () => {
  it("pushes to firebase and returns the new payment", async () => {
    const newRef = { key: "pay-new", type: "new-ref" };
    vi.mocked(push).mockReturnValue(newRef as never);
    vi.mocked(set).mockResolvedValue(undefined);

    const date = new Date("2024-03-01T00:00:00.000Z");
    const result = await createAnnuityPayment("uid-1", "ann-1", {
      amount: 300,
      date,
    });

    expect(push).toHaveBeenCalledWith(mockRef);
    expect(result.id).toBe("pay-new");
    expect(result.annuityId).toBe("ann-1");
    expect(result.amount).toBe(300);
  });

  it("queries the correct firebase path for the collection", async () => {
    const newRef = { key: "pay-new" };
    vi.mocked(push).mockReturnValue(newRef as never);
    vi.mocked(set).mockResolvedValue(undefined);

    await createAnnuityPayment("uid-1", "ann-1", {
      amount: 100,
      date: new Date(),
    });

    expect(ref).toHaveBeenCalledWith(
      mockDb,
      "users/uid-1/annuityPayments/ann-1",
    );
  });

  it("throws when the new ref has no key", async () => {
    vi.mocked(push).mockReturnValue({ key: null } as never);
    await expect(
      createAnnuityPayment("uid-1", "ann-1", {
        amount: 100,
        date: new Date(),
      }),
    ).rejects.toThrow("Failed to generate annuity payment key");
  });
});

describe("deleteAnnuityPayment", () => {
  it("calls remove on the correct ref", async () => {
    vi.mocked(remove).mockResolvedValue(undefined);
    await deleteAnnuityPayment("uid-1", "ann-1", "pay-1");
    expect(remove).toHaveBeenCalledWith(mockRef);
  });

  it("uses the correct firebase path for the payment", async () => {
    vi.mocked(remove).mockResolvedValue(undefined);
    await deleteAnnuityPayment("uid-1", "ann-1", "pay-1");
    expect(ref).toHaveBeenCalledWith(
      mockDb,
      "users/uid-1/annuityPayments/ann-1/pay-1",
    );
  });
});
