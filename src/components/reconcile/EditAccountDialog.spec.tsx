import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

import { EditAccountDialogView } from "./EditAccountDialog";
import { EDIT_ACCOUNT_DIALOG_COPY } from "./EditAccountDialog.copy";

afterEach(cleanup);

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  tier: ReconciliationAccountTier.ShortTerm,
  name: "Chase Checking",
  onNameChange: vi.fn(),
  targetFloat: "2000",
  onTargetFloatChange: vi.fn(),
  nameError: undefined,
  targetFloatError: undefined,
  submitError: undefined,
  onSubmit: vi.fn(),
  isSubmitting: false,
};

describe("EditAccountDialogView — rendering", () => {
  it("renders the dialog title", () => {
    render(<EditAccountDialogView {...baseProps} />);
    expect(screen.getByText(EDIT_ACCOUNT_DIALOG_COPY.title)).toBeDefined();
  });

  it("renders the name field with current value", () => {
    render(<EditAccountDialogView {...baseProps} name="Chase Checking" />);
    expect(screen.getByDisplayValue("Chase Checking")).toBeDefined();
  });

  it("renders the target float field for cash accounts", () => {
    render(
      <EditAccountDialogView
        {...baseProps}
        tier={ReconciliationAccountTier.ShortTerm}
      />,
    );
    expect(
      screen.getByLabelText(EDIT_ACCOUNT_DIALOG_COPY.targetFloatLabel),
    ).toBeDefined();
  });

  it("hides the target float field for investment accounts", () => {
    render(
      <EditAccountDialogView
        {...baseProps}
        tier={ReconciliationAccountTier.Investment}
      />,
    );
    expect(
      screen.queryByLabelText(EDIT_ACCOUNT_DIALOG_COPY.targetFloatLabel),
    ).toBeNull();
  });

  it("renders the submit button", () => {
    render(<EditAccountDialogView {...baseProps} />);
    expect(
      screen.getByText(EDIT_ACCOUNT_DIALOG_COPY.submitButton),
    ).toBeDefined();
  });
});

describe("EditAccountDialogView — name field", () => {
  it("calls onNameChange when name field changes", () => {
    const onNameChange = vi.fn();
    render(
      <EditAccountDialogView {...baseProps} onNameChange={onNameChange} />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_ACCOUNT_DIALOG_COPY.nameLabel),
      {
        target: { value: "BOFA Checking" },
      },
    );
    expect(onNameChange).toHaveBeenCalledWith("BOFA Checking");
  });

  it("shows nameError when provided", () => {
    render(
      <EditAccountDialogView
        {...baseProps}
        nameError={EDIT_ACCOUNT_DIALOG_COPY.nameRequiredError}
      />,
    );
    expect(
      screen.getByText(EDIT_ACCOUNT_DIALOG_COPY.nameRequiredError),
    ).toBeDefined();
  });
});

describe("EditAccountDialogView — target float field", () => {
  it("calls onTargetFloatChange when field changes", () => {
    const onTargetFloatChange = vi.fn();
    render(
      <EditAccountDialogView
        {...baseProps}
        onTargetFloatChange={onTargetFloatChange}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_ACCOUNT_DIALOG_COPY.targetFloatLabel),
      { target: { value: "3000" } },
    );
    expect(onTargetFloatChange).toHaveBeenCalledWith("3000");
  });

  it("shows targetFloatError when provided", () => {
    render(
      <EditAccountDialogView
        {...baseProps}
        targetFloatError={EDIT_ACCOUNT_DIALOG_COPY.targetFloatInvalidError}
      />,
    );
    expect(
      screen.getByText(EDIT_ACCOUNT_DIALOG_COPY.targetFloatInvalidError),
    ).toBeDefined();
  });
});

describe("EditAccountDialogView — submit", () => {
  it("calls onSubmit when submit button is clicked", () => {
    const onSubmit = vi.fn();
    render(<EditAccountDialogView {...baseProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText(EDIT_ACCOUNT_DIALOG_COPY.submitButton));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows submitError when provided", () => {
    render(
      <EditAccountDialogView
        {...baseProps}
        submitError={EDIT_ACCOUNT_DIALOG_COPY.submitError}
      />,
    );
    expect(
      screen.getByText(EDIT_ACCOUNT_DIALOG_COPY.submitError),
    ).toBeDefined();
  });

  it("disables submit while isSubmitting", () => {
    render(<EditAccountDialogView {...baseProps} isSubmitting={true} />);
    const savingBtn = screen
      .getByText(EDIT_ACCOUNT_DIALOG_COPY.savingButton)
      .closest("button");
    expect(savingBtn?.disabled).toBe(true);
  });
});
