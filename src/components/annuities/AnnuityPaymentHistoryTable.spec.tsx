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
        />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.paymentHistoryTitle("CAR LOAN")),
      ).toBeDefined();
    });
  });

  describe("renders table column headers", () => {
    it("shows the Month column header", () => {
      render(<AnnuityPaymentHistoryTable annuity={makeAnnuity()} />);
      expect(screen.getByText(ANNUITY_CARD_COPY.columnMonth)).toBeDefined();
    });

    it("shows the Balance column header", () => {
      render(<AnnuityPaymentHistoryTable annuity={makeAnnuity()} />);
      expect(screen.getByText(ANNUITY_CARD_COPY.columnBalance)).toBeDefined();
    });
  });

  describe("renders empty state", () => {
    it("shows the empty-state message when no payments exist", () => {
      render(<AnnuityPaymentHistoryTable annuity={makeAnnuity()} />);
      expect(
        screen.getByText(ANNUITY_CARD_COPY.paymentHistoryEmpty),
      ).toBeDefined();
    });
  });
});
