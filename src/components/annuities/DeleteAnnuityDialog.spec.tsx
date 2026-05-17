import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Annuity } from "@/lib/firebase/schema/annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { DELETE_ANNUITY_DIALOG_COPY } from "./copy";
import { DeleteAnnuityDialog } from "./DeleteAnnuityDialog";

afterEach(cleanup);

function makeAnnuity(overrides: Partial<Annuity> = {}): Annuity {
  return {
    id: "annuity-1",
    name: "Car Loan",
    monthlyAmount: 250,
    startDate: new Date("2023-01-01"),
    durationMonths: 60,
    monthlyMode: AnnuityMonthlyMode.Flat,
    ...overrides,
  };
}

describe("DeleteAnnuityDialog — confirmation dialog", () => {
  it("renders the annuity name in the confirmation message", () => {
    render(
      <DeleteAnnuityDialog
        open={true}
        onOpenChange={vi.fn()}
        annuity={makeAnnuity({ name: "Mortgage" })}
        onConfirm={vi.fn()}
        isDeleting={false}
      />,
    );
    expect(
      screen.getByText(DELETE_ANNUITY_DIALOG_COPY.confirmMessage("Mortgage")),
    ).toBeDefined();
  });

  it("calls onConfirm when the delete button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <DeleteAnnuityDialog
        open={true}
        onOpenChange={vi.fn()}
        annuity={makeAnnuity()}
        onConfirm={onConfirm}
        isDeleting={false}
      />,
    );
    fireEvent.click(screen.getByText(DELETE_ANNUITY_DIALOG_COPY.confirmButton));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onOpenChange(false) when cancel button is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <DeleteAnnuityDialog
        open={true}
        onOpenChange={onOpenChange}
        annuity={makeAnnuity()}
        onConfirm={vi.fn()}
        isDeleting={false}
      />,
    );
    fireEvent.click(screen.getByText(DELETE_ANNUITY_DIALOG_COPY.cancelButton));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables delete button while isDeleting is true", () => {
    render(
      <DeleteAnnuityDialog
        open={true}
        onOpenChange={vi.fn()}
        annuity={makeAnnuity()}
        onConfirm={vi.fn()}
        isDeleting={true}
      />,
    );
    const deleteBtn = screen
      .getByText(DELETE_ANNUITY_DIALOG_COPY.deletingButton)
      .closest("button");
    expect(deleteBtn?.disabled).toBe(true);
  });
});
