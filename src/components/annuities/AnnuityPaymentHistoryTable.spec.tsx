import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { Annuity } from "@/lib/firebase/schema/annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { AnnuityPaymentHistoryTable } from "./AnnuityPaymentHistoryTable";
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

describe("AnnuityPaymentHistoryTable", () => {
  describe("renders the section title with the annuity name", () => {
    it("shows the annuity name in the title", () => {
      render(
        <AnnuityPaymentHistoryTable
          annuity={makeAnnuity({ name: "Car Loan" })}
          payments={[]}
        />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.paymentHistoryTitle("CAR LOAN")),
      ).toBeDefined();
    });
  });

  describe("renders table column headers", () => {
    it("shows the Month column header", () => {
      render(
        <AnnuityPaymentHistoryTable annuity={makeAnnuity()} payments={[]} />,
      );
      expect(screen.getByText(ANNUITY_CARD_COPY.columnMonth)).toBeDefined();
    });

    it("shows the Balance column header", () => {
      render(
        <AnnuityPaymentHistoryTable annuity={makeAnnuity()} payments={[]} />,
      );
      expect(screen.getByText(ANNUITY_CARD_COPY.columnBalance)).toBeDefined();
    });
  });

  describe("renders empty state when no payments exist", () => {
    it("shows the empty-state message when no payments exist", () => {
      render(
        <AnnuityPaymentHistoryTable annuity={makeAnnuity()} payments={[]} />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.paymentHistoryEmpty),
      ).toBeDefined();
    });
  });

  describe("renders one row per payment when payments exist", () => {
    it("does not show the empty-state message when payments exist", () => {
      render(
        <AnnuityPaymentHistoryTable
          annuity={makeAnnuity()}
          payments={[
            {
              id: "p1",
              amount: 100,
              date: new Date("2024-01-15T00:00:00.000Z"),
            },
          ]}
        />,
      );
      expect(
        screen.queryByText(ANNUITY_CARD_COPY.paymentHistoryEmpty),
      ).toBeNull();
    });

    it("shows the payment amount formatted as currency", () => {
      render(
        <AnnuityPaymentHistoryTable
          annuity={makeAnnuity()}
          payments={[
            {
              id: "p1",
              amount: 856.07,
              date: new Date("2024-03-10T00:00:00.000Z"),
            },
          ]}
        />,
      );
      expect(screen.getByText("$856.07")).toBeDefined();
    });

    it("shows the payment date formatted as month and year", () => {
      render(
        <AnnuityPaymentHistoryTable
          annuity={makeAnnuity()}
          payments={[
            {
              id: "p1",
              amount: 100,
              date: new Date("2024-01-15T00:00:00.000Z"),
            },
          ]}
        />,
      );
      expect(screen.getByText("Jan 2024")).toBeDefined();
    });
  });

  describe("shows principal and interest breakdown for PV-derived annuities", () => {
    it("shows non-placeholder principal and interest values for a PV-derived annuity", () => {
      const pvAnnuity = makeAnnuity({
        monthlyMode: AnnuityMonthlyMode.PVDerived,
        presentValue: 10000,
        annualRatePercent: 5,
        durationMonths: 12,
      });
      render(
        <AnnuityPaymentHistoryTable
          annuity={pvAnnuity}
          payments={[
            {
              id: "p1",
              amount: 856.07,
              date: new Date("2024-01-15T00:00:00.000Z"),
            },
          ]}
        />,
      );
      // Principal and Interest columns should show computed currency values, not "—"
      const placeholders = screen.queryAllByText(
        ANNUITY_CARD_COPY.balanceTrendPlaceholderValue,
      );
      expect(placeholders.length).toBe(0);
    });
  });
});
