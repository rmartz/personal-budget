import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AnnuityListView } from "./AnnuityListView";
import { ANNUITY_LIST_COPY } from "./copy";
import type { Annuity } from "@/lib/firebase/schema/annuities";

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
      render(<AnnuityListView annuities={annuities} isLoading={false} />);
      expect(screen.getByText("Netflix")).toBeDefined();
      expect(screen.getByText("Car Loan")).toBeDefined();
    });

    it("renders the monthly amount for each annuity", () => {
      const annuities = [makeAnnuity({ id: "1", monthlyAmount: 49.99 })];
      render(<AnnuityListView annuities={annuities} isLoading={false} />);
      expect(screen.getByText("$49.99/mo")).toBeDefined();
    });

    it("renders the remaining term for a fixed-duration annuity", () => {
      const annuities = [makeAnnuity({ id: "1", durationMonths: 24 })];
      render(<AnnuityListView annuities={annuities} isLoading={false} />);
      expect(screen.getByText("24 months")).toBeDefined();
    });

    it("renders 'indefinite' for an annuity with no duration", () => {
      const annuities = [makeAnnuity({ id: "1", durationMonths: undefined })];
      render(<AnnuityListView annuities={annuities} isLoading={false} />);
      expect(screen.getByText(ANNUITY_LIST_COPY.indefiniteTerm)).toBeDefined();
    });

    it("does not render the empty state when annuities exist", () => {
      const annuities = [makeAnnuity({ id: "1" })];
      render(<AnnuityListView annuities={annuities} isLoading={false} />);
      expect(
        screen.queryByText(ANNUITY_LIST_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });

  describe("empty state", () => {
    it("renders the empty state message when there are no annuities", () => {
      render(<AnnuityListView annuities={[]} isLoading={false} />);
      expect(
        screen.getByText(ANNUITY_LIST_COPY.emptyStateMessage),
      ).toBeDefined();
    });

    it("does not render annuity rows in empty state", () => {
      render(<AnnuityListView annuities={[]} isLoading={false} />);
      expect(screen.queryByText("$49.99/mo")).toBeNull();
    });
  });

  describe("loading state", () => {
    it("does not render the empty state while loading", () => {
      render(<AnnuityListView annuities={[]} isLoading={true} />);
      expect(
        screen.queryByText(ANNUITY_LIST_COPY.emptyStateMessage),
      ).toBeNull();
    });
  });
});
