import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReconciliationExpense } from "@/lib/firebase/schema/reconciliation-expenses";
import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { EditExpenseDialog, EditExpenseDialogView } from "./EditExpenseDialog";
import { EDIT_EXPENSE_DIALOG_COPY } from "./EditExpenseDialog.copy";

afterEach(cleanup);

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  name: "Electric bill",
  onNameChange: vi.fn(),
  type: ReconciliationExpenseType.StatementBalance,
  onTypeChange: vi.fn(),
  typicalAmount: "120",
  onTypicalAmountChange: vi.fn(),
  nameError: undefined,
  typicalAmountError: undefined,
  submitError: undefined,
  onSubmit: vi.fn(),
  isSubmitting: false,
};

describe("EditExpenseDialogView — rendering", () => {
  it("renders the dialog title", () => {
    render(<EditExpenseDialogView {...baseProps} />);
    expect(screen.getByText(EDIT_EXPENSE_DIALOG_COPY.title)).toBeDefined();
  });

  it("renders the name field with current value", () => {
    render(<EditExpenseDialogView {...baseProps} name="Electric bill" />);
    expect(screen.getByDisplayValue("Electric bill")).toBeDefined();
  });

  it("renders the type toggle buttons", () => {
    render(<EditExpenseDialogView {...baseProps} />);
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.typeStatementBalance),
    ).toBeDefined();
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.typeRunningBalance),
    ).toBeDefined();
  });

  it("renders the amount field with current value", () => {
    render(<EditExpenseDialogView {...baseProps} typicalAmount="120" />);
    expect(screen.getByDisplayValue("120")).toBeDefined();
  });

  it("renders the submit button", () => {
    render(<EditExpenseDialogView {...baseProps} />);
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitButton),
    ).toBeDefined();
  });
});

describe("EditExpenseDialogView — name field", () => {
  it("calls onNameChange when name field changes", () => {
    const onNameChange = vi.fn();
    render(
      <EditExpenseDialogView {...baseProps} onNameChange={onNameChange} />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_EXPENSE_DIALOG_COPY.nameLabel),
      {
        target: { value: "Gas bill" },
      },
    );
    expect(onNameChange).toHaveBeenCalledWith("Gas bill");
  });

  it("shows nameError when provided", () => {
    render(
      <EditExpenseDialogView
        {...baseProps}
        nameError={EDIT_EXPENSE_DIALOG_COPY.nameRequiredError}
      />,
    );
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.nameRequiredError),
    ).toBeDefined();
  });
});

describe("EditExpenseDialogView — type selection", () => {
  it("calls onTypeChange with RunningBalance when that button is clicked", () => {
    const onTypeChange = vi.fn();
    render(
      <EditExpenseDialogView {...baseProps} onTypeChange={onTypeChange} />,
    );
    fireEvent.click(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.typeRunningBalance),
    );
    expect(onTypeChange).toHaveBeenCalledWith(
      ReconciliationExpenseType.RunningBalance,
    );
  });

  it("calls onTypeChange with StatementBalance when that button is clicked", () => {
    const onTypeChange = vi.fn();
    render(
      <EditExpenseDialogView
        {...baseProps}
        type={ReconciliationExpenseType.RunningBalance}
        onTypeChange={onTypeChange}
      />,
    );
    fireEvent.click(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.typeStatementBalance),
    );
    expect(onTypeChange).toHaveBeenCalledWith(
      ReconciliationExpenseType.StatementBalance,
    );
  });
});

describe("EditExpenseDialogView — amount field", () => {
  it("calls onTypicalAmountChange when field changes", () => {
    const onTypicalAmountChange = vi.fn();
    render(
      <EditExpenseDialogView
        {...baseProps}
        onTypicalAmountChange={onTypicalAmountChange}
      />,
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "250" } },
    );
    expect(onTypicalAmountChange).toHaveBeenCalledWith("250");
  });

  it("shows typicalAmountError when provided", () => {
    render(
      <EditExpenseDialogView
        {...baseProps}
        typicalAmountError={EDIT_EXPENSE_DIALOG_COPY.amountInvalidError}
      />,
    );
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.amountInvalidError),
    ).toBeDefined();
  });
});

