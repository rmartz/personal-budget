import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { REPORTS_PERIOD_COPY } from "./copy";
import { ReportsPeriodSelector } from "./ReportsPeriodSelector";

afterEach(cleanup);

describe("ReportsPeriodSelector", () => {
  it("labels the control with the copy string", () => {
    render(<ReportsPeriodSelector value="6m" onValueChange={vi.fn()} />);
    expect(
      screen.getByLabelText(REPORTS_PERIOD_COPY.selectorLabel),
    ).toBeDefined();
  });

  it("reflects the selected value", () => {
    render(<ReportsPeriodSelector value="12m" onValueChange={vi.fn()} />);
    const select = screen.getByLabelText<HTMLSelectElement>(
      REPORTS_PERIOD_COPY.selectorLabel,
    );
    expect(select.value).toBe("12m");
  });

  it("renders each period option with its copy label", () => {
    render(<ReportsPeriodSelector value="6m" onValueChange={vi.fn()} />);
    expect(
      screen.getByRole("option", { name: REPORTS_PERIOD_COPY.labels["3m"] }),
    ).toBeDefined();
    expect(
      screen.getByRole("option", { name: REPORTS_PERIOD_COPY.labels.all }),
    ).toBeDefined();
  });

  it("calls onValueChange with the newly selected period", () => {
    const onValueChange = vi.fn();
    render(<ReportsPeriodSelector value="6m" onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText(REPORTS_PERIOD_COPY.selectorLabel), {
      target: { value: "3m" },
    });
    expect(onValueChange).toHaveBeenCalledWith("3m");
  });
});
