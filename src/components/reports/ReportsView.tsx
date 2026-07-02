import { REPORTS_PAGE_COPY } from "./copy";
import { type ReportPeriod } from "./period";
import { ReportsPeriodSelector } from "./ReportsPeriodSelector";

export interface ReportsViewProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
}

/**
 * Reports page shell: a heading, the shared period selector, and a responsive
 * grid of card slots the chart sub-issues fill in. Presentational — the route
 * owns the selected-period state and passes it down.
 */
export function ReportsView({ period, onPeriodChange }: ReportsViewProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {REPORTS_PAGE_COPY.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {REPORTS_PAGE_COPY.subtitle}
          </p>
        </div>
        <div className="w-full sm:w-52">
          <ReportsPeriodSelector
            value={period}
            onValueChange={onPeriodChange}
          />
        </div>
      </header>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <p className="text-sm text-muted-foreground lg:col-span-2">
          {REPORTS_PAGE_COPY.emptyChartGrid}
        </p>
      </div>
    </div>
  );
}
