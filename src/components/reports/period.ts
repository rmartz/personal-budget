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
 */
export function resolvePeriodRange(period: ReportPeriod, now: Date): DateRange {
  if (period === "all") {
    return { start: undefined, end: now };
  }
  const start = new Date(now);
  start.setMonth(start.getMonth() - MONTHS_BY_PERIOD[period]);
  return { start, end: now };
}
