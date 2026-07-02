import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { REPORTS_PAGE_COPY, REPORTS_PERIOD_COPY } from "./copy";
import { type ReportPeriod } from "./period";
import { ReportsView } from "./ReportsView";

afterEach(cleanup);

describe("ReportsView — page shell", () => {
  it("renders the reports heading from copy", () => {
    render(<ReportsView period="6m" onPeriodChange={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: REPORTS_PAGE_COPY.title }),
    ).toBeDefined();
  });

  it("renders the period selector", () => {
    render(<ReportsView period="6m" onPeriodChange={vi.fn()} />);
    expect(
      screen.getByLabelText(REPORTS_PERIOD_COPY.selectorLabel),
    ).toBeDefined();
  });

  it("renders the empty chart-grid placeholder", () => {
    render(<ReportsView period="6m" onPeriodChange={vi.fn()} />);
    expect(screen.getByText(REPORTS_PAGE_COPY.emptyChartGrid)).toBeDefined();
  });
});

describe("ReportsView — selected-range state", () => {
  it("updates the displayed period when the selector changes (page owns state)", () => {
    function Harness() {
      const [period, setPeriod] = useState<ReportPeriod>("6m");
      return <ReportsView period={period} onPeriodChange={setPeriod} />;
    }
    render(<Harness />);
    const select = screen.getByLabelText<HTMLSelectElement>(
      REPORTS_PERIOD_COPY.selectorLabel,
    );
    expect(select.value).toBe("6m");
    fireEvent.change(select, { target: { value: "12m" } });
    expect(select.value).toBe("12m");
  });
});
