import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { EditLedgerDialog } from "./EditLedgerDialog";
import { EDIT_LEDGER_DIALOG_COPY } from "./copy";

afterEach(cleanup);

function renderDialog(
  overrides: Partial<Parameters<typeof EditLedgerDialog>[0]> = {},
) {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const props = {
    ledgerId: "ledger-1",
    initialName: "Everyday Spending",
    initialCashCap: 500,
    onSave,
    ...overrides,
  };
  const result = render(<EditLedgerDialog {...props} />);
  return { ...result, onSave };
}

function openDialog(ledgerName = "Everyday Spending") {
  const trigger = screen.getByRole("button", {
    name: `${EDIT_LEDGER_DIALOG_COPY.editButton} ${ledgerName}`,
  });
  fireEvent.click(trigger);
}

describe("EditLedgerDialog", () => {
  describe("trigger button", () => {
    it("renders an edit button with accessible name including the ledger name", () => {
      renderDialog({ initialName: "My Ledger" });
      expect(
        screen.getByRole("button", {
          name: `${EDIT_LEDGER_DIALOG_COPY.editButton} My Ledger`,
        }),
      ).toBeDefined();
    });
  });

  describe("dialog open state", () => {
    it("shows the dialog title after clicking the edit button", () => {
      renderDialog();
      openDialog();
      expect(
        screen.getByText(EDIT_LEDGER_DIALOG_COPY.dialogTitle),
      ).toBeDefined();
    });

    it("pre-populates the name field with the initial name", () => {
      renderDialog({ initialName: "Vacation" });
      openDialog("Vacation");
      const nameInput = screen.getByLabelText(
        EDIT_LEDGER_DIALOG_COPY.nameLabel,
      );
      expect((nameInput as HTMLInputElement).value).toBe("Vacation");
    });

    it("pre-populates the cash cap field with the initial value", () => {
      renderDialog({ initialCashCap: 1200 });
      openDialog();
      const cashCapInput = screen.getByLabelText(
        EDIT_LEDGER_DIALOG_COPY.cashCapLabel,
      );
      expect((cashCapInput as HTMLInputElement).value).toBe("1200");
    });

    it("leaves cash cap empty when initial cash cap is undefined", () => {
      renderDialog({ initialCashCap: undefined });
      openDialog();
      const cashCapInput = screen.getByLabelText(
        EDIT_LEDGER_DIALOG_COPY.cashCapLabel,
      );
      expect((cashCapInput as HTMLInputElement).value).toBe("");
    });
  });

  describe("form submission", () => {
    it("calls onSave with the ledger id and updated values on valid submit", async () => {
      const { onSave } = renderDialog({
        initialName: "Old Name",
        initialCashCap: undefined,
      });
      openDialog("Old Name");
      const nameInput = screen.getByLabelText(
        EDIT_LEDGER_DIALOG_COPY.nameLabel,
      );
      fireEvent.change(nameInput, { target: { value: "New Name" } });
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_LEDGER_DIALOG_COPY.saveButton,
        }),
      );
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith("ledger-1", {
          name: "New Name",
          cashCap: null,
        });
      });
    });

    it("calls onSave with a numeric cashCap when provided", async () => {
      const { onSave } = renderDialog({
        initialName: "Groceries",
        initialCashCap: undefined,
      });
      openDialog("Groceries");
      fireEvent.change(
        screen.getByLabelText(EDIT_LEDGER_DIALOG_COPY.cashCapLabel),
        { target: { value: "750" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_LEDGER_DIALOG_COPY.saveButton,
        }),
      );
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith("ledger-1", {
          name: "Groceries",
          cashCap: 750,
        });
      });
    });

    it("does not call onSave when name is empty", () => {
      const { onSave } = renderDialog();
      openDialog();
      fireEvent.change(
        screen.getByLabelText(EDIT_LEDGER_DIALOG_COPY.nameLabel),
        { target: { value: "" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_LEDGER_DIALOG_COPY.saveButton,
        }),
      );
      expect(onSave).not.toHaveBeenCalled();
      expect(
        screen.getByText(EDIT_LEDGER_DIALOG_COPY.nameRequired),
      ).toBeDefined();
    });

    it("does not call onSave when cash cap is negative", () => {
      const { onSave } = renderDialog();
      openDialog();
      fireEvent.change(
        screen.getByLabelText(EDIT_LEDGER_DIALOG_COPY.cashCapLabel),
        { target: { value: "-100" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_LEDGER_DIALOG_COPY.saveButton,
        }),
      );
      expect(onSave).not.toHaveBeenCalled();
      expect(
        screen.getByText(EDIT_LEDGER_DIALOG_COPY.cashCapInvalid),
      ).toBeDefined();
    });

    it("displays a submit error when onSave rejects", async () => {
      const { onSave } = renderDialog();
      onSave.mockRejectedValue(new Error("Network error"));
      openDialog();
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_LEDGER_DIALOG_COPY.saveButton,
        }),
      );
      await waitFor(() => {
        expect(
          screen.getByText(EDIT_LEDGER_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
    });
  });

  describe("cancel", () => {
    it("does not call onSave when cancel is clicked", () => {
      const { onSave } = renderDialog();
      openDialog();
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_LEDGER_DIALOG_COPY.cancelButton,
        }),
      );
      expect(onSave).not.toHaveBeenCalled();
    });

    it("resets form state when reopened after cancel", () => {
      renderDialog({ initialName: "Original Name" });
      openDialog("Original Name");
      fireEvent.change(
        screen.getByLabelText(EDIT_LEDGER_DIALOG_COPY.nameLabel),
        { target: { value: "Edited Name" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_LEDGER_DIALOG_COPY.cancelButton,
        }),
      );
      openDialog("Original Name");
      const nameInput = screen.getByLabelText(
        EDIT_LEDGER_DIALOG_COPY.nameLabel,
      );
      expect((nameInput as HTMLInputElement).value).toBe("Original Name");
    });
  });
});
