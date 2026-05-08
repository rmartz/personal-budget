"use client";

import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { EditTransactionDialogView } from "./EditTransactionDialog";
import { EDIT_TRANSACTION_DIALOG_COPY } from "./EditTransactionDialog.copy";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

afterEach(cleanup);

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  isSubmitting: false,
  date: "2024-03-15",
  onDateChange: vi.fn(),
  amount: "42.50",
  onAmountChange: vi.fn(),
  description: "Coffee",
  onDescriptionChange: vi.fn(),
  amountError: undefined,
  descriptionError: undefined,
  submitError: undefined,
  onSubmit: vi.fn(),
  transactionType: BudgetLedgerTransactionType.Expense,
};

describe("EditTransactionDialog — An edit action on each transaction row opens a pre-populated edit dialog", () => {
  it("renders the dialog title when open", () => {
    render(<EditTransactionDialogView {...defaultProps} />);
    expect(screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.title)).toBeDefined();
  });

  it("does not render the dialog when closed", () => {
    render(<EditTransactionDialogView {...defaultProps} open={false} />);
    expect(screen.queryByText(EDIT_TRANSACTION_DIALOG_COPY.title)).toBeNull();
  });

  it("pre-populates the date field with initial date", () => {
    render(<EditTransactionDialogView {...defaultProps} date="2024-06-20" />);
    const dateInput = screen.getByLabelText(
      EDIT_TRANSACTION_DIALOG_COPY.dateLabel,
    );
    expect((dateInput as HTMLInputElement).value).toBe("2024-06-20");
  });

  it("pre-populates the amount field with initial amount", () => {
    render(<EditTransactionDialogView {...defaultProps} amount="99.99" />);
    const amountInput = screen.getByLabelText(
      EDIT_TRANSACTION_DIALOG_COPY.amountLabel,
    );
    expect((amountInput as HTMLInputElement).value).toBe("99.99");
  });

  it("pre-populates the description field with initial description", () => {
    render(
      <EditTransactionDialogView {...defaultProps} description="Paycheck" />,
    );
    const descriptionInput = screen.getByLabelText(
      EDIT_TRANSACTION_DIALOG_COPY.descriptionLabel,
    );
    expect((descriptionInput as HTMLInputElement).value).toBe("Paycheck");
  });
});

describe("EditTransactionDialog — Editable fields: date, amount, description (transaction type is not editable)", () => {
  it("renders the date field", () => {
    render(<EditTransactionDialogView {...defaultProps} />);
    expect(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.dateLabel),
    ).toBeDefined();
  });

  it("renders the amount field", () => {
    render(<EditTransactionDialogView {...defaultProps} />);
    expect(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.amountLabel),
    ).toBeDefined();
  });

  it("renders the description field", () => {
    render(<EditTransactionDialogView {...defaultProps} />);
    expect(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.descriptionLabel),
    ).toBeDefined();
  });

  it("calls onDateChange when the date field changes", () => {
    const onDateChange = vi.fn();
    render(
      <EditTransactionDialogView
        {...defaultProps}
        onDateChange={onDateChange}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.dateLabel),
      { target: { value: "2024-07-04" } },
    );
    expect(onDateChange).toHaveBeenCalledWith("2024-07-04");
  });

  it("calls onAmountChange when the amount field changes", () => {
    const onAmountChange = vi.fn();
    render(
      <EditTransactionDialogView
        {...defaultProps}
        onAmountChange={onAmountChange}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.amountLabel),
      { target: { value: "150" } },
    );
    expect(onAmountChange).toHaveBeenCalledWith("150");
  });

  it("calls onDescriptionChange when the description field changes", () => {
    const onDescriptionChange = vi.fn();
    render(
      <EditTransactionDialogView
        {...defaultProps}
        onDescriptionChange={onDescriptionChange}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.descriptionLabel),
      { target: { value: "Rent" } },
    );
    expect(onDescriptionChange).toHaveBeenCalledWith("Rent");
  });

  it("does not render an editable transaction type field", () => {
    render(<EditTransactionDialogView {...defaultProps} />);
    expect(screen.queryByLabelText(/type/i)).toBeNull();
  });
});

describe("EditTransactionDialog — Saving persists changes via the service layer; running balance recalculates immediately", () => {
  it("calls onSubmit when form is submitted", () => {
    const onSubmit = vi.fn();
    render(<EditTransactionDialogView {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: EDIT_TRANSACTION_DIALOG_COPY.submitButton,
      }),
    );
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows the submit error when submitError prop is set", () => {
    render(
      <EditTransactionDialogView
        {...defaultProps}
        submitError={EDIT_TRANSACTION_DIALOG_COPY.submitError}
      />,
    );
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.submitError),
    ).toBeDefined();
  });

  it("shows the amount error when amountError prop is set", () => {
    render(
      <EditTransactionDialogView
        {...defaultProps}
        amountError={EDIT_TRANSACTION_DIALOG_COPY.amountRequiredError}
      />,
    );
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.amountRequiredError),
    ).toBeDefined();
  });

  it("shows the description error when descriptionError prop is set", () => {
    render(
      <EditTransactionDialogView
        {...defaultProps}
        descriptionError={EDIT_TRANSACTION_DIALOG_COPY.descriptionRequiredError}
      />,
    );
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.descriptionRequiredError),
    ).toBeDefined();
  });

  it("disables the submit button while isSubmitting is true", () => {
    render(<EditTransactionDialogView {...defaultProps} isSubmitting={true} />);
    const submitBtn = screen
      .getByText(EDIT_TRANSACTION_DIALOG_COPY.submittingButton)
      .closest("button");
    expect(submitBtn?.disabled).toBe(true);
  });
});

describe("EditTransactionDialog — Cancelling discards changes without saving", () => {
  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    render(<EditTransactionDialogView {...defaultProps} onClose={onClose} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: EDIT_TRANSACTION_DIALOG_COPY.cancelButton,
      }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("disables the cancel button while isSubmitting is true", () => {
    render(<EditTransactionDialogView {...defaultProps} isSubmitting={true} />);
    const cancelBtn = screen
      .getByText(EDIT_TRANSACTION_DIALOG_COPY.cancelButton)
      .closest("button");
    expect(cancelBtn?.disabled).toBe(true);
  });
});

describe("EditTransactionDialog — All user-facing strings in a co-located copy file", () => {
  it("renders the dialog title from copy", () => {
    render(<EditTransactionDialogView {...defaultProps} />);
    expect(screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.title)).toBeDefined();
  });

  it("renders the cancel button from copy", () => {
    render(<EditTransactionDialogView {...defaultProps} />);
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.cancelButton),
    ).toBeDefined();
  });

  it("renders the submit button from copy", () => {
    render(<EditTransactionDialogView {...defaultProps} />);
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.submitButton),
    ).toBeDefined();
  });
});
