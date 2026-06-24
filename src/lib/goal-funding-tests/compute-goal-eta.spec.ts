import { describe, expect, it } from "vitest";

import { computeGoalEta } from "../goal-funding";
import { makeGoal, REF_DATE } from "./fixtures";

describe("computeGoalEta", () => {
  describe("returns undefined when there is no monthly allocation", () => {
    it("returns undefined when monthlyAllocation is 0", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 0 });
      expect(computeGoalEta(goal, [goal], 0, REF_DATE)).toBeUndefined();
    });
  });

  describe("returns undefined when the goal is already fully funded", () => {
    it("returns undefined when fundedAmount equals targetAmount", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 1000 });
      expect(computeGoalEta(goal, [goal], 500, REF_DATE)).toBeUndefined();
    });

    it("returns undefined when fundedAmount exceeds targetAmount", () => {
      const goal = makeGoal({ targetAmount: 1000, fundedAmount: 1200 });
      expect(computeGoalEta(goal, [goal], 500, REF_DATE)).toBeUndefined();
    });
  });

  describe("computes ETA for a single goal", () => {
    it("returns a date 2 months out when a $1000 goal gets $500/month with Zipf share 1.0", () => {
      // 1 goal → Zipf share = 1.0; $500/month; $1000 remaining → 2 months
      const goal = makeGoal({
        targetAmount: 1000,
        fundedAmount: 0,
        priority: 1,
      });
      const eta = computeGoalEta(goal, [goal], 500, REF_DATE);
      // REF_DATE = Jun 1, 2025 + 2 months = Aug 1, 2025
      expect(eta).toBeDefined();
      expect(eta!.getFullYear()).toBe(2025);
      expect(eta!.getMonth()).toBe(7); // August (0-indexed)
    });

    it("returns a date 1 month out when the goal needs $250 at $500/month", () => {
      const goal = makeGoal({
        targetAmount: 500,
        fundedAmount: 250,
        priority: 1,
      });
      const eta = computeGoalEta(goal, [goal], 500, REF_DATE);
      // $250 remaining / $500 per month = 0.5 months → round up to 1 month
      expect(eta).toBeDefined();
      expect(eta!.getFullYear()).toBe(2025);
      expect(eta!.getMonth()).toBe(6); // July
    });
  });

  describe("applies Zipf weights across multiple goals", () => {
    it("priority-1 goal gets funded before priority-2 goal with equal remaining amounts", () => {
      const goal1 = makeGoal({
        id: "g1",
        priority: 1,
        targetAmount: 1000,
        fundedAmount: 0,
      });
      const goal2 = makeGoal({
        id: "g2",
        priority: 2,
        targetAmount: 1000,
        fundedAmount: 0,
      });
      const allGoals = [goal1, goal2];

      const eta1 = computeGoalEta(goal1, allGoals, 600, REF_DATE);
      const eta2 = computeGoalEta(goal2, allGoals, 600, REF_DATE);

      expect(eta1).toBeDefined();
      expect(eta2).toBeDefined();
      expect(eta1!.getTime()).toBeLessThan(eta2!.getTime());
    });

    it("distributes monthly allocation by Zipf weights between two goals", () => {
      // 2 goals: Zipf share for priority-1 = (1) / (1 + 0.5) = 2/3
      // Zipf share for priority-2 = (0.5) / (1 + 0.5) = 1/3
      // Monthly allocation: $900; goal1 gets $600/month, goal2 gets $300/month
      // goal1 needs $600 → 1 month; goal2 needs $600 → 2 months
      const goal1 = makeGoal({
        id: "g1",
        priority: 1,
        targetAmount: 600,
        fundedAmount: 0,
      });
      const goal2 = makeGoal({
        id: "g2",
        priority: 2,
        targetAmount: 600,
        fundedAmount: 0,
      });
      const allGoals = [goal1, goal2];

      const eta1 = computeGoalEta(goal1, allGoals, 900, REF_DATE);
      const eta2 = computeGoalEta(goal2, allGoals, 900, REF_DATE);

      expect(eta1).toBeDefined();
      expect(eta2).toBeDefined();
      // goal1: 1 month from Jun → Jul 2025
      expect(eta1!.getMonth()).toBe(6); // July
      // goal2: 2 months from Jun → Aug 2025
      expect(eta2!.getMonth()).toBe(7); // August
    });
  });
});
