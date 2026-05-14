import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AnnuityBalanceTrend } from "./AnnuityBalanceTrend";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";
import { ANNUITY_CARD_COPY } from "./copy";
import type { Annuity } from "@/lib/firebase/schema/annuities";

afterEach(cleanup);

function makeAnnuity(overrides: Partial<Annuity> = {}): Annuity {
  return {
    id: "annuity-1",
    name: "Mortgage",
    monthlyAmount: 978.63,
    startDate: new Date("2020-01-01T00:00:00.000Z"),
    durationMonths: 360,
    monthlyMode: AnnuityMonthlyMode.Flat,
    ...overrides,
  };
}

describe("AnnuityBalanceTrend", () => {
  describe("renders the section title with the annuity name", () => {
    it("shows the annuity name uppercased in the title", () => {
      render(
        <AnnuityBalanceTrend annuity={makeAnnuity({ name: "Auto Loan" })} />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.balanceTrendTitle("AUTO LOAN")),
      ).toBeDefined();
    });
  });

  describe("renders the chart placeholder", () => {
    it("renders an element with the chart placeholder label", () => {
      render(<AnnuityBalanceTrend annuity={makeAnnuity()} />);
      expect(
        screen.getByRole("img", {
          name: ANNUITY_CARD_COPY.balanceTrendChartPlaceholder,
        }),
      ).toBeDefined();
    });
  });
});
