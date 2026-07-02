import { Select } from "@/components/ui/select";

import { REPORTS_PERIOD_COPY } from "./copy";
import { REPORT_PERIODS, type ReportPeriod } from "./period";

export interface ReportsPeriodSelectorProps {
  value: ReportPeriod;
  onValueChange: (period: ReportPeriod) => void;
}

/**
 * Presentational period picker. The reports page owns the selected period and
 * passes it (and the setter) down; later chart sub-issues reuse this control.
 */
export function ReportsPeriodSelector({
  value,
  onValueChange,
}: ReportsPeriodSelectorProps) {
  return (
    <Select
      aria-label={REPORTS_PERIOD_COPY.selectorLabel}
      value={value}
      onChange={(event) => {
        onValueChange(event.target.value as ReportPeriod);
      }}
    >
      {REPORT_PERIODS.map((period) => (
        <option key={period} value={period}>
          {REPORTS_PERIOD_COPY.labels[period]}
        </option>
      ))}
    </Select>
  );
}
