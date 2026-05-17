import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DeleteAccountDialogView } from "./DeleteAccountDialog";
import { DELETE_ACCOUNT_DIALOG_COPY } from "./DeleteAccountDialog.copy";

afterEach(cleanup);

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  accountName: "Chase Checking",
  onConfirm: vi.fn(),
  isDeleting: false,
  deleteError: undefined,
};

describe("DeleteAccountDialogView — rendering", () => {
  it("renders the dialog title", () => {
    render(<DeleteAccountDialogView {...baseProps} />);
    expect(screen.getByText(DELETE_ACCOUNT_DIALOG_COPY.title)).toBeDefined();
  });

  it("shows the account name in the confirmation message", () => {
    render(
      <DeleteAccountDialogView {...baseProps} accountName="Chase Checking" />,
    );
    expect(screen.getByText(/Chase Checking/)).toBeDefined();
  });

  it("renders the confirm delete button", () => {
    render(<DeleteAccountDialogView {...baseProps} />);
    expect(
      screen.getByText(DELETE_ACCOUNT_DIALOG_COPY.confirmButton),
    ).toBeDefined();
  });

  it("renders the cancel button", () => {
    render(<DeleteAccountDialogView {...baseProps} />);
    expect(
      screen.getByText(DELETE_ACCOUNT_DIALOG_COPY.cancelButton),
    ).toBeDefined();
  });
});

describe("DeleteAccountDialogView — actions", () => {
  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<DeleteAccountDialogView {...baseProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText(DELETE_ACCOUNT_DIALOG_COPY.confirmButton));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onOpenChange(false) when cancel is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <DeleteAccountDialogView {...baseProps} onOpenChange={onOpenChange} />,
    );
    fireEvent.click(screen.getByText(DELETE_ACCOUNT_DIALOG_COPY.cancelButton));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables confirm button while isDeleting", () => {
    render(<DeleteAccountDialogView {...baseProps} isDeleting={true} />);
    const deletingBtn = screen
      .getByText(DELETE_ACCOUNT_DIALOG_COPY.deletingButton)
      .closest("button");
    expect(deletingBtn?.disabled).toBe(true);
  });

  it("shows deleteError when provided", () => {
    render(
      <DeleteAccountDialogView
        {...baseProps}
        deleteError={DELETE_ACCOUNT_DIALOG_COPY.deleteError}
      />,
    );
    expect(
      screen.getByText(DELETE_ACCOUNT_DIALOG_COPY.deleteError),
    ).toBeDefined();
  });
});
