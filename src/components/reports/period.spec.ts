import { describe, expect, it } from "vitest";

import { REPORT_PERIODS, resolvePeriodRange } from "./period";

const NOW = new Date(2026, 5, 15); // June 15, 2026

describe("REPORT_PERIODS", () => {
  it("lists the four supported reporting periods", () => {
    expect(REPORT_PERIODS).toEqual(["3m", "6m", "12m", "all"]);
  });
});

describe("resolvePeriodRange", () => {
  it("ends the range at the reference date", () => {
    expect(resolvePeriodRange("6m", NOW).end).toEqual(NOW);
  });

  it("starts a 3-month range on the first of the month three months prior", () => {
    expect(resolvePeriodRange("3m", NOW).start).toEqual(
      new Date(2026, 2, 1), // March 1
    );
  });

  it("starts a 12-month range on the first of the month twelve months prior", () => {
    expect(resolvePeriodRange("12m", NOW).start).toEqual(
      new Date(2025, 5, 1), // June 1
    );
  });

  it("leaves the start unbounded for the all-time range", () => {
    expect(resolvePeriodRange("all", NOW).start).toBeUndefined();
  });
});

describe("resolvePeriodRange with a month-end reference date", () => {
  // July 31 − 3 months via setMonth(3) overflows: April has 30 days, so
  // day 31 rolls forward to May 1, skipping all of April. The first-of-month
  // approach pins the start to April 1 regardless of the reference day.
  const NOW_MONTH_END = new Date(2026, 6, 31); // July 31, 2026

  it("starts a 3-month range on the first of April without day overflow", () => {
    expect(resolvePeriodRange("3m", NOW_MONTH_END).start).toEqual(
      new Date(2026, 3, 1), // April 1
    );
  });

  it("starts a 6-month range on the first of January without day overflow", () => {
    expect(resolvePeriodRange("6m", NOW_MONTH_END).start).toEqual(
      new Date(2026, 0, 1), // January 1
    );
  });
});
