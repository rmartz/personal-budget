import { describe, expect, it } from "vitest";

import {
  computeGoalEta,
  computeGoalEtaFromShare,
  computeZipfShares,
} from "../goal-funding";
import { makeGoal, REF_DATE } from "./fixtures";

describe("computeGoalEtaFromShare", () => {
  describe("returns undefined when there is no allocation or goal is funded", () => {
    it("returns undefined when monthlyAllocation is 0", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 0 });
      expect(computeGoalEtaFromShare(goal, 1, 0, REF_DATE)).toBeUndefined();
    });

    it("returns undefined when the goal is already fully funded", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 1000 });
      expect(computeGoalEtaFromShare(goal, 1, 500, REF_DATE)).toBeUndefined();
    });

    it("returns undefined when the Zipf share is 0", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 0 });
      expect(computeGoalEtaFromShare(goal, 0, 500, REF_DATE)).toBeUndefined();
    });
  });

  describe("computes the same ETA as computeGoalEta given the matching share", () => {
    it("produces the same date for a single goal with share 1.0", () => {
      const goal = makeGoal({
        targetAmount: 1000,
        fundedAmount: 0,
        priority: 1,
      });
      const etaFromShare = computeGoalEtaFromShare(goal, 1.0, 500, REF_DATE);
      const etaDirect = computeGoalEta(goal, [goal], 500, REF_DATE);
      expect(etaFromShare?.getTime()).toBe(etaDirect?.getTime());
    });

    it("produces the same date for a priority-1 goal in a two-goal set", () => {
      const goal1 = makeGoal({ id: "g1", priority: 1, targetAmount: 600 });
      const goal2 = makeGoal({ id: "g2", priority: 2, targetAmount: 600 });
      const allGoals = [goal1, goal2];
      const shares = computeZipfShares(allGoals);

      const etaFromShare = computeGoalEtaFromShare(
        goal1,
        shares.get("g1") ?? 0,
        900,
        REF_DATE,
      );
      const etaDirect = computeGoalEta(goal1, allGoals, 900, REF_DATE);
      expect(etaFromShare?.getTime()).toBe(etaDirect?.getTime());
    });
  });
});
