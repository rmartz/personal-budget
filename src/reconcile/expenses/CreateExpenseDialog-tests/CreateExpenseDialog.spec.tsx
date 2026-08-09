import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { CREATE_EXPENSE_DIALOG_COPY } from "../CreateExpenseDialog.copy";

afterEach(cleanup);

describe("CreateExpenseDialog — container integration", () => {
  it("calls onSubmit prop with name, type, and typicalAmount when form is valid", async () => {
    const { CreateExpenseDialog } = await import("../CreateExpenseDialog");
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

  it("shows name required error and does not call onSubmit when name is empty", async () => {
    const { CreateExpenseDialog } = await import("../CreateExpenseDialog");
    const onSubmit = vi.fn();

    render(
      <CreateExpenseDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "100" } },
    );
    fireEvent.click(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton));

    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.nameRequiredError),
    ).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows amount invalid error and does not call onSubmit when amount is invalid", async () => {
    const { CreateExpenseDialog } = await import("../CreateExpenseDialog");
    const onSubmit = vi.fn();

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
    fireEvent.click(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton));

    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.amountInvalidError),
    ).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows amount invalid error and does not call onSubmit when amount is zero", async () => {
    const { CreateExpenseDialog } = await import("../CreateExpenseDialog");
    const onSubmit = vi.fn();

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
    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "0" } },
    );
    fireEvent.click(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton));

    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.amountInvalidError),
    ).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows amount invalid error and does not call onSubmit when amount is negative", async () => {
    const { CreateExpenseDialog } = await import("../CreateExpenseDialog");
    const onSubmit = vi.fn();

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
    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "-5" } },
    );
    fireEvent.click(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton));

    expect(
      screen.getByText(CREATE_EXPENSE_DIALOG_COPY.amountInvalidError),
    ).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onOpenChange with false after a successful submit", async () => {
    const { CreateExpenseDialog } = await import("../CreateExpenseDialog");
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();

    render(
      <CreateExpenseDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.nameLabel),
      { target: { value: "Electric bill" } },
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "120" } },
    );
    fireEvent.click(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton));

    await vi.waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("shows submit error and does not call onOpenChange when onSubmit rejects", async () => {
    const { CreateExpenseDialog } = await import("../CreateExpenseDialog");
    const onSubmit = vi.fn().mockRejectedValue(new Error("network error"));
    const onOpenChange = vi.fn();

    render(
      <CreateExpenseDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.nameLabel),
      { target: { value: "Electric bill" } },
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_EXPENSE_DIALOG_COPY.amountLabel),
      { target: { value: "120" } },
    );
    fireEvent.click(screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitButton));

    await vi.waitFor(() => {
      expect(
        screen.getByText(CREATE_EXPENSE_DIALOG_COPY.submitError),
      ).toBeDefined();
    });
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
