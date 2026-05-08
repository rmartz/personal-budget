"use client";

import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { ADD_EXPENSE_DIALOG_COPY } from "./AddExpenseDialog.copy";

afterEach(cleanup);

describe("AddExpenseDialog — An 'Add expense' action on the ledger detail page opens a dialog/form", () => {
  it("renders the dialog title when open", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    expect(screen.getByText(ADD_EXPENSE_DIALOG_COPY.title)).toBeDefined();
  });

  it("does not render the dialog when closed", () => {
    render(
      <AddExpenseDialog
        open={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    expect(screen.queryByText(ADD_EXPENSE_DIALOG_COPY.title)).toBeNull();
  });
});

describe("AddExpenseDialog — Form fields: date (defaults to today), amount (required, positive), description (required)", () => {
  it("renders the date field", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    expect(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.dateLabel),
    ).toBeDefined();
  });

  it("defaults the date field to today", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    const today = new Date().toISOString().split("T")[0];
    const dateInput = screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.dateLabel);
    expect((dateInput as HTMLInputElement).value).toBe(today);
  });

  it("renders the amount field", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    expect(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.amountLabel),
    ).toBeDefined();
  });

  it("renders the description field", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    expect(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.descriptionLabel),
    ).toBeDefined();
  });
});

describe("AddExpenseDialog — Validation: amount must be a positive number; description must be non-empty", () => {
  it("shows amount required error when submitting with empty amount", async () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.descriptionLabel),
      { target: { value: "Groceries" } },
    );
    fireEvent.click(screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(
        screen.getByText(ADD_EXPENSE_DIALOG_COPY.amountRequiredError),
      ).toBeDefined();
    });
  });

  it("shows amount invalid error when submitting with zero amount", async () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "0" } },
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.descriptionLabel),
      { target: { value: "Groceries" } },
    );
    fireEvent.click(screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(
        screen.getByText(ADD_EXPENSE_DIALOG_COPY.amountInvalidError),
      ).toBeDefined();
    });
  });

  it("shows amount invalid error when submitting with negative amount", async () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "-50" } },
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.descriptionLabel),
      { target: { value: "Groceries" } },
    );
    fireEvent.click(screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(
        screen.getByText(ADD_EXPENSE_DIALOG_COPY.amountInvalidError),
      ).toBeDefined();
    });
  });

  it("shows description required error when submitting with empty description", async () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "25" } },
    );
    fireEvent.click(screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(
        screen.getByText(ADD_EXPENSE_DIALOG_COPY.descriptionRequiredError),
      ).toBeDefined();
    });
  });

  it("does not call onSubmit when validation fails", async () => {
    const mockSubmit = vi.fn();
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={mockSubmit}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    fireEvent.click(screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(
        screen.getByText(ADD_EXPENSE_DIALOG_COPY.amountRequiredError),
      ).toBeDefined();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});

describe("AddExpenseDialog — Submitting persists the transaction via the service layer and updates the list immediately", () => {
  it("calls onSubmit with correct expense data when form is valid", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={mockSubmit}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    fireEvent.change(screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.dateLabel), {
      target: { value: "2024-03-15" },
    });
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "42.50" } },
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.descriptionLabel),
      { target: { value: "Coffee" } },
    );
    fireEvent.click(screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        date: new Date("2024-03-15"),
        amount: 42.5,
        description: "Coffee",
      });
    });
  });

  it("shows submit error when onSubmit rejects", async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error("Firebase error"));
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={mockSubmit}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "10" } },
    );
    fireEvent.change(
      screen.getByLabelText(ADD_EXPENSE_DIALOG_COPY.descriptionLabel),
      { target: { value: "Snack" } },
    );
    fireEvent.click(screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(
        screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitError),
      ).toBeDefined();
    });
  });

  it("disables the submit button while isSubmitting is true", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={true}
      />,
    );
    const submitBtn = screen
      .getByText(ADD_EXPENSE_DIALOG_COPY.submittingButton)
      .closest("button");
    expect(submitBtn?.disabled).toBe(true);
  });

  it("disables the cancel button while isSubmitting is true", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={true}
      />,
    );
    const cancelBtn = screen
      .getByText(ADD_EXPENSE_DIALOG_COPY.cancelButton)
      .closest("button");
    expect(cancelBtn?.disabled).toBe(true);
  });
});

describe("AddExpenseDialog — All user-facing strings in a co-located copy file", () => {
  it("renders the cancel button from copy", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    expect(
      screen.getByText(ADD_EXPENSE_DIALOG_COPY.cancelButton),
    ).toBeDefined();
  });

  it("renders the submit button from copy", () => {
    render(
      <AddExpenseDialog
        open={true}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    );
    expect(
      screen.getByText(ADD_EXPENSE_DIALOG_COPY.submitButton),
    ).toBeDefined();
  });
});
