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
  getAnnuities,
  createAnnuity,
  updateAnnuity,
  deleteAnnuity,
} from "./annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

const mockDb = { type: "mock-db" };
const mockRef = { type: "mock-ref" };

beforeEach(() => {
  vi.mocked(getDatabase).mockReturnValue(mockDb as never);
  vi.mocked(ref).mockReturnValue(mockRef as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getAnnuities", () => {
  it("returns an empty array when no data exists", async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false } as never);
    const result = await getAnnuities("uid-1");
    expect(result).toEqual([]);
  });

  it("returns mapped annuities when data exists", async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        "annuity-1": {
          name: "Netflix",
          monthlyAmount: 15,
          startDate: "2024-01-01T00:00:00.000Z",
          durationMonths: null,
        },
      }),
    } as never);

    const result = await getAnnuities("uid-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "annuity-1",
      name: "Netflix",
      monthlyAmount: 15,
      durationMonths: undefined,
    });
    expect(result[0]!.startDate).toBeInstanceOf(Date);
  });
});

describe("createAnnuity", () => {
  it("pushes to firebase and returns the new annuity", async () => {
    const newRef = { key: "annuity-new", type: "new-ref" };
    vi.mocked(push).mockReturnValue(newRef as never);
    vi.mocked(set).mockResolvedValue(undefined);

    const result = await createAnnuity("uid-1", {
      name: "Spotify",
      monthlyAmount: 10,
      startDate: new Date("2024-01-01T00:00:00.000Z"),
      durationMonths: undefined,
      monthlyMode: AnnuityMonthlyMode.Flat,
    });

    expect(push).toHaveBeenCalledWith(mockRef);
    expect(result.id).toBe("annuity-new");
    expect(result.name).toBe("Spotify");
  });

  it("throws when the new ref has no key", async () => {
    vi.mocked(push).mockReturnValue({ key: null } as never);
    await expect(
      createAnnuity("uid-1", {
        name: "Gym",
        monthlyAmount: 50,
        startDate: new Date(),
        durationMonths: 12,
        monthlyMode: AnnuityMonthlyMode.Flat,
      }),
    ).rejects.toThrow("Failed to generate annuity key");
  });
});

describe("updateAnnuity", () => {
  it("calls update with the partial fields", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateAnnuity("uid-1", "annuity-1", { monthlyAmount: 20 });
    expect(update).toHaveBeenCalledWith(mockRef, { monthlyAmount: 20 });
  });

  it("serializes the startDate to ISO string when provided", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    const date = new Date("2025-01-01T00:00:00.000Z");
    await updateAnnuity("uid-1", "annuity-1", { startDate: date });
    expect(update).toHaveBeenCalledWith(mockRef, {
      startDate: "2025-01-01T00:00:00.000Z",
    });
  });

  it("writes null to durationMonths when clearing the field", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateAnnuity("uid-1", "annuity-1", { durationMonths: undefined });
    expect(update).toHaveBeenCalledWith(mockRef, { durationMonths: null });
  });

  it("omits durationMonths from the update when the key is absent", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateAnnuity("uid-1", "annuity-1", { monthlyAmount: 20 });
    const calledWith = vi.mocked(update).mock.calls[0]![1] as Record<
      string,
      unknown
    >;
    expect("durationMonths" in calledWith).toBe(false);
  });

  it("serializes monthlyMode when provided", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateAnnuity("uid-1", "annuity-1", {
      monthlyMode: AnnuityMonthlyMode.PVDerived,
    });
    expect(update).toHaveBeenCalledWith(mockRef, {
      monthlyMode: AnnuityMonthlyMode.PVDerived,
    });
  });

  it("omits monthlyMode from the update when not provided", async () => {
    vi.mocked(update).mockResolvedValue(undefined);
    await updateAnnuity("uid-1", "annuity-1", { monthlyAmount: 20 });
    const calledWith = vi.mocked(update).mock.calls[0]![1] as Record<
      string,
      unknown
    >;
    expect("monthlyMode" in calledWith).toBe(false);
  });
});

describe("deleteAnnuity", () => {
  it("calls remove on the annuity ref", async () => {
    vi.mocked(remove).mockResolvedValue(undefined);
    await deleteAnnuity("uid-1", "annuity-1");
    expect(remove).toHaveBeenCalledWith(mockRef);
  });
});
