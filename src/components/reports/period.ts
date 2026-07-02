// The reporting period is a fixed value-set kept structural (an `as const`
// array + derived union) so it assigns cleanly to/from serialized forms (e.g. a
// future `?period=` query param) with no cast, per the Dependencies/value-set
// convention. Later chart sub-issues resolve it to a concrete date range.
export const REPORT_PERIODS = ["3m", "6m", "12m", "all"] as const;

export type ReportPeriod = (typeof REPORT_PERIODS)[number];

export interface DateRange {
  // `undefined` start means unbounded — the all-time range.
  start: Date | undefined;
  end: Date;
}

const MONTHS_BY_PERIOD: Record<Exclude<ReportPeriod, "all">, number> = {
  "3m": 3,
  "6m": 6,
  "12m": 12,
};

/**
 * Resolve a reporting period to a concrete `[start, end]` range, ending at
 * `now`. The all-time period has an unbounded (`undefined`) start. `now` is
 * passed in rather than read from the clock so callers and tests stay
 * deterministic.
 *
 * Periods start on the first of the month N months ago. This avoids
 * day-of-month overflow (e.g. July 31 − 3 months via `setMonth` lands on
 * May 1, skipping all of April) and aligns with natural financial-reporting
 * boundaries.
 */
export function resolvePeriodRange(period: ReportPeriod, now: Date): DateRange {
  if (period === "all") {
    return { start: undefined, end: now };
  }
  const months = MONTHS_BY_PERIOD[period];
  return {
    start: new Date(now.getFullYear(), now.getMonth() - months, 1),
    end: now,
  };
}
