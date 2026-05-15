import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { CreateExpenseDialogView } from "./CreateExpenseDialog";
import { CREATE_EXPENSE_DIALOG_COPY } from "./CreateExpenseDialog.copy";

afterEach(cleanup);

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  name: "",
  onNameChange: vi.fn(),
  type: ReconciliationExpenseType.StatementBalance,
  onTypeChange: vi.fn(),
  typicalAmount: "",
  onTypicalAmountChange: vi.fn(),
  nameError: undefined,
  typicalAmountError: undefined,
  submitError: undefined,
  onSubmit: vi.fn(),
  isSubmitting: false,
};

describe("CreateExpenseDialogView — opening the creation form", () => {
  it("renders the dialog title", () => {
    render(<CreateExpenseDialogView {...baseProps} />);
    expect(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.title)).toBeDefined();
  });

  it("renders the name field", () => {
    render(<CreateExpenseDialogView {...baseProps} />);
    expect(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.nameLabel),
    ).toBeDefined();
  });

  it("renders the type field", () => {
    render(<CreateExpenseDialogView {...baseProps} />);
    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.typeLabel),
    ).toBeDefined();
  });

  it("renders the monthly amount field", () => {
    render(<CreateExpenseDialogView {...baseProps} />);
    expect(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.amountLabel),
    ).toBeDefined();
  });
});

describe("CreateExpenseDialogView — name field", () => {
  it("calls onNameChange when the name field changes", () => {
    const onNameChange = vi.fn();
    render(
      <CreateExpenseDialogView {...baseProps} onNameChange={onNameChange} />,
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.nameLabel),
      { target: { value: "Electric bill" } },
    );
    expect(onNameChange).toHaveBeenCalledWith("Electric bill");
  });

  it("shows nameError when provided", () => {
    render(
      <CreateExpenseDialogView
        {...baseProps}
        nameError={CREATE_EXPENSE_DIALOG_COPY.nameRequiredError}
      />,
    );
    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.nameRequiredError),
    ).toBeDefined();
  });
});

describe("CreateExpenseDialogView — type selection", () => {
  it("renders the statement type button", () => {
    render(<CreateExpenseDialogView {...baseProps} />);
    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.typeStatementBalance),
    ).toBeDefined();
  });

  it("renders the running balance type button", () => {
    render(<CreateExpenseDialogView {...baseProps} />);
    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.typeRunningBalance),
    ).toBeDefined();
  });

  it("calls onTypeChange when running balance type is selected", () => {
    const onTypeChange = vi.fn();
    render(
      <CreateExpenseDialogView {...baseProps} onTypeChange={onTypeChange} />,
    );
    fireEvent.click(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.typeRunningBalance),
    );
    expect(onTypeChange).toHaveBeenCalledWith(
      ReconciliationExpenseType.RunningBalance,
    );
  });

  it("calls onTypeChange when statement type is selected", () => {
    const onTypeChange = vi.fn();
    render(
      <CreateExpenseDialogView
        {...baseProps}
        type={ReconciliationExpenseType.RunningBalance}
        onTypeChange={onTypeChange}
      />,
    );
    fireEvent.click(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.typeStatementBalance),
    );
    expect(onTypeChange).toHaveBeenCalledWith(
      ReconciliationExpenseType.StatementBalance,
    );
  });
});

describe("CreateExpenseDialogView — monthly amount field", () => {
  it("calls onTypicalAmountChange when the amount field changes", () => {
    const onTypicalAmountChange = vi.fn();
    render(
      <CreateExpenseDialogView
        {...baseProps}
        onTypicalAmountChange={onTypicalAmountChange}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "350" } },
    );
    expect(onTypicalAmountChange).toHaveBeenCalledWith("350");
  });

  it("shows typicalAmountError when provided", () => {
    render(
      <CreateExpenseDialogView
        {...baseProps}
        typicalAmountError={CREATE_EXPENSE_DIALOG_COPY.amountInvalidError}
      />,
    );
    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.amountInvalidError),
    ).toBeDefined();
  });
});

describe("CreateExpenseDialogView — submit", () => {
  it("renders the submit button", () => {
    render(<CreateExpenseDialogView {...baseProps} />);
    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton),
    ).toBeDefined();
  });

  it("calls onSubmit when the form is submitted", () => {
    const onSubmit = vi.fn();
    render(<CreateExpenseDialogView {...baseProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows submitError when provided", () => {
    render(
      <CreateExpenseDialogView
        {...baseProps}
        submitError={CREATE_EXPENSE_DIALOG_COPY.submitError}
      />,
    );
    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitError),
    ).toBeDefined();
  });

  it("disables submit and cancel while isSubmitting", () => {
    render(<CreateExpenseDialogView {...baseProps} isSubmitting={true} />);
    const creatingBtn = screen
      .getByText(CREATE_EXPENSE_DIALOG_COPY.creatingButton)
      .closest("button");
    expect(creatingBtn?.disabled).toBe(true);
  });
});

describe("CreateExpenseDialog integration — submitting persists via service layer", () => {
  it("calls onSubmit with name, type, and typicalAmount", async () => {
    const { CreateExpenseDialog } = await import("./CreateExpenseDialog");
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CreateExpenseDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.nameLabel),
      { target: { value: "Electric bill" } },
    );
    fireEvent.click(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.typeRunningBalance),
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "120" } },
    );
    fireEvent.click(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton));

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Electric bill",
        type: ReconciliationExpenseType.RunningBalance,
        typicalAmount: 120,
      });
    });
  });
});
