import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { Annuity } from "@/lib/firebase/schema/annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { AnnuityBalanceTrend } from "./AnnuityBalanceTrend";
import { ANNUITY_CARD_COPY } from "./copy";

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
        <AnnuityBalanceTrend
          annuity={makeAnnuity({ name: "Auto Loan" })}
          payments={[]}
        />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.balanceTrendTitle("AUTO LOAN")),
      ).toBeDefined();
    });
  });

  describe("renders the chart placeholder", () => {
    it("renders an element with the chart placeholder label", () => {
      render(<AnnuityBalanceTrend annuity={makeAnnuity()} payments={[]} />);
      expect(
        screen.getByRole("img", {
          name: ANNUITY_CARD_COPY.balanceTrendChartPlaceholder,
        }),
      ).toBeDefined();
    });
  });

  describe("renders the Started / Now / Payoff summary row", () => {
    it("renders the Started label", () => {
      render(<AnnuityBalanceTrend annuity={makeAnnuity()} payments={[]} />);
      expect(
        screen.getByText(ANNUITY_CARD_COPY.balanceTrendStartedLabel),
      ).toBeDefined();
    });

    it("renders the Now label", () => {
      render(<AnnuityBalanceTrend annuity={makeAnnuity()} payments={[]} />);
      expect(
        screen.getByText(ANNUITY_CARD_COPY.balanceTrendNowLabel),
      ).toBeDefined();
    });

    it("renders the Payoff label", () => {
      render(<AnnuityBalanceTrend annuity={makeAnnuity()} payments={[]} />);
      expect(
        screen.getByText(ANNUITY_CARD_COPY.balanceTrendPayoffLabel),
      ).toBeDefined();
    });
  });

  describe("shows presentValue as Started for a PV-derived annuity", () => {
    it("displays the formatted presentValue under the Started label", () => {
      const pvAnnuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: 5,
        durationMonths: 12,
      });
      render(<AnnuityBalanceTrend annuity={pvAnnuity} payments={[]} />);
      expect(screen.getAllByText("$10,000.00").length).toBeGreaterThanOrEqual(
        1,
      );
    });

    it("displays placeholder when annuity has no presentValue", () => {
      render(
        <AnnuityBalanceTrend
          annuity={makeAnnuity({ presentValue: undefined })}
          payments={[]}
        />,
      );
      const placeholders = screen.getAllByText(
        ANNUITY_CARD_COPY.balanceTrendPlaceholderValue,
      );
      expect(placeholders.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("shows computed Now balance for a PV-derived annuity", () => {
    it("shows the presentValue as Now balance when 0 payments have been made", () => {
      const pvAnnuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: 5,
        durationMonths: 12,
      });
      render(<AnnuityBalanceTrend annuity={pvAnnuity} payments={[]} />);
      // Both Started and Now show $10,000.00 when no payments have been made
      const values = screen.getAllByText("$10,000.00");
      expect(values.length).toBeGreaterThanOrEqual(2);
    });

    it("shows a reduced Now balance after some payments", () => {
      const pvAnnuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: 5,
        durationMonths: 12,
      });
      const payments = Array.from({ length: 6 }, (_, i) => ({
        id: `p${String(i + 1)}`,
        amount: 856.07,
        date: new Date(`2024-0${String(i + 1)}-01T00:00:00.000Z`),
      }));
      render(<AnnuityBalanceTrend annuity={pvAnnuity} payments={payments} />);
      const nowLabel = screen.getByText(ANNUITY_CARD_COPY.balanceTrendNowLabel);
      const nowValue = nowLabel.nextElementSibling;
      expect(nowValue?.textContent).not.toBe(
        ANNUITY_CARD_COPY.balanceTrendPlaceholderValue,
      );
      expect(nowValue?.textContent).not.toBe("$10,000.00");
    });
  });
});
