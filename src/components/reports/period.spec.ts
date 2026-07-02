import { describe, expect, it } from "vitest";

import { REPORT_PERIODS, resolvePeriodRange } from "./period";

const NOW = new Date("2026-06-15T00:00:00.000Z");

describe("REPORT_PERIODS", () => {
  it("lists the four supported reporting periods", () => {
    expect(REPORT_PERIODS).toEqual(["3m", "6m", "12m", "all"]);
  });
});

describe("resolvePeriodRange", () => {
  it("ends the range at the reference date", () => {
    expect(resolvePeriodRange("6m", NOW).end).toEqual(NOW);
  });

  it("starts a 3-month range three months before the reference date", () => {
    expect(resolvePeriodRange("3m", NOW).start).toEqual(
      new Date("2026-03-15T00:00:00.000Z"),
    );
  });

  it("starts a 12-month range twelve months before the reference date", () => {
    expect(resolvePeriodRange("12m", NOW).start).toEqual(
      new Date("2025-06-15T00:00:00.000Z"),
    );
  });

  it("leaves the start unbounded for the all-time range", () => {
    expect(resolvePeriodRange("all", NOW).start).toBeUndefined();
  });
});