describe("EditExpenseDialogView — submit", () => {
  it("calls onSubmit when submit button is clicked", () => {
    const onSubmit = vi.fn();
    render(<EditExpenseDialogView {...baseProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitButton));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows submitError when provided", () => {
    render(
      <EditExpenseDialogView
        {...baseProps}
        submitError={EDIT_EXPENSE_DIALOG_COPY.submitError}
      />,
    );
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitError),
    ).toBeDefined();
  });

  it("disables submit while isSubmitting", () => {
    render(<EditExpenseDialogView {...baseProps} isSubmitting={true} />);
    const savingBtn = screen
      .getByText(EDIT_EXPENSE_DIALOG_COPY.savingButton)
      .closest("button");
    expect(savingBtn?.disabled).toBe(true);
  });
});

function makeExpense(
  overrides: Partial<ReconciliationExpense> = {},
): ReconciliationExpense {
  return {
    id: "expense-1",
    name: "Electric bill",
    type: ReconciliationExpenseType.StatementBalance,
    typicalAmount: 120,
    ...overrides,
  };
}

function renderExpenseContainer(
  overrides: Partial<Parameters<typeof EditExpenseDialog>[0]> = {},
) {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const onOpenChange = vi.fn();
  const props = {
    open: true,
    onOpenChange,
    expense: makeExpense(),
    onSubmit: onSave,
    ...overrides,
  };
  const result = render(<EditExpenseDialog {...props} />);
  return { ...result, onSave, onOpenChange };
}

describe("EditExpenseDialog — validation", () => {
  it("shows name required error and does not call onSubmit when name is empty", () => {
    const { onSave } = renderExpenseContainer();
    fireEvent.change(
      screen.getByLabelText(EDIT_EXPENSE_DIALOG_COPY.nameLabel),
      { target: { value: "" } },
    );
    fireEvent.click(screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitButton));
    expect(onSave).not.toHaveBeenCalled();
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.nameRequiredError),
    ).toBeDefined();
  });

  it("shows amount error and does not call onSubmit when amount is invalid", () => {
    const { onSave } = renderExpenseContainer();
    fireEvent.change(
      screen.getByLabelText(EDIT_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "-10" } },
    );
    fireEvent.click(screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitButton));
    expect(onSave).not.toHaveBeenCalled();
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.amountInvalidError),
    ).toBeDefined();
  });
});

describe("EditExpenseDialog — submit", () => {
  it("calls onSubmit with correct id and values on valid submit", async () => {
    const { onSave } = renderExpenseContainer({
      expense: makeExpense({
        id: "expense-42",
        name: "Gas bill",
        type: ReconciliationExpenseType.RunningBalance,
        typicalAmount: 80,
      }),
    });
    fireEvent.change(
      screen.getByLabelText(EDIT_EXPENSE_DIALOG_COPY.nameLabel),
      { target: { value: "Updated Gas" } },
    );
    fireEvent.change(
      screen.getByLabelText(EDIT_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "95" } },
    );
    fireEvent.click(screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("expense-42", {
        name: "Updated Gas",
        type: ReconciliationExpenseType.RunningBalance,
        typicalAmount: 95,
      });
    });
  });

  it("shows submit error when onSubmit rejects", async () => {
    const { onSave } = renderExpenseContainer();
    onSave.mockRejectedValue(new Error("Network error"));
    fireEvent.click(screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitButton));
    await waitFor(() => {
      expect(
        screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitError),
      ).toBeDefined();
    });
  });
});

describe("EditExpenseDialog — form reset on close", () => {
  it("clears errors when the dialog is closed", () => {
    const { onOpenChange } = renderExpenseContainer();
    fireEvent.change(
      screen.getByLabelText(EDIT_EXPENSE_DIALOG_COPY.nameLabel),
      { target: { value: "" } },
    );
    fireEvent.click(screen.getByText(EDIT_EXPENSE_DIALOG_COPY.submitButton));
    expect(
      screen.getByText(EDIT_EXPENSE_DIALOG_COPY.nameRequiredError),
    ).toBeDefined();
    fireEvent.click(screen.getByText(EDIT_EXPENSE_DIALOG_COPY.cancelButton));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
