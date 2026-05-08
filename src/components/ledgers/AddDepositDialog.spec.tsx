import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { AddDepositDialog, AddDepositDialogView } from "./AddDepositDialog";
import { ADD_DEPOSIT_DIALOG_COPY } from "./AddDepositDialog.copy";

afterEach(cleanup);

const today = new Date().toISOString().slice(0, 10);

function renderView(
  overrides: Partial<Parameters<typeof AddDepositDialogView>[0]> = {},
) {
  const props = {
    open: true,
    onClose: vi.fn(),
    isSubmitting: false,
    date: today,
    onDateChange: vi.fn(),
    amount: "",
    onAmountChange: vi.fn(),
    description: "",
    onDescriptionChange: vi.fn(),
    amountError: undefined,
    descriptionError: undefined,
    submitError: undefined,
    onSubmit: vi.fn(),
    ...overrides,
  };
  render(<AddDepositDialogView {...props} />);
  return props;
}

describe("AddDepositDialogView", () => {
  describe("Criterion 1: An 'Add deposit' action opens a dialog/form", () => {
    it("renders the dialog title when open is true", () => {
      renderView();
      expect(
        screen.getByRole("heading", { name: ADD_DEPOSIT_DIALOG_COPY.title }),
      ).toBeDefined();
    });

    it("does not render when open is false", () => {
      renderView({ open: false });
      expect(
        screen.queryByRole("heading", { name: ADD_DEPOSIT_DIALOG_COPY.title }),
      ).toBeNull();
    });
  });

  describe("Criterion 2: Form fields — date (defaults to today), amount, description", () => {
    it("renders the date field", () => {
      renderView();
      expect(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.dateLabel),
      ).toBeDefined();
    });

    it("date field reflects the date prop", () => {
      renderView({ date: "2024-03-15" });
      const dateInput = screen.getByLabelText(
        ADD_DEPOSIT_DIALOG_COPY.dateLabel,
      );
      expect((dateInput as HTMLInputElement).value).toBe("2024-03-15");
    });

    it("renders the amount field", () => {
      renderView();
      expect(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
      ).toBeDefined();
    });

    it("renders the description field", () => {
      renderView();
      expect(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
      ).toBeDefined();
    });
  });

  describe("validation error display", () => {
    it("renders the amount error message when amountError is set", () => {
      renderView({ amountError: ADD_DEPOSIT_DIALOG_COPY.amountRequiredError });
      expect(
        screen.getByText(ADD_DEPOSIT_DIALOG_COPY.amountRequiredError),
      ).toBeDefined();
    });

    it("does not render amount error when amountError is undefined", () => {
      renderView({ amountError: undefined });
      expect(
        screen.queryByText(ADD_DEPOSIT_DIALOG_COPY.amountRequiredError),
      ).toBeNull();
    });

    it("renders the description error message when descriptionError is set", () => {
      renderView({
        descriptionError: ADD_DEPOSIT_DIALOG_COPY.descriptionRequiredError,
      });
      expect(
        screen.getByText(ADD_DEPOSIT_DIALOG_COPY.descriptionRequiredError),
      ).toBeDefined();
    });

    it("does not render description error when descriptionError is undefined", () => {
      renderView({ descriptionError: undefined });
      expect(
        screen.queryByText(ADD_DEPOSIT_DIALOG_COPY.descriptionRequiredError),
      ).toBeNull();
    });

    it("renders the submit error message when submitError is set", () => {
      renderView({ submitError: ADD_DEPOSIT_DIALOG_COPY.submitError });
      expect(
        screen.getByText(ADD_DEPOSIT_DIALOG_COPY.submitError),
      ).toBeDefined();
    });

    it("does not render submit error when submitError is undefined", () => {
      renderView({ submitError: undefined });
      expect(
        screen.queryByText(ADD_DEPOSIT_DIALOG_COPY.submitError),
      ).toBeNull();
    });
  });

  describe("Criterion 5: All user-facing strings in copy file", () => {
    it("renders submit button text from copy", () => {
      renderView();
      expect(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      ).toBeDefined();
    });

    it("renders cancel button text from copy", () => {
      renderView();
      expect(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.cancelButton,
        }),
      ).toBeDefined();
    });

    it("disables submit button while isSubmitting is true", () => {
      renderView({ isSubmitting: true });
      const submitBtn = screen.getByRole("button", {
        name: ADD_DEPOSIT_DIALOG_COPY.submittingButton,
      });
      expect(submitBtn.getAttribute("disabled")).not.toBeNull();
    });

    it("disables cancel button while isSubmitting is true", () => {
      renderView({ isSubmitting: true });
      const cancelBtn = screen.getByRole("button", {
        name: ADD_DEPOSIT_DIALOG_COPY.cancelButton,
      });
      expect(cancelBtn.getAttribute("disabled")).not.toBeNull();
    });
  });

  describe("interactions", () => {
    it("calls onSubmit when the form is submitted", () => {
      const onSubmit = vi.fn();
      renderView({ onSubmit });
      fireEvent.submit(document.querySelector("form")!);
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    it("calls onAmountChange when the amount input changes", () => {
      const onAmountChange = vi.fn();
      renderView({ onAmountChange });
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
        { target: { value: "100" } },
      );
      expect(onAmountChange).toHaveBeenCalledWith("100");
    });

    it("calls onDescriptionChange when the description input changes", () => {
      const onDescriptionChange = vi.fn();
      renderView({ onDescriptionChange });
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
        { target: { value: "Paycheck" } },
      );
      expect(onDescriptionChange).toHaveBeenCalledWith("Paycheck");
    });
  });
});

