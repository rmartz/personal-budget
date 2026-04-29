import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { CreateLedgerDialog } from "./CreateLedgerDialog";
import { CREATE_LEDGER_DIALOG_COPY } from "./copy";

afterEach(cleanup);

describe("CreateLedgerDialog", () => {
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  describe("rendering", () => {
    it("renders the dialog title", () => {
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(screen.getByText(CREATE_LEDGER_DIALOG_COPY.title)).toBeDefined();
    });

    it("renders the name field", () => {
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.nameLabel),
      ).toBeDefined();
    });

    it("renders the cash cap field", () => {
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.cashCapLabel),
      ).toBeDefined();
    });

    it("renders the submit button", () => {
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByText(CREATE_LEDGER_DIALOG_COPY.submitButton),
      ).toBeDefined();
    });

    it("renders the cancel button", () => {
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      expect(
        screen.getByText(CREATE_LEDGER_DIALOG_COPY.cancelButton),
      ).toBeDefined();
    });
  });

  describe("validation", () => {
    it("shows name required error when submitting with empty name", async () => {
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      fireEvent.click(screen.getByText(CREATE_LEDGER_DIALOG_COPY.submitButton));
      await waitFor(() => {
        expect(
          screen.getByText(CREATE_LEDGER_DIALOG_COPY.nameRequiredError),
        ).toBeDefined();
      });
    });

    it("does not call onSubmit when name is empty", async () => {
      const mockSubmit = vi.fn();
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={mockSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      const submitBtn = screen.getByText(
        CREATE_LEDGER_DIALOG_COPY.submitButton,
      );
      fireEvent.click(submitBtn);
      await waitFor(() => {
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });

    it("shows cash cap invalid error when submitting with negative cash cap", async () => {
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.nameLabel),
        {
          target: { value: "Test Ledger" },
        },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.cashCapLabel),
        { target: { value: "-100" } },
      );
      const submitBtn = screen.getByText(
        CREATE_LEDGER_DIALOG_COPY.submitButton,
      );
      fireEvent.click(submitBtn);
      await waitFor(() => {
        expect(
          screen.getByText(CREATE_LEDGER_DIALOG_COPY.cashCapInvalidError),
        ).toBeDefined();
      });
    });
  });

  describe("submission", () => {
    it("calls onSubmit with name and no cashCap when cash cap is empty", async () => {
      const mockSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={mockSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.nameLabel),
        {
          target: { value: "My Ledger" },
        },
      );
      fireEvent.click(screen.getByText(CREATE_LEDGER_DIALOG_COPY.submitButton));
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          name: "My Ledger",
          cashCap: undefined,
        });
      });
    });

    it("calls onSubmit with name and numeric cashCap when provided", async () => {
      const mockSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={mockSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.nameLabel),
        {
          target: { value: "Savings" },
        },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.cashCapLabel),
        { target: { value: "500" } },
      );
      fireEvent.click(screen.getByText(CREATE_LEDGER_DIALOG_COPY.submitButton));
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          name: "Savings",
          cashCap: 500,
        });
      });
    });

    it("shows submit error when onSubmit rejects", async () => {
      const mockSubmit = vi.fn().mockRejectedValue(new Error("Firebase error"));
      render(
        <CreateLedgerDialog
          open={true}
          onSubmit={mockSubmit}
          onClose={onClose}
          isSubmitting={false}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.nameLabel),
        {
          target: { value: "Bad Ledger" },
        },
      );
      fireEvent.click(screen.getByText(CREATE_LEDGER_DIALOG_COPY.submitButton));
      await waitFor(() => {
        expect(screen.getByText(/Firebase error/)).toBeDefined();
      });
    });
  });
});
