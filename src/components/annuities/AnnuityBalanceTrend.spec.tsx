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

  describe("renders the Started / Now / Payoff summary row", () => {
    it("renders the Started label", () => {
      render(<AnnuityBalanceTrend annuity={makeAnnuity()} />);
      expect(
        screen.getByText(ANNUITY_CARD_COPY.balanceTrendStartedLabel),
      ).toBeDefined();
    });

    it("renders the Now label", () => {
      render(<AnnuityBalanceTrend annuity={makeAnnuity()} />);
      expect(
        screen.getByText(ANNUITY_CARD_COPY.balanceTrendNowLabel),
      ).toBeDefined();
    });

    it("renders the Payoff label", () => {
      render(<AnnuityBalanceTrend annuity={makeAnnuity()} />);
      expect(
        screen.getByText(ANNUITY_CARD_COPY.balanceTrendPayoffLabel),
      ).toBeDefined();
    });
  });
});
