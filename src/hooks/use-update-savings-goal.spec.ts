import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useUpdateSavingsGoal } from "./use-update-savings-goal";

const mockUpdateSavingsGoal = vi.fn();
const mockGetSavingsGoals = vi.fn();

vi.mock("@/services/savings-goals", () => ({
  updateSavingsGoal: (...args: unknown[]): Promise<void> =>
    mockUpdateSavingsGoal(...args) as Promise<void>,
  getSavingsGoals: (...args: unknown[]): Promise<unknown> =>
    mockGetSavingsGoals(...args) as Promise<unknown>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useUpdateSavingsGoal", () => {
  describe("editGoal", () => {
    it("calls updateSavingsGoal with the provided id and data", async () => {
      mockUpdateSavingsGoal.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useUpdateSavingsGoal("uid-1", "ledger-1"),
      );

      await act(async () => {
        await result.current.editGoal("goal-1", {
          name: "Vacation Fund",
          targetAmount: 3000,
        });
      });

      expect(mockUpdateSavingsGoal).toHaveBeenCalledWith(
        "uid-1",
        "ledger-1",
        "goal-1",
        {
          name: "Vacation Fund",
          targetAmount: 3000,
        },
      );
    });

    it("sets isSubmitting to true during submission and false after", async () => {
      let resolve!: () => void;
      mockUpdateSavingsGoal.mockReturnValue(
        new Promise<void>((r) => {
          resolve = r;
        }),
      );

      const { result } = renderHook(() =>
        useUpdateSavingsGoal("uid-1", "ledger-1"),
      );

      let editPromise!: Promise<void>;
      act(() => {
        editPromise = result.current.editGoal("goal-1", {
          name: "Test",
          targetAmount: 1000,
        });
      });

      expect(result.current.isSubmitting).toBe(true);

      await act(async () => {
        resolve();
        await editPromise;
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it("throws and resets isSubmitting when uid is empty", async () => {
      const { result } = renderHook(() => useUpdateSavingsGoal("", "ledger-1"));

      await expect(
        act(async () => {
          await result.current.editGoal("goal-1", {
            name: "X",
            targetAmount: 1,
          });
        }),
      ).rejects.toThrow("Cannot update goal: missing uid or ledgerId");

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("reorderGoal", () => {
    it("fetches goals then swaps priorities for both goals", async () => {
      mockGetSavingsGoals.mockResolvedValue([
        {
          id: "goal-a",
          ledgerId: "ledger-1",
          name: "A",
          targetAmount: 1000,
          fundedAmount: 0,
          priority: 1,
        },
        {
          id: "goal-b",
          ledgerId: "ledger-1",
          name: "B",
          targetAmount: 2000,
          fundedAmount: 0,
          priority: 2,
        },
      ]);
      mockUpdateSavingsGoal.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useUpdateSavingsGoal("uid-1", "ledger-1"),
      );

      await act(async () => {
        await result.current.reorderGoal("goal-b", "goal-a");
      });

      expect(mockGetSavingsGoals).toHaveBeenCalledWith("uid-1", "ledger-1");
      expect(mockUpdateSavingsGoal).toHaveBeenCalledWith(
        "uid-1",
        "ledger-1",
        "goal-b",
        { priority: 1 },
      );
      expect(mockUpdateSavingsGoal).toHaveBeenCalledWith(
        "uid-1",
        "ledger-1",
        "goal-a",
        { priority: 2 },
      );
    });

    it("throws when a goal is not found", async () => {
      mockGetSavingsGoals.mockResolvedValue([
        {
          id: "goal-a",
          ledgerId: "ledger-1",
          name: "A",
          targetAmount: 1000,
          fundedAmount: 0,
          priority: 1,
        },
      ]);

      const { result } = renderHook(() =>
        useUpdateSavingsGoal("uid-1", "ledger-1"),
      );

      await expect(
        act(async () => {
          await result.current.reorderGoal("goal-a", "goal-missing");
        }),
      ).rejects.toThrow("Cannot reorder goal: one or both goals not found");
    });

    it("throws and resets isSubmitting when ledgerId is empty", async () => {
      const { result } = renderHook(() => useUpdateSavingsGoal("uid-1", ""));

      await expect(
        act(async () => {
          await result.current.reorderGoal("goal-a", "goal-b");
        }),
      ).rejects.toThrow("Cannot reorder goal: missing uid or ledgerId");

      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
