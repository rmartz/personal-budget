import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DeleteExpenseDialogView } from "./DeleteExpenseDialog";
import { DELETE_EXPENSE_DIALOG_COPY } from "./DeleteExpenseDialog.copy";

afterEach(cleanup);

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  expenseName: "Electric bill",
  onConfirm: vi.fn(),
  isDeleting: false,
  deleteError: undefined,
};

describe("DeleteExpenseDialogView — rendering", () => {
  it("renders the dialog title", () => {
    render(<DeleteExpenseDialogView {...baseProps} />);
    expect(screen.getByText(DELETE_EXPENSE_DIALOG_COPY.title)).toBeDefined();
  });

  it("shows the expense name in the confirmation message", () => {
    render(
      <DeleteExpenseDialogView {...baseProps} expenseName="Electric bill" />,
    );
    expect(screen.getByText(/Electric bill/)).toBeDefined();
  });

  it("renders the confirm button", () => {
    render(<DeleteExpenseDialogView {...baseProps} />);
    expect(
      screen.getByText(DELETE_EXPENSE_DIALOG_COPY.confirmButton),
    ).toBeDefined();
  });

  it("renders the cancel button", () => {
    render(<DeleteExpenseDialogView {...baseProps} />);
    expect(
      screen.getByText(DELETE_EXPENSE_DIALOG_COPY.cancelButton),
    ).toBeDefined();
  });
});

describe("DeleteExpenseDialogView — actions", () => {
  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<DeleteExpenseDialogView {...baseProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText(DELETE_EXPENSE_DIALOG_COPY.confirmButton));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onOpenChange(false) when cancel is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <DeleteExpenseDialogView {...baseProps} onOpenChange={onOpenChange} />,
    );
    fireEvent.click(screen.getByText(DELETE_EXPENSE_DIALOG_COPY.cancelButton));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables confirm button while isDeleting", () => {
    render(<DeleteExpenseDialogView {...baseProps} isDeleting={true} />);
    const deletingBtn = screen
      .getByText(DELETE_EXPENSE_DIALOG_COPY.deletingButton)
      .closest("button");
    expect(deletingBtn?.disabled).toBe(true);
  });

  it("shows deleteError when provided", () => {
    render(
      <DeleteExpenseDialogView
        {...baseProps}
        deleteError={DELETE_EXPENSE_DIALOG_COPY.deleteError}
      />,
    );
    expect(
      screen.getByText(DELETE_EXPENSE_DIALOG_COPY.deleteError),
    ).toBeDefined();
  });
});
