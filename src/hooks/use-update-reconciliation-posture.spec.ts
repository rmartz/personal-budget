import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Posture } from "@/lib/firebase/schema/investments";

import { useUpdateReconciliationPosture } from "./use-update-reconciliation-posture";

const mockUpdateUserSettings = vi.fn();

vi.mock("@/services/user-settings", () => ({
  updateUserSettings: (...args: unknown[]): Promise<void> =>
    mockUpdateUserSettings(...args) as Promise<void>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useUpdateReconciliationPosture", () => {
  describe("setPosture", () => {
    it("calls updateUserSettings with the provided posture", async () => {
      mockUpdateUserSettings.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useUpdateReconciliationPosture("uid-1"),
      );

      await act(async () => {
        await result.current.setPosture(Posture.Conservative);
      });

      expect(mockUpdateUserSettings).toHaveBeenCalledWith("uid-1", {
        reconciliationPosture: Posture.Conservative,
      });
    });

    it("sets isSubmitting to true during update and false after", async () => {
      let resolve!: () => void;
      mockUpdateUserSettings.mockReturnValue(
        new Promise<void>((r) => {
          resolve = r;
        }),
      );

      const { result } = renderHook(() =>
        useUpdateReconciliationPosture("uid-1"),
      );

      let setPosturePromise!: Promise<void>;
      act(() => {
        setPosturePromise = result.current.setPosture(Posture.Aggressive);
      });

      expect(result.current.isSubmitting).toBe(true);

      await act(async () => {
        resolve();
        await setPosturePromise;
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it("throws an error when uid is empty", async () => {
      const { result } = renderHook(() => useUpdateReconciliationPosture(""));

      await expect(
        act(async () => {
          await result.current.setPosture(Posture.Balanced);
        }),
      ).rejects.toThrow("Cannot update posture: user is not authenticated");

      expect(mockUpdateUserSettings).not.toHaveBeenCalled();
    });
  });
});
