"use client";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  EditTransactionDialog,
  EditTransactionDialogView,
} from "./EditTransactionDialog";
import { EDIT_TRANSACTION_DIALOG_COPY } from "./EditTransactionDialog.copy";

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
  dateError: undefined,
  amountError: undefined,
  descriptionError: undefined,
  submitError: undefined,
  onSubmit: vi.fn(),
};

const containerDefaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  isSubmitting: false,
  initialDate: new Date("2024-03-15T00:00:00"),
  initialAmount: 42.5,
  initialDescription: "Coffee",
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

describe("EditTransactionDialog container — validation", () => {
  it("shows the amount-required error when the amount is empty on submit", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditTransactionDialog
        {...containerDefaultProps}
        initialAmount={42.5}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.amountLabel),
      { target: { value: "" } },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: EDIT_TRANSACTION_DIALOG_COPY.submitButton,
      }),
    );
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.amountRequiredError),
    ).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the amount-invalid error when the amount is not a positive number", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditTransactionDialog {...containerDefaultProps} onSubmit={onSubmit} />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.amountLabel),
      { target: { value: "-5" } },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: EDIT_TRANSACTION_DIALOG_COPY.submitButton,
      }),
    );
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.amountInvalidError),
    ).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the description-required error when the description is blank on submit", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditTransactionDialog
        {...containerDefaultProps}
        initialDescription="Coffee"
        onSubmit={onSubmit}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.descriptionLabel),
      { target: { value: "   " } },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: EDIT_TRANSACTION_DIALOG_COPY.submitButton,
      }),
    );
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.descriptionRequiredError),
    ).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the submit error when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("boom"));
    render(
      <EditTransactionDialog {...containerDefaultProps} onSubmit={onSubmit} />,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: EDIT_TRANSACTION_DIALOG_COPY.submitButton,
      }),
    );
    await waitFor(() => {
      expect(
        screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.submitError),
      ).toBeDefined();
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("submits the parsed values and closes when onSubmit resolves", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();
    render(
      <EditTransactionDialog
        {...containerDefaultProps}
        initialDate={new Date("2024-03-15T00:00:00")}
        initialAmount={42.5}
        initialDescription="Coffee"
        onSubmit={onSubmit}
        onOpenChange={onOpenChange}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.amountLabel),
      { target: { value: "100" } },
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.descriptionLabel),
      { target: { value: "Rent" } },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: EDIT_TRANSACTION_DIALOG_COPY.submitButton,
      }),
    );
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenCalledWith({
      date: new Date("2024-03-15T00:00:00"),
      amount: 100,
      description: "Rent",
    });
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("pre-populates the date input using local-date components (no timezone shift)", () => {
    render(
      <EditTransactionDialog
        {...containerDefaultProps}
        initialDate={new Date(2024, 2, 15, 0, 0, 0)}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />,
    );
    const dateInput = screen.getByLabelText(
      EDIT_TRANSACTION_DIALOG_COPY.dateLabel,
    );
    expect((dateInput as HTMLInputElement).value).toBe("2024-03-15");
  });

  it("shows the date-required error when the date is empty on submit", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditTransactionDialog {...containerDefaultProps} onSubmit={onSubmit} />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_TRANSACTION_DIALOG_COPY.dateLabel),
      { target: { value: "" } },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: EDIT_TRANSACTION_DIALOG_COPY.submitButton,
      }),
    );
    expect(
      screen.getByText(EDIT_TRANSACTION_DIALOG_COPY.dateRequiredError),
    ).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("EditTransactionDialog container — state sync across transactions", () => {
  it("resyncs inputs when the initial* props change while the dialog stays mounted", () => {
    const { rerender } = render(
      <EditTransactionDialog
        open={true}
        onOpenChange={() => undefined}
        onSubmit={() => Promise.resolve()}
        isSubmitting={false}
        initialDate={new Date(2024, 2, 15, 0, 0, 0)}
        initialAmount={42.5}
        initialDescription="Coffee"
      />,
    );
    const descriptionInputA = screen.getByLabelText(
      EDIT_TRANSACTION_DIALOG_COPY.descriptionLabel,
    );
    expect((descriptionInputA as HTMLInputElement).value).toBe("Coffee");

    rerender(
      <EditTransactionDialog
        open={true}
        onOpenChange={() => undefined}
        onSubmit={() => Promise.resolve()}
        isSubmitting={false}
        initialDate={new Date(2024, 6, 4, 0, 0, 0)}
        initialAmount={1000}
        initialDescription="Paycheck"
      />,
    );

    const dateInputB = screen.getByLabelText(
      EDIT_TRANSACTION_DIALOG_COPY.dateLabel,
    );
    expect((dateInputB as HTMLInputElement).value).toBe("2024-07-04");
    const amountInputB = screen.getByLabelText(
      EDIT_TRANSACTION_DIALOG_COPY.amountLabel,
    );
    expect((amountInputB as HTMLInputElement).value).toBe("1000");
    const descriptionInputB = screen.getByLabelText(
      EDIT_TRANSACTION_DIALOG_COPY.descriptionLabel,
    );
    expect((descriptionInputB as HTMLInputElement).value).toBe("Paycheck");
  });
});
