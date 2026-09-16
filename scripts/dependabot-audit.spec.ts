import { describe, expect, it } from "vitest";

import type { DependabotPr, OtherPr } from "./dependabot-audit.mjs";
import { buildReport } from "./dependabot-audit.mjs";

function makeDependabotPr(
  overrides: Partial<DependabotPr> & { number: number; title: string },
): DependabotPr {
  return { state: "MERGED", statusCheckRollup: [], ...overrides };
}

function makeOtherPr(
  overrides: Partial<OtherPr> & { number: number; title: string },
): OtherPr {
  return {
    state: "MERGED",
    body: "",
    author: { login: "rmartz" },
    ...overrides,
  };
}

describe("buildReport", () => {
  it("classifies a cleanly-merged Dependabot PR as clean", () => {
    const dep = makeDependabotPr({
      number: 10,
      title: "Bump lodash from 4.17.20 to 4.17.21",
    });
    const { rows, groups } = buildReport([dep], []);
    expect(rows[0]?.outcome).toBe("clean");
    expect(rows[0]?.mechanics).toBe(false);
    const bucket = groups.get("individual");
    expect(bucket?.clean).toBe(1);
    expect(bucket?.["needed-fix"]).toBe(0);
  });

  it("classifies a merged PR with a fix reference as needed-fix", () => {
    const dep = makeDependabotPr({
      number: 20,
      title: "Bump react from 18.0.0 to 18.1.0 in the react group",
    });
    const fix = makeOtherPr({
      number: 21,
      title: "Fix react breakage",
      body: "Fixes Dependabot #20",
    });
    const { rows, groups } = buildReport([dep], [fix]);
    expect(rows[0]?.outcome).toBe("needed-fix");
    expect(rows[0]?.fixes).toEqual([21]);
    expect(rows[0]?.mechanics).toBe(false);
    const bucket = groups.get("react");
    expect(bucket?.["needed-fix"]).toBe(1);
    expect(bucket?.mechanics).toBe(0);
  });

  it("marks a lockfile-repair fix as mechanics, excluded from the group rate", () => {
    const dep = makeDependabotPr({
      number: 30,
      title: "Bump eslint from 8.0.0 to 9.0.0 in the eslint group",
    });
    const fix = makeOtherPr({
      number: 31,
      title: "Fix lockfile corruption after merge",
      body: "Unblocks #30 — lockfile was corrupt",
    });
    const { rows, groups } = buildReport([dep], [fix]);
    expect(rows[0]?.outcome).toBe("needed-fix");
    expect(rows[0]?.mechanics).toBe(true);
    const bucket = groups.get("eslint");
    expect(bucket?.["needed-fix"]).toBe(1);
    expect(bucket?.mechanics).toBe(1);
  });

  it("classifies a Dependabot-closed PR as churn", () => {
    const dep = makeDependabotPr({
      number: 40,
      title: "Bump prettier from 3.2.0 to 3.3.0 in the prettier group",
      state: "CLOSED",
    });
    const { rows, groups } = buildReport([dep], []);
    expect(rows[0]?.outcome).toBe("churn");
    expect(groups.get("prettier")?.churn).toBe(1);
  });

  it("classifies an open PR with no red checks as pending", () => {
    const dep = makeDependabotPr({
      number: 50,
      title: "Bump typescript from 5.4.0 to 5.5.0 in the typescript group",
      state: "OPEN",
      statusCheckRollup: [{ conclusion: "SUCCESS", state: "SUCCESS" }],
    });
    const { rows, groups } = buildReport([dep], []);
    expect(rows[0]?.outcome).toBe("pending");
    expect(groups.get("typescript")?.pending).toBe(1);
  });

  it("classifies an open PR with a FAILURE check as stuck", () => {
    const dep = makeDependabotPr({
      number: 60,
      title: "Bump vite from 5.0.0 to 5.1.0 in the vite group",
      state: "OPEN",
      statusCheckRollup: [{ conclusion: "FAILURE", state: "FAILURE" }],
    });
    const { rows, groups } = buildReport([dep], []);
    expect(rows[0]?.outcome).toBe("stuck");
    expect(groups.get("vite")?.stuck).toBe(1);
  });

  it("classifies an open PR with a STARTUP_FAILURE check as stuck", () => {
    const dep = makeDependabotPr({
      number: 61,
      title: "Bump vite from 5.1.0 to 5.2.0 in the vite group",
      state: "OPEN",
      statusCheckRollup: [{ conclusion: "STARTUP_FAILURE" }],
    });
    const { rows } = buildReport([dep], []);
    expect(rows[0]?.outcome).toBe("stuck");
  });

  it("classifies an open PR with a TIMED_OUT check as stuck", () => {
    const dep = makeDependabotPr({
      number: 62,
      title: "Bump vite from 5.2.0 to 5.3.0 in the vite group",
      state: "OPEN",
      statusCheckRollup: [{ conclusion: "TIMED_OUT" }],
    });
    const { rows } = buildReport([dep], []);
    expect(rows[0]?.outcome).toBe("stuck");
  });
});
