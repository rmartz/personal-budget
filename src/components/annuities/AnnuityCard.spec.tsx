import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Annuity } from "@/lib/firebase/schema/annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { AnnuityCard } from "./AnnuityCard";
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

describe("AnnuityCard — content", () => {
  describe("renders the annuity name as an uppercase eyebrow", () => {
    it("shows the name in uppercase", () => {
      render(<AnnuityCard annuity={makeAnnuity({ name: "Car Loan" })} />);
      expect(screen.getByText("CAR LOAN")).toBeDefined();
    });
  });

  describe("renders the monthly amount", () => {
    it("formats the monthly amount as currency", () => {
      render(<AnnuityCard annuity={makeAnnuity({ monthlyAmount: 1250 })} />);
      expect(screen.getByText("$1,250.00")).toBeDefined();
    });
  });

  describe("renders the correct monthly mode sublabel", () => {
    it("shows Flat sublabel for Flat mode", () => {
      render(
        <AnnuityCard
          annuity={makeAnnuity({ monthlyMode: AnnuityMonthlyMode.Flat })}
        />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.monthlyModeFlatSublabel),
      ).toBeDefined();
    });

    it("shows PV-derived sublabel for PVDerived mode", () => {
      render(
        <AnnuityCard
          annuity={makeAnnuity({ monthlyMode: AnnuityMonthlyMode.PVDerived })}
        />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.monthlyModePVDerivedSublabel),
      ).toBeDefined();
    });
  });

  describe("renders term remaining", () => {
    it("shows 'Ongoing' for an annuity with no duration", () => {
      render(
        <AnnuityCard annuity={makeAnnuity({ durationMonths: undefined })} />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.termRemainingIndefinite),
      ).toBeDefined();
    });

    it("shows months remaining for a fixed-duration annuity in the future", () => {
      render(
        <AnnuityCard
          annuity={makeAnnuity({
            startDate: new Date("2099-01-01T00:00:00.000Z"),
            durationMonths: 24,
          })}
        />,
      );
      expect(
        screen.getByText(ANNUITY_CARD_COPY.termRemainingMonths(24)),
      ).toBeDefined();
    });
  });
});

describe("AnnuityCard — selection state", () => {
  it("sets aria-pressed to true when isSelected is true", () => {
    render(
      <AnnuityCard
        annuity={makeAnnuity()}
        isSelected={true}
        onSelect={vi.fn()}
      />,
    );
    const button = screen.getByRole("button", {
      name: ANNUITY_CARD_COPY.selectAriaLabel,
    });
    expect(button.getAttribute("aria-pressed")).toBe("true");
  });

  it("sets aria-pressed to false when isSelected is false", () => {
    render(
      <AnnuityCard
        annuity={makeAnnuity()}
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );
    const button = screen.getByRole("button", {
      name: ANNUITY_CARD_COPY.selectAriaLabel,
    });
    expect(button.getAttribute("aria-pressed")).toBe("false");
  });
});

describe("AnnuityCard — edit action", () => {
  it("renders an edit button when onEdit is provided", () => {
    render(
      <AnnuityCard
        annuity={makeAnnuity()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: ANNUITY_CARD_COPY.editAriaLabel }),
    ).toBeDefined();
  });

  it("calls onEdit when the edit button is clicked", () => {
    const onEdit = vi.fn();
    render(
      <AnnuityCard
        annuity={makeAnnuity()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: ANNUITY_CARD_COPY.editAriaLabel }),
    );
    expect(onEdit).toHaveBeenCalled();
  });
});

describe("AnnuityCard — delete action", () => {
  it("renders a delete button when onDelete is provided", () => {
    render(
      <AnnuityCard
        annuity={makeAnnuity()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: ANNUITY_CARD_COPY.deleteAriaLabel }),
    ).toBeDefined();
  });

  it("calls onDelete when the delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <AnnuityCard
        annuity={makeAnnuity()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: ANNUITY_CARD_COPY.deleteAriaLabel }),
    );
    expect(onDelete).toHaveBeenCalled();
  });
});
