import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NewLedgerDialogView } from "./NewLedgerDialog";
import { NEW_LEDGER_DIALOG_COPY } from "./copy";

afterEach(cleanup);

function renderView(
  overrides: Partial<Parameters<typeof NewLedgerDialogView>[0]> = {},
) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    name: "",
    onNameChange: vi.fn(),
    cashCap: "",
    onCashCapChange: vi.fn(),
    nameError: undefined,
    cashCapError: undefined,
    onSubmit: vi.fn(),
    isSubmitting: false,
    ...overrides,
  };
  render(<NewLedgerDialogView {...props} />);
  return props;
}

describe("NewLedgerDialogView", () => {
  describe("empty form", () => {
    it("renders the dialog title", () => {
      renderView();
      expect(screen.getByText(NEW_LEDGER_DIALOG_COPY.title)).toBeDefined();
    });

    it("renders the name label", () => {
      renderView();
      expect(screen.getByText(NEW_LEDGER_DIALOG_COPY.nameLabel)).toBeDefined();
    });

    it("renders the cash cap label", () => {
      renderView();
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.cashCapLabel),
      ).toBeDefined();
    });

    it("renders the submit button", () => {
      renderView();
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.submitButton),
      ).toBeDefined();
    });

    it("renders the cancel button", () => {
      renderView();
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.cancelButton),
      ).toBeDefined();
    });

    it("does not render name error when nameError is undefined", () => {
      renderView({ nameError: undefined });
      expect(screen.queryByText(NEW_LEDGER_DIALOG_COPY.nameError)).toBeNull();
    });

    it("does not render cash cap error when cashCapError is undefined", () => {
      renderView({ cashCapError: undefined });
      expect(
        screen.queryByText(NEW_LEDGER_DIALOG_COPY.cashCapError),
      ).toBeNull();
    });
  });

  describe("validation error state", () => {
    it("renders the name error message", () => {
      renderView({ nameError: NEW_LEDGER_DIALOG_COPY.nameError });
      expect(screen.getByText(NEW_LEDGER_DIALOG_COPY.nameError)).toBeDefined();
    });

    it("renders the cash cap error message", () => {
      renderView({ cashCapError: NEW_LEDGER_DIALOG_COPY.cashCapError });
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.cashCapError),
      ).toBeDefined();
    });
  });

  describe("interactions", () => {
    it("calls onSubmit when the submit button is clicked", () => {
      const onSubmit = vi.fn();
      renderView({ onSubmit });
      fireEvent.click(screen.getByText(NEW_LEDGER_DIALOG_COPY.submitButton));
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    it("calls onNameChange when the name input changes", () => {
      const onNameChange = vi.fn();
      renderView({ onNameChange });
      fireEvent.change(
        screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.nameLabel),
        {
          target: { value: "My Budget" },
        },
      );
      expect(onNameChange).toHaveBeenCalledWith("My Budget");
    });

    it("calls onCashCapChange when the cash cap input changes", () => {
      const onCashCapChange = vi.fn();
      renderView({ onCashCapChange });
      fireEvent.change(
        screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.cashCapLabel),
        { target: { value: "500" } },
      );
      expect(onCashCapChange).toHaveBeenCalledWith("500");
    });

    it("disables the submit button while submitting", () => {
      renderView({ isSubmitting: true });
      expect(
        screen
          .getByText(NEW_LEDGER_DIALOG_COPY.submitButton)
          .hasAttribute("disabled"),
      ).toBe(true);
    });

    it("disables the cancel button while submitting", () => {
      renderView({ isSubmitting: true });
      expect(
        screen
          .getByText(NEW_LEDGER_DIALOG_COPY.cancelButton)
          .hasAttribute("disabled"),
      ).toBe(true);
    });
  });
});