describe("AddDepositDialog", () => {
  describe("Criterion 3: Submitting persists via service layer", () => {
    it("calls onSubmit with date, amount, and description when form is valid", async () => {
      const mockSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <AddDepositDialog
          open={true}
          onSubmit={mockSubmit}
          onOpenChange={vi.fn()}
          isSubmitting={false}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
        { target: { value: "150.00" } },
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
        { target: { value: "Paycheck" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 150,
            description: "Paycheck",
          }),
        );
      });
    });

    it("shows submit error when onSubmit rejects", async () => {
      const mockSubmit = vi.fn().mockRejectedValue(new Error("Firebase error"));
      render(
        <AddDepositDialog
          open={true}
          onSubmit={mockSubmit}
          onOpenChange={vi.fn()}
          isSubmitting={false}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
        { target: { value: "50" } },
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
        { target: { value: "Deposit" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
    });
  });

  describe("Criterion 4: Validation — amount positive, description non-empty", () => {
    it("shows amount required error when amount is empty", async () => {
      render(
        <AddDepositDialog
          open={true}
          onSubmit={vi.fn()}
          onOpenChange={vi.fn()}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
        { target: { value: "Test" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.amountRequiredError),
        ).toBeDefined();
      });
    });

    it("shows amount invalid error when amount is zero", async () => {
      render(
        <AddDepositDialog
          open={true}
          onSubmit={vi.fn()}
          onOpenChange={vi.fn()}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
        { target: { value: "0" } },
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
        { target: { value: "Test" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.amountInvalidError),
        ).toBeDefined();
      });
    });

    it("shows amount invalid error when amount is negative", async () => {
      render(
        <AddDepositDialog
          open={true}
          onSubmit={vi.fn()}
          onOpenChange={vi.fn()}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
        { target: { value: "-10" } },
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
        { target: { value: "Test" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.amountInvalidError),
        ).toBeDefined();
      });
    });

    it("shows description required error when description is empty", async () => {
      render(
        <AddDepositDialog
          open={true}
          onSubmit={vi.fn()}
          onOpenChange={vi.fn()}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
        { target: { value: "100" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.descriptionRequiredError),
        ).toBeDefined();
      });
    });

    it("does not call onSubmit when validation fails", async () => {
      const mockSubmit = vi.fn();
      render(
        <AddDepositDialog
          open={true}
          onSubmit={mockSubmit}
          onOpenChange={vi.fn()}
          isSubmitting={false}
        />,
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
