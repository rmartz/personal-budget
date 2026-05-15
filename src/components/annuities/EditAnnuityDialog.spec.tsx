import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Annuity } from "@/lib/firebase/schema/annuities";
import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { EDIT_ANNUITY_DIALOG_COPY } from "./copy";
import { EditAnnuityDialogView } from "./EditAnnuityDialog";

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

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  name: "Car Loan",
  onNameChange: vi.fn(),
  monthlyAmount: "250",
  onMonthlyAmountChange: vi.fn(),
  nameError: undefined,
  monthlyAmountError: undefined,
  submitError: undefined,
  onSubmit: vi.fn(),
  isSubmitting: false,
};

describe("EditAnnuityDialogView — name field pre-populated", () => {
  it("renders the name input with the annuity name value", () => {
    render(<EditAnnuityDialogView {...baseProps} name="My Loan" />);
    expect(screen.getByDisplayValue("My Loan")).toBeDefined();
  });

  it("calls onNameChange when the name field changes", () => {
    const onNameChange = vi.fn();
    render(
      <EditAnnuityDialogView {...baseProps} onNameChange={onNameChange} />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_ANNUITY_DIALOG_COPY.nameLabel),
      { target: { value: "Updated Name" } },
    );
    expect(onNameChange).toHaveBeenCalledWith("Updated Name");
  });

  it("shows nameError when provided", () => {
    render(
      <EditAnnuityDialogView
        {...baseProps}
        nameError={EDIT_ANNUITY_DIALOG_COPY.nameRequiredError}
      />,
    );
    expect(
      screen.getByText(EDIT_ANNUITY_DIALOG_COPY.nameRequiredError),
    ).toBeDefined();
  });
});

describe("EditAnnuityDialogView — monthly amount field pre-populated", () => {
  it("renders the monthly amount input with the annuity value", () => {
    render(<EditAnnuityDialogView {...baseProps} monthlyAmount="978.63" />);
    expect(screen.getByDisplayValue("978.63")).toBeDefined();
  });

  it("calls onMonthlyAmountChange when the monthly amount field changes", () => {
    const onMonthlyAmountChange = vi.fn();
    render(
      <EditAnnuityDialogView
        {...baseProps}
        onMonthlyAmountChange={onMonthlyAmountChange}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
      { target: { value: "300" } },
    );
    expect(onMonthlyAmountChange).toHaveBeenCalledWith("300");
  });

  it("shows monthlyAmountError when provided", () => {
    render(
      <EditAnnuityDialogView
        {...baseProps}
        monthlyAmountError={EDIT_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError}
      />,
    );
    expect(
      screen.getByText(EDIT_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError),
    ).toBeDefined();
  });
});

describe("EditAnnuityDialogView — saving persists changes", () => {
  it("calls onSubmit when save button is clicked", () => {
    const onSubmit = vi.fn();
    render(<EditAnnuityDialogView {...baseProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText(EDIT_ANNUITY_DIALOG_COPY.submitButton));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("disables buttons while isSubmitting", () => {
    render(<EditAnnuityDialogView {...baseProps} isSubmitting={true} />);
    const saveBtn = screen
      .getByText(EDIT_ANNUITY_DIALOG_COPY.savingButton)
      .closest("button");
    expect(saveBtn?.disabled).toBe(true);
  });

  it("shows submitError when provided", () => {
    render(
      <EditAnnuityDialogView
        {...baseProps}
        submitError={EDIT_ANNUITY_DIALOG_COPY.submitError}
      />,
    );
    expect(
      screen.getByText(EDIT_ANNUITY_DIALOG_COPY.submitError),
    ).toBeDefined();
  });
});

describe("EditAnnuityDialog integration — saves with updated name and monthly amount", () => {
  it("calls onSubmit with updated name and monthly amount", async () => {
    const { EditAnnuityDialog } = await import("./EditAnnuityDialog");
    const onSave = vi.fn().mockResolvedValue(undefined);
    const annuity = makeAnnuity({ name: "Old Name", monthlyAmount: 100 });

    render(
      <EditAnnuityDialog
        open={true}
        onOpenChange={vi.fn()}
        annuity={annuity}
        onSave={onSave}
      />,
    );

    // Update the name
    fireEvent.change(
      screen.getByLabelText(EDIT_ANNUITY_DIALOG_COPY.nameLabel),
      { target: { value: "New Name" } },
    );

    // Update the monthly amount
    fireEvent.change(
      screen.getByLabelText(EDIT_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
      { target: { value: "350" } },
    );

    fireEvent.click(screen.getByText(EDIT_ANNUITY_DIALOG_COPY.submitButton));

    await vi.waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        name: "New Name",
        monthlyAmount: 350,
      });
    });
  });
});
