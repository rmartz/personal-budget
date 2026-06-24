import { describe, expect, it } from "vitest";

import { computeZipfShares } from "../goal-funding";
import { makeGoal } from "./fixtures";

describe("computeZipfShares", () => {
  describe("returns an empty Map when the goals list is empty", () => {
    it("returns an empty Map for an empty goals array", () => {
      expect(computeZipfShares([])).toEqual(new Map());
    });
  });

  describe("returns a share of 1.0 for a single goal", () => {
    it("single goal gets the full allocation", () => {
      const goal = makeGoal({ id: "g1", priority: 1 });
      const shares = computeZipfShares([goal]);
      expect(shares.get("g1")).toBe(1);
    });
  });

  describe("distributes shares proportionally to 1/priority", () => {
    it("priority-1 gets twice the share of priority-2", () => {
      // harmonic = 1/1 + 1/2 = 1.5; g1 share = 2/3, g2 share = 1/3
      const g1 = makeGoal({ id: "g1", priority: 1 });
      const g2 = makeGoal({ id: "g2", priority: 2 });
      const shares = computeZipfShares([g1, g2]);
      expect(shares.get("g1")).toBeCloseTo(2 / 3);
      expect(shares.get("g2")).toBeCloseTo(1 / 3);
    });

    it("all shares sum to 1 across multiple goals", () => {
      const goals = [
        makeGoal({ id: "g1", priority: 1 }),
        makeGoal({ id: "g2", priority: 2 }),
        makeGoal({ id: "g3", priority: 3 }),
      ];
      const shares = computeZipfShares(goals);
      const total = [...shares.values()].reduce((sum, s) => sum + s, 0);
      expect(total).toBeCloseTo(1);
    });
  });
});
