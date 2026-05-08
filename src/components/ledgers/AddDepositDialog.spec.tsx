import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { AddDepositDialogView } from "./AddDepositDialog";
import { ADD_DEPOSIT_DIALOG_COPY } from "./AddDepositDialog.copy";

afterEach(cleanup);

describe("AddDepositDialogView", () => {
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  describe("Criterion 1: An 'Add deposit' action opens a dialog/form", () => {
    it("renders the dialog title when open is true", () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByRole("heading", { name: ADD_DEPOSIT_DIALOG_COPY.title }),
      ).toBeDefined();
    });

    it("does not render when open is false", () => {
      render(
        <AddDepositDialogView
          open={false}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.queryByRole("heading", { name: ADD_DEPOSIT_DIALOG_COPY.title }),
      ).toBeNull();
    });
  });

  describe("Criterion 2: Form fields — date (defaults to today), amount, description", () => {
    it("renders the date field", () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.dateLabel),
      ).toBeDefined();
    });

    it("date field defaults to today", () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      const today = new Date().toISOString().slice(0, 10);
      const dateInput = screen.getByLabelText(
        ADD_DEPOSIT_DIALOG_COPY.dateLabel,
      );
      expect((dateInput as HTMLInputElement).value).toBe(today);
    });

    it("renders the amount field", () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
      ).toBeDefined();
    });

    it("renders the description field", () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
      ).toBeDefined();
    });
  });

  describe("Criterion 3: Submitting persists via service layer", () => {
    it("calls onSubmit with date, amount, and description when form is valid", async () => {
      const mockSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={mockSubmit}
          onClose={onClose}
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
      fireEvent.click(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      );

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
        <AddDepositDialogView
          open={true}
          onSubmit={mockSubmit}
          onClose={onClose}
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
      fireEvent.click(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      );

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
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.descriptionLabel),
        { target: { value: "Test" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      );
      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.amountRequiredError),
        ).toBeDefined();
      });
    });

    it("shows amount invalid error when amount is zero", async () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
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
      fireEvent.click(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      );
      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.amountInvalidError),
        ).toBeDefined();
      });
    });

    it("shows amount invalid error when amount is negative", async () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
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
      fireEvent.click(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      );
      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.amountInvalidError),
        ).toBeDefined();
      });
    });

    it("shows description required error when description is empty", async () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(ADD_DEPOSIT_DIALOG_COPY.amountLabel),
        { target: { value: "100" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      );
      await waitFor(() => {
        expect(
          screen.getByText(ADD_DEPOSIT_DIALOG_COPY.descriptionRequiredError),
        ).toBeDefined();
      });
    });

    it("does not call onSubmit when validation fails", async () => {
      const mockSubmit = vi.fn();
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={mockSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      );
      await waitFor(() => {
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe("Criterion 5: All user-facing strings in copy file", () => {
    it("renders submit button text from copy", () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
        }),
      ).toBeDefined();
    });

    it("renders cancel button text from copy", () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByRole("button", {
          name: ADD_DEPOSIT_DIALOG_COPY.cancelButton,
        }),
      ).toBeDefined();
    });

    it("disables submit button while isSubmitting is true", () => {
      render(
        <AddDepositDialogView
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={true}
        />,
      );
      const submitBtn = screen.getByRole("button", {
        name: ADD_DEPOSIT_DIALOG_COPY.submittingButton,
      });
      expect(submitBtn.getAttribute("disabled")).not.toBeNull();
    });
  });
});
