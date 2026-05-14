import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Annuity } from "@/lib/firebase/schema/annuities";

import { AnnuityListView } from "./AnnuityListView";
import { ANNUITY_LIST_COPY } from "./copy";

afterEach(cleanup);

function makeAnnuity(overrides: Partial<Annuity> = {}): Annuity {
  return {
    id: "annuity-1",
    name: "Test Annuity",
    monthlyAmount: 100,
    startDate: new Date("2024-01-01T00:00:00.000Z"),
    durationMonths: 12,
    ...overrides,
  };
}

describe("AnnuityListView", () => {
  describe("populated state", () => {
    it("renders each annuity name", () => {
      const annuities = [
        makeAnnuity({ id: "1", name: "Netflix" }),
        makeAnnuity({ id: "2", name: "Car Loan" }),
      ];
      render(
        <AnnuityListView
          annuities={annuities}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(screen.getByText("Netflix")).toBeDefined();
      expect(screen.getByText("Car Loan")).toBeDefined();
    });

    it("renders the monthly amount for each annuity", () => {
      const annuities = [makeAnnuity({ id: "1", monthlyAmount: 49.99 })];
      render(
        <AnnuityListView
          annuities={annuities}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(screen.getByText("$49.99/mo")).toBeDefined();
    });

    it("renders the remaining term for a fixed-duration annuity", () => {
      // startDate in the far future so 0 months have elapsed; remaining = durationMonths
      const annuities = [
        makeAnnuity({
          id: "1",
          durationMonths: 36,
          startDate: new Date("2099-01-01T00:00:00.000Z"),
        }),
      ];
      render(
        <AnnuityListView
          annuities={annuities}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(screen.getByText("36 months")).toBeDefined();
    });

    it("subtracts elapsed months from the term", () => {
      // startDate 12 months ago, durationMonths 18 → remaining = 6
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      const annuities = [
        makeAnnuity({
          id: "1",
          durationMonths: 18,
          startDate: twelveMonthsAgo,
        }),
      ];
      render(
        <AnnuityListView
          annuities={annuities}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(screen.getByText("6 months")).toBeDefined();
    });

    it("clamps remaining term to zero for an expired annuity", () => {
      const annuities = [
        makeAnnuity({
          id: "1",
          durationMonths: 6,
          startDate: new Date("2020-01-01T00:00:00.000Z"),
        }),
      ];
      render(
        <AnnuityListView
          annuities={annuities}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(screen.getByText("0 months")).toBeDefined();
    });

    it("renders 'indefinite' for an annuity with no duration", () => {
      const annuities = [makeAnnuity({ id: "1", durationMonths: undefined })];
      render(
        <AnnuityListView
          annuities={annuities}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(screen.getByText(ANNUITY_LIST_COPY.indefiniteTerm)).toBeDefined();
    });

    it("does not render the empty state when annuities exist", () => {
      const annuities = [makeAnnuity({ id: "1" })];
      render(
        <AnnuityListView
          annuities={annuities}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(
        screen.queryByText(ANNUITY_LIST_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });

  describe("empty state", () => {
    it("renders the empty state message when there are no annuities", () => {
      render(
        <AnnuityListView
          annuities={[]}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(
        screen.getByText(ANNUITY_LIST_COPY.emptyStateMessage),
      ).toBeDefined();
    });

    it("does not render annuity rows in empty state", () => {
      render(
        <AnnuityListView
          annuities={[]}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(screen.queryByText("$49.99/mo")).toBeNull();
    });
  });

  describe("loading state", () => {
    it("does not render the empty state while loading", () => {
      render(
        <AnnuityListView
          annuities={[]}
          isLoading={true}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(
        screen.queryByText(ANNUITY_LIST_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });

  describe("new annuity action", () => {
    it("renders the New Annuity button", () => {
      render(
        <AnnuityListView
          annuities={[]}
          isLoading={false}
          onNewAnnuity={vi.fn()}
        />,
      );
      expect(
        screen.getByText(ANNUITY_LIST_COPY.newAnnuityButton),
      ).toBeDefined();
    });

    it("calls onNewAnnuity when the New Annuity button is clicked", () => {
      const onNewAnnuity = vi.fn();
      render(
        <AnnuityListView
          annuities={[]}
          isLoading={false}
          onNewAnnuity={onNewAnnuity}
        />,
      );
      fireEvent.click(screen.getByText(ANNUITY_LIST_COPY.newAnnuityButton));
      expect(onNewAnnuity).toHaveBeenCalledOnce();
    });
  });
});
